"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import {
  QUESTION_REPORT_STATUSES,
  type QuestionReportStatus,
} from "@/types/app";

export type ReportActionResult = { ok: true } | { ok: false; message: string };

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Saves the admin reply + status, then pushes the reply to the learner who
 * filed the report. The notification is the whole point: the reporter should
 * never have to come back and check.
 */
export async function replyToReport(input: {
  reportId: string;
  status: string;
  reply: string;
}): Promise<ReportActionResult> {
  const viewer = await requireAdmin();

  const reportId = text(input.reportId, 60);
  const reply = text(input.reply, 4000);
  const status: QuestionReportStatus = (
    QUESTION_REPORT_STATUSES as readonly string[]
  ).includes(input.status)
    ? (input.status as QuestionReportStatus)
    : "reviewing";

  const { data: report, error } = await viewer.supabase
    .from("question_reports")
    .update({
      status,
      admin_reply: reply,
      replied_at: reply ? new Date().toISOString() : null,
    })
    .eq("id", reportId)
    .select("user_id, question_prompt, course_slug")
    .maybeSingle<{
      user_id: string;
      question_prompt: string;
      course_slug: string | null;
    }>();

  if (error || !report) {
    console.error("Could not update the report:", error?.message);
    return {
      ok: false,
      message:
        error?.code === "42P01"
          ? "Run supabase/schema-20261104.sql to create question_reports."
          : "Could not save the reply.",
    };
  }

  if (reply) {
    const { error: notifyError } = await viewer.supabase
      .from("notifications")
      .insert({
        user_id: report.user_id,
        actor_id: viewer.userId,
        type: "report_replied",
        title: "We replied to your question report",
        body: reply,
        link: "/notifications",
      });

    if (notifyError) {
      console.warn("Could not notify the reporter:", notifyError.message);
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Question edits made directly from a report block. Writes the new prompt,
 * options and answer back to the live question and tells the reporter.
 */
export async function updateReportedQuestion(input: {
  reportId: string;
  courseSlug: string;
  externalId: string;
  prompt: string;
  options: string[];
  answers: number[];
  explanation: string;
}): Promise<ReportActionResult> {
  const viewer = await requireAdmin();

  const courseSlug = text(input.courseSlug, 120);
  const externalId = text(input.externalId, 120);
  const prompt = text(input.prompt, 4000);
  const options = Array.isArray(input.options)
    ? input.options.map((option) => text(option, 600)).filter(Boolean).slice(0, 12)
    : [];
  const answers = Array.isArray(input.answers)
    ? [...new Set(input.answers.map(Number))]
        .filter((value) => Number.isInteger(value) && value >= 0 && value < options.length)
        .sort((a, b) => a - b)
    : [];

  if (!courseSlug || !externalId) {
    return { ok: false, message: "That report is not linked to a stored question." };
  }

  if (prompt.length < 5) {
    return { ok: false, message: "The question text is too short." };
  }

  if (options.length < 2) {
    return { ok: false, message: "A question needs at least two options." };
  }

  if (answers.length === 0) {
    return { ok: false, message: "Mark at least one option as correct." };
  }

  const { error } = await viewer.supabase
    .from("questions")
    .update({
      prompt,
      options,
      answer_index: answers[0],
      answer_text: options[answers[0]] ?? null,
      answer_indexes: answers,
      is_multi: answers.length > 1,
      explanation: text(input.explanation, 4000),
    })
    .eq("course_slug", courseSlug)
    .eq("external_id", externalId);

  if (error) {
    console.error("Could not update the reported question:", error.message);
    return { ok: false, message: "Could not save the question edit." };
  }

  const { data: report } = await viewer.supabase
    .from("question_reports")
    .select("user_id")
    .eq("id", text(input.reportId, 60))
    .maybeSingle<{ user_id: string }>();

  if (report) {
    const { error: notifyError } = await viewer.supabase
      .from("notifications")
      .insert({
        user_id: report.user_id,
        actor_id: viewer.userId,
        type: "question_updated",
        title: "The question you reported was fixed",
        body: prompt.slice(0, 180),
        link: `/courses/${courseSlug}`,
      });

    if (notifyError) {
      console.warn("Could not notify the reporter:", notifyError.message);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/courses/${courseSlug}`);
  return { ok: true };
}
