"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import {
  normalizeDraftMeta,
  normalizeSections,
  type StudioCourse,
} from "@/lib/content/cms";
import { listCourseQuestions } from "@/lib/content/questionBank";
import { parseQuestionBank, isTestFormat } from "@/types/questionBank";
import type { BankQuestion } from "@/types/questionBank";
import { safeRedirectPath } from "@/lib/security/redirect";

const QUESTION_CHUNK = 200;

export type StudioResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; message: string };

type CourseInput = {
  title: string;
  summary: string;
  track: string;
  level: string;
  estimatedHours: number;
  accentFrom: string;
  accentTo: string;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isHexColour(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function validateCourseInput(input: CourseInput) {
  const title = clean(input.title, 120);
  const summary = clean(input.summary, 500);
  const track = clean(input.track, 80) || "Exam track";
  const level = clean(input.level, 60) || "All levels";
  const estimatedHours = Math.round(Number(input.estimatedHours));

  if (title.length < 3) {
    return { ok: false as const, message: "Give the course a title of at least 3 characters." };
  }

  if (!Number.isFinite(estimatedHours) || estimatedHours < 1 || estimatedHours > 200) {
    return { ok: false as const, message: "Estimated hours must be between 1 and 200." };
  }

  if (!isHexColour(input.accentFrom) || !isHexColour(input.accentTo)) {
    return { ok: false as const, message: "Pick valid hex colours for the course gradient." };
  }

  return {
    ok: true as const,
    value: { title, summary, track, level, estimatedHours },
  };
}

export async function createCourse(
  input: CourseInput,
): Promise<StudioResult<{ course: StudioCourse }>> {
  const viewer = await requireAdmin();
  const validation = validateCourseInput(input);

  if (!validation.ok) return validation;

  const base = slugify(validation.value.title);

  if (!base) {
    return { ok: false, message: "That title cannot be turned into a URL slug." };
  }

  let slug = base;
  let created: StudioCourse | null = null;

  for (let attempt = 0; attempt < 20 && !created; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;

    const { data: existing } = await viewer.supabase
      .from("courses")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle<{ id: string }>();

    if (existing) continue;

    const { data: last } = await viewer.supabase
      .from("courses")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle<{ position: number }>();

    const { data: row, error } = await viewer.supabase
      .from("courses")
      .insert({
        slug: candidate,
        title: validation.value.title,
        summary: validation.value.summary,
        track: validation.value.track,
        level: validation.value.level,
        accent_from: input.accentFrom,
        accent_to: input.accentTo,
        href: `/courses/${candidate}`,
        icon: "work",
        estimated_hours: validation.value.estimatedHours,
        position: Number(last?.position ?? 0) + 1,
        is_published: true,
      })
      .select(
        "id, slug, title, summary, track, level, accent_from, accent_to, href, estimated_hours, position, is_published",
      )
      .maybeSingle<{
        id: string;
        slug: string;
        title: string;
        summary: string;
        track: string;
        level: string;
        accent_from: string;
        accent_to: string;
        href: string;
        estimated_hours: number;
        position: number;
        is_published: boolean;
      }>();

    if (error || !row) {
      if (error?.code === "23505") {
        slug = candidate;
        continue;
      }

      console.error("Could not create course:", error?.message);
      return { ok: false, message: "Could not create that course. Try another title." };
    }

    await viewer.supabase
      .from("course_pages")
      .upsert({ course_slug: row.slug, sections: [] }, { onConflict: "course_slug" });

    await viewer.supabase.from("activity_events").insert({
      user_id: viewer.userId,
      event_type: "course_created",
      course_slug: row.slug,
      summary: `Created the course ${row.title}`,
      metadata: { courseId: row.id },
    });

    created = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      track: row.track,
      level: row.level,
      accentFrom: row.accent_from,
      accentTo: row.accent_to,
      href: row.href,
      estimatedHours: Number(row.estimated_hours),
      position: Number(row.position),
      isPublished: Boolean(row.is_published),
    };
    slug = candidate;
  }

  if (!created) {
    return { ok: false, message: "Could not find an unused URL for that title." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/courses/${created.slug}`);

  return { ok: true, course: created };
}

export async function updateCourse(input: {
  id: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  estimatedHours: number;
  accentFrom: string;
  accentTo: string;
  href: string;
  isPublished: boolean;
}): Promise<StudioResult> {
  const viewer = await requireAdmin();
  const validation = validateCourseInput(input);

  if (!validation.ok) return validation;

  const { data: existing } = await viewer.supabase
    .from("courses")
    .select("slug, href")
    .eq("id", input.id)
    .maybeSingle<{ slug: string; href: string }>();

  if (!existing) {
    return { ok: false, message: "That course no longer exists." };
  }

  const href = safeRedirectPath(input.href, existing.href);

  const { error } = await viewer.supabase
    .from("courses")
    .update({
      title: validation.value.title,
      summary: validation.value.summary,
      track: validation.value.track,
      level: validation.value.level,
      estimated_hours: validation.value.estimatedHours,
      accent_from: input.accentFrom,
      accent_to: input.accentTo,
      href,
      is_published: Boolean(input.isPublished),
    })
    .eq("id", input.id);

  if (error) {
    console.error("Could not update course:", error.message);
    return { ok: false, message: "Could not save the course details." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/courses/${existing.slug}`);

  return { ok: true };
}

export async function saveCourseDraft(
  slug: string,
  meta: unknown,
  sections: unknown,
): Promise<StudioResult<{ savedAt: string }>> {
  const viewer = await requireAdmin();

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle<{ slug: string }>();

  if (!course) {
    return { ok: false, message: "That course no longer exists." };
  }

  const cleanMeta = normalizeDraftMeta(meta);

  if (!cleanMeta) {
    return { ok: false, message: "Could not read the draft details." };
  }

  const savedAt = new Date().toISOString();
  const { error } = await viewer.supabase.from("course_drafts").upsert(
    {
      course_slug: course.slug,
      payload: {
        meta: cleanMeta,
        sections: normalizeSections(sections),
      },
      updated_by: viewer.userId,
      updated_at: savedAt,
    },
    { onConflict: "course_slug" },
  );

  if (error) {
    console.error("Could not autosave course draft:", error.message);
    return {
      ok: false,
      message:
        "Could not autosave the draft. Re-run supabase/schema.sql to create the course_drafts table.",
    };
  }

  return { ok: true, savedAt };
}

export async function saveCoursePage(
  slug: string,
  sections: unknown,
): Promise<StudioResult> {
  const viewer = await requireAdmin();

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("slug, title")
    .eq("slug", slug)
    .maybeSingle<{ slug: string; title: string; id: string }>();

  if (!course) {
    return { ok: false, message: "That course no longer exists." };
  }

  const cleanSections = normalizeSections(sections);

  const { error } = await viewer.supabase.from("course_pages").upsert(
    {
      course_slug: course.slug,
      sections: cleanSections,
      updated_by: viewer.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_slug" },
  );

  if (error) {
    console.error("Could not save course page:", error.message);
    return { ok: false, message: "Could not save the page content." };
  }

  // Publishing makes the draft the live page, so there is nothing left to
  // autosave. A missing table is harmless here: the live save already worked.
  const { error: draftError } = await viewer.supabase
    .from("course_drafts")
    .delete()
    .eq("course_slug", course.slug);

  if (draftError) {
    console.warn("Could not clear the published course draft:", draftError.message);
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "course_page_updated",
    course_slug: course.slug,
    summary: `Updated the content for ${course.title}`,
    metadata: { sections: cleanSections.length },
  });

  revalidatePath("/admin");
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath(`/page/${course.slug}`);

  return { ok: true };
}

export async function loadQuestionBank(
  slug: string,
): Promise<StudioResult<{ questions: BankQuestion[] }>> {
  await requireAdmin();

  // The studio editor opens lazily, so a failed read is surfaced as an empty
  // bank rather than blocking the course page itself.
  return { ok: true, questions: await listCourseQuestions(slug) };
}

export async function saveQuestionBank(input: {
  slug: string;
  format: string;
  questions: unknown;
  mode: "replace" | "append";
}): Promise<StudioResult<{ count: number; errors: string[] }>> {
  const viewer = await requireAdmin();

  const slug = clean(input.slug, 120);
  const mode = input.mode === "append" ? "append" : "replace";
  const format = isTestFormat(input.format) ? input.format : "exam-index";

  if (!slug) {
    return { ok: false, message: "Choose a course first." };
  }

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("slug, title")
    .eq("slug", slug)
    .maybeSingle<{ slug: string; title: string }>();

  if (!course) {
    return { ok: false, message: "That course no longer exists." };
  }

  const parsed = parseQuestionBank(input.questions, format);

  if (parsed.questions.length === 0) {
    return {
      ok: false,
      message: parsed.errors[0] ?? "There are no questions to save.",
    };
  }

  const seen = new Set<string>();
  const rows = parsed.questions.map((question, index) => {
    let externalId = question.externalId || `q-${index + 1}`;

    while (seen.has(externalId)) {
      externalId = `${externalId}-${index + 1}`;
    }

    seen.add(externalId);
    const correct = question.answers[0];

    return {
      course_slug: slug,
      external_id: externalId,
      category: question.category || null,
      prompt: question.prompt,
      options: question.options,
      answer_index: correct,
      answer_text: question.options[correct] ?? null,
      answer_indexes: question.answers,
      is_multi: question.multiple,
      format: question.format,
      explanation: question.explanation,
      image_url: question.imageUrl || null,
      position: mode === "append" ? 10_000 + index : index,
    };
  });

  if (mode === "replace") {
    const { error: clearError } = await viewer.supabase
      .from("questions")
      .delete()
      .eq("course_slug", slug);

    if (clearError) {
      console.error("Could not clear the question bank:", clearError.message);
      return { ok: false, message: "Could not replace the existing questions." };
    }
  }

  for (let start = 0; start < rows.length; start += QUESTION_CHUNK) {
    const chunk = rows.slice(start, start + QUESTION_CHUNK);

    const { error } = await viewer.supabase
      .from("questions")
      .upsert(chunk, { onConflict: "course_slug,external_id" });

    if (error) {
      console.error("Could not save the question bank:", error.message);
      return {
        ok: false,
        message:
          error.code === "42703"
            ? "Re-run supabase/schema.sql to add the new question columns."
            : "Could not save the question bank. Check the JSON and try again.",
      };
    }
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "question_bank_updated",
    course_slug: slug,
    summary: `Updated the question bank for ${course.title}`,
    metadata: { count: rows.length, mode, format },
  });

  revalidatePath("/admin");
  revalidatePath(`/courses/${slug}`);

  return { ok: true, count: rows.length, errors: parsed.errors };
}

export async function deleteCourse(
  input: { id: string },
): Promise<StudioResult> {
  const viewer = await requireAdmin();

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("slug, title")
    .eq("id", input.id)
    .maybeSingle<{ slug: string; title: string; id: string }>();

  if (!course) {
    return { ok: false, message: "That course no longer exists." };
  }

  // Deleting the course row cascades to its page, questions, modules,
  // enrollments and recap completions. Attempts and submissions keep their
  // history with a null course_slug.
  const { data: deleted, error: courseError } = await viewer.supabase
    .from("courses")
    .delete()
    .eq("id", input.id)
    .select("id");

  if (courseError) {
    console.error("Could not delete the course:", courseError.message);
    return {
      ok: false,
      message:
        courseError.code === "42501"
          ? "Your account is not allowed to delete courses."
          : "Could not delete the course. Try again.",
    };
  }

  if (!deleted || deleted.length === 0) {
    return {
      ok: false,
      message: "Nothing was deleted — re-run supabase/schema.sql so admins can delete courses.",
    };
  }

  const draftResult = await viewer.supabase
    .from("course_drafts")
    .delete()
    .eq("course_slug", course.slug);

  if (draftResult.error) {
    console.warn("Could not delete the course draft:", draftResult.error.message);
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "course_deleted",
    course_slug: course.slug,
    summary: `Deleted the course ${course.title}`,
    metadata: { courseId: course.id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard");

  return { ok: true };
}
