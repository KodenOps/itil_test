import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { QUESTION_REPORT_ISSUES } from "@/types/app";

export const dynamic = "force-dynamic";

type Body = {
  questionId?: string;
  questionPrompt?: string;
  courseSlug?: string;
  issueType?: string;
  description?: string;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** A learner flags a question. The report shows up on the admin dashboard. */
export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json(
      { ok: false, message: "Sign in to report a question." },
      { status: 401 },
    );
  }

  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Send the report as JSON." },
      { status: 400 },
    );
  }

  const questionId = text(body.questionId, 120);
  const issueType = text(body.issueType, 40);
  const description = text(body.description, 2000);

  if (!questionId) {
    return NextResponse.json(
      { ok: false, message: "That question could not be identified." },
      { status: 400 },
    );
  }

  if (!(QUESTION_REPORT_ISSUES as readonly string[]).includes(issueType)) {
    return NextResponse.json(
      { ok: false, message: "Pick what is wrong with the question." },
      { status: 400 },
    );
  }

  const { error } = await viewer.supabase.from("question_reports").insert({
    user_id: viewer.userId,
    question_id: questionId,
    question_prompt: text(body.questionPrompt, 2000),
    course_slug: text(body.courseSlug, 120) || null,
    issue_type: issueType,
    description,
  });

  if (error) {
    console.error("Could not save the question report:", error.message);
    return NextResponse.json(
      {
        ok: false,
        message:
          error.code === "42P01"
            ? "Reporting is not set up yet. Ask an admin to run the schema."
            : "Could not send the report. Try again in a moment.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks — an admin will look at this and reply in your notifications.",
  });
}
