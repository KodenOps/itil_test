"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import { normalizeSections } from "@/lib/content/cms";
import { isTestFormat, parseQuestionBank, type BankQuestion } from "@/types/questionBank";

export type ImportResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; message: string };

type CourseBundle = {
  course?: Record<string, unknown>;
  sections?: unknown;
  questions?: unknown;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function hex(value: unknown, fallback: string): string {
  const raw = text(value, 7);
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Course creation is JSON-only: one file carries the course row, the page
 * sections and the question bank. Everything is re-validated here because the
 * browser could have sent anything.
 */
export async function importCourseBundle(
  rawJson: string,
  options: { publish: boolean },
): Promise<
  ImportResult<{ slug: string; sections: number; questions: number; warnings: string[] }>
> {
  const viewer = await requireAdmin();

  let parsed: CourseBundle;

  try {
    parsed = JSON.parse(rawJson) as CourseBundle;
  } catch {
    return { ok: false, message: "That is not valid JSON. Fix the syntax and try again." };
  }

  if (!parsed || typeof parsed !== "object" || !parsed.course) {
    return {
      ok: false,
      message: "The file needs a top-level `course` object. Load the sample to see the shape.",
    };
  }

  const course = parsed.course;
  const title = text(course.title, 120);
  const summary = text(course.summary, 500);
  const slug = slugify(text(course.slug, 80) || title);

  if (title.length < 3) {
    return { ok: false, message: "`course.title` needs at least 3 characters." };
  }

  if (!slug) {
    return { ok: false, message: "`course.slug` cannot be turned into a URL." };
  }

  const estimatedHours = Math.round(Number(course.estimatedHours ?? 12));

  if (!Number.isFinite(estimatedHours) || estimatedHours < 1 || estimatedHours > 200) {
    return { ok: false, message: "`course.estimatedHours` must be between 1 and 200." };
  }

  const sections = normalizeSections(parsed.sections);
  const warnings: string[] = [];

  if (sections.length === 0) {
    warnings.push("No page sections were found — the course page will be empty.");
  }

  const questionFormat = isTestFormat(course.questionFormat)
    ? course.questionFormat
    : "practice-index";

  const bank = parseQuestionBank(parsed.questions ?? [], questionFormat);

  if (bank.errors.length > 0) {
    warnings.push(...bank.errors.slice(0, 5));
  }

  const { data: existing } = await viewer.supabase
    .from("courses")
    .select("id, position")
    .eq("slug", slug)
    .maybeSingle<{ id: string; position: number }>();

  const row = {
    slug,
    title,
    summary,
    track: text(course.track, 80) || "Exam track",
    level: text(course.level, 60) || "All levels",
    accent_from: hex(course.accentFrom, "#2660A4"),
    accent_to: hex(course.accentTo, "#4F8FCA"),
    href: text(course.href, 200) || `/courses/${slug}`,
    icon: text(course.icon, 40) || "work",
    estimated_hours: estimatedHours,
    position: Number.isFinite(Number(course.position))
      ? Number(course.position)
      : (existing?.position ?? 0),
    is_published: Boolean(options.publish),
  };

  const { data: savedCourse, error: courseError } = existing
    ? await viewer.supabase
        .from("courses")
        .update(row)
        .eq("id", existing.id)
        .select("slug")
        .maybeSingle<{ slug: string }>()
    : await viewer.supabase
        .from("courses")
        .insert(row)
        .select("slug")
        .maybeSingle<{ slug: string }>();

  if (courseError || !savedCourse) {
    console.error("Could not import the course:", courseError?.message);
    return { ok: false, message: "Could not save the course. Try a different slug." };
  }

  const { error: pageError } = await viewer.supabase.from("course_pages").upsert(
    {
      course_slug: slug,
      sections,
      updated_by: viewer.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_slug" },
  );

  if (pageError) {
    console.error("Could not save the course page:", pageError.message);
    warnings.push("The course row saved but its page sections did not.");
  }

  if (bank.questions.length > 0) {
    const rows = bank.questions.map((question: BankQuestion, index: number) => ({
      course_slug: slug,
      external_id: question.externalId,
      category: question.category || null,
      prompt: question.prompt,
      options: question.options,
      answer_index: question.answers[0] ?? null,
      answer_text: question.options[question.answers[0] ?? 0] ?? null,
      answer_indexes: question.answers,
      is_multi: question.multiple,
      format: question.format,
      explanation: question.explanation,
      image_url: question.imageUrl || null,
      position: index,
    }));

    const { error: questionError } = await viewer.supabase
      .from("questions")
      .upsert(rows, { onConflict: "course_slug,external_id" });

    if (questionError) {
      console.error("Could not import the questions:", questionError.message);
      warnings.push(
        questionError.code === "42703"
          ? "Questions saved without the newer columns — re-run supabase/schema.sql."
          : "The questions in the file could not be saved.",
      );
    }
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "course_imported",
    course_slug: slug,
    summary: `Imported ${title} from JSON`,
    metadata: {
      sections: sections.length,
      questions: bank.questions.length,
      published: Boolean(options.publish),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/courses/${slug}`);

  return {
    ok: true,
    slug,
    sections: sections.length,
    questions: bank.questions.length,
    warnings,
  };
}

/* ───────────────────────── Question bank drafts ───────────────────────── */

export type DraftQuestion = {
  externalId: string;
  category: string;
  prompt: string;
  options: string[];
  answers: number[];
  multiple: boolean;
  explanation: string;
  imageUrl: string;
  format: string;
};

export async function saveQuestionDraft(
  courseSlug: string,
  questions: DraftQuestion[],
): Promise<ImportResult<{ savedAt: string }>> {
  const viewer = await requireAdmin();

  if (!courseSlug) {
    return { ok: false, message: "Pick a course first." };
  }

  const savedAt = new Date().toISOString();
  const { error } = await viewer.supabase.from("question_bank_drafts").upsert(
    {
      course_slug: courseSlug,
      questions,
      updated_by: viewer.userId,
      updated_at: savedAt,
    },
    { onConflict: "course_slug" },
  );

  if (error) {
    console.error("Could not save the question draft:", error.message);
    return {
      ok: false,
      message:
        error.code === "42P01"
          ? "Run supabase/schema-20261104.sql to create the draft table."
          : "Could not save the draft.",
    };
  }

  revalidatePath("/admin");
  return { ok: true, savedAt };
}

export async function clearQuestionDraft(courseSlug: string): Promise<ImportResult> {
  const viewer = await requireAdmin();

  const { error } = await viewer.supabase
    .from("question_bank_drafts")
    .delete()
    .eq("course_slug", courseSlug);

  if (error) {
    console.error("Could not clear the question draft:", error.message);
    return { ok: false, message: "Could not clear that draft." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function listQuestionDrafts(): Promise<Record<string, unknown[]>> {
  const viewer = await requireAdmin();

  const { data, error } = await viewer.supabase
    .from("question_bank_drafts")
    .select("course_slug, questions")
    .returns<{ course_slug: string; questions: unknown }[]>();

  if (error) {
    if (error.code !== "42P01") {
      console.error("Could not load question drafts:", error.message);
    }
    return {};
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [
      row.course_slug,
      Array.isArray(row.questions) ? row.questions : [],
    ]),
  );
}
