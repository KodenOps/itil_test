import { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Number of quick-recap sections per track. This is the server-side source
 * of truth for the recap share of progress, so a client cannot inflate its
 * own percentage by sending a different total.
 */
export const RECAP_TOTALS: Record<string, number> = {
  "itil-foundation": 31,
  "itil-strategist": 31,
  "excel-fundamentals": 48,
  "power-bi": 29,
  kcna: 13,
  "aws-cloud-practitioner": 14,
  "devops-sys-engineer": 6,
};

/** Tracks with an extra practical assessment (manual grading). */
export const PRACTICAL_COURSES = new Set(["excel-fundamentals"]);

/** Tracks that do not have an assessment yet — recaps carry 100%. */
export const RECAP_ONLY_COURSES = new Set(["power-bi"]);

export const RECAP_SHARE = 40;
export const MCQ_SHARE = 60;
export const PRACTICAL_MCQ_SHARE = 50;
export const PRACTICAL_SHARE = 10;
export const ATTEMPT_POINTS = 20;
/** A qualifying attempt is strictly above 80%. */
export const QUALIFYING_SCORE = 80;
/** The practical only contributes once graded at 70% or higher. */
export const PRACTICAL_PASS_SCORE = 70;

export type CourseProgressBreakdown = {
  courseSlug: string;
  progress: number;
  recapCompleted: number;
  recapTotal: number;
  recapPoints: number;
  mcqPoints: number;
  practicalPoints: number;
  qualifyingAttempts: number;
  practicalScore: number | null;
  hasAssessment: boolean;
};

type EnrollmentForProgress = {
  id: string;
  status: string;
  progress: number;
  progress_reset_at: string | null;
  completed_at: string | null;
};

export function getRecapTotal(courseSlug: string) {
  return RECAP_TOTALS[courseSlug] ?? 0;
}

export function computeProgress(input: {
  courseSlug: string;
  recapCompleted: number;
  qualifyingAttempts: number;
  practicalScore: number | null;
}): Omit<CourseProgressBreakdown, "courseSlug"> {
  const recapTotal = getRecapTotal(input.courseSlug);
  const recapCompleted = Math.max(
    0,
    Math.min(recapTotal, Math.floor(input.recapCompleted)),
  );

  if (RECAP_ONLY_COURSES.has(input.courseSlug)) {
    const progress =
      recapTotal > 0 ? Math.round((recapCompleted / recapTotal) * 100) : 0;

    return {
      progress: Math.min(100, progress),
      recapCompleted,
      recapTotal,
      recapPoints: progress,
      mcqPoints: 0,
      practicalPoints: 0,
      qualifyingAttempts: 0,
      practicalScore: null,
      hasAssessment: false,
    };
  }

  const hasPractical = PRACTICAL_COURSES.has(input.courseSlug);
  const mcqShare = hasPractical ? PRACTICAL_MCQ_SHARE : MCQ_SHARE;
  const recapPoints =
    recapTotal > 0
      ? Math.round((recapCompleted / recapTotal) * RECAP_SHARE * 10) / 10
      : 0;
  const mcqPoints = Math.min(
    mcqShare,
    Math.max(0, Math.floor(input.qualifyingAttempts)) * ATTEMPT_POINTS,
  );
  const practicalPoints =
    hasPractical &&
    input.practicalScore !== null &&
    input.practicalScore >= PRACTICAL_PASS_SCORE
      ? PRACTICAL_SHARE
      : 0;

  return {
    progress: Math.min(100, Math.round(recapPoints + mcqPoints + practicalPoints)),
    recapCompleted,
    recapTotal,
    recapPoints,
    mcqPoints,
    practicalPoints,
    qualifyingAttempts: Math.max(0, Math.floor(input.qualifyingAttempts)),
    practicalScore: input.practicalScore,
    hasAssessment: true,
  };
}

async function loadBreakdown(
  client: ServerClient,
  userId: string,
  courseSlug: string,
  resetAt: string | null,
): Promise<CourseProgressBreakdown> {
  const recapTotal = getRecapTotal(courseSlug);

  let completionQuery = client
    .from("course_recap_completions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if (resetAt) {
    completionQuery = completionQuery.gt("completed_at", resetAt);
  }

  const { count: recapCompleted } = await completionQuery;

  let attemptsQuery = client
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .gt("score", QUALIFYING_SCORE);

  if (resetAt) {
    attemptsQuery = attemptsQuery.gt("created_at", resetAt);
  }

  const { count: qualifyingAttempts } = await attemptsQuery;

  let practicalScore: number | null = null;

  if (PRACTICAL_COURSES.has(courseSlug)) {
    let practicalQuery = client
      .from("assessment_submissions")
      .select("score, task_name")
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .eq("status", "graded")
      .not("score", "is", null);

    if (resetAt) {
      practicalQuery = practicalQuery.gt("created_at", resetAt);
    }

    const { data: graded } = await practicalQuery.returns<
      { score: number | string | null; task_name: string | null }[]
    >();

    // Keep the best result per practical task, then require every practical
    // to reach 70% before the 10% is awarded. A resubmission can therefore
    // improve a failed task without an older attempt holding it back.
    const bestPerTask = new Map<string, number>();

    for (const row of graded ?? []) {
      const score = Number(row.score);

      if (!Number.isFinite(score)) continue;

      const task = row.task_name?.trim() || "practical";
      bestPerTask.set(task, Math.max(bestPerTask.get(task) ?? 0, score));
    }

    if (bestPerTask.size > 0) {
      practicalScore = Math.min(...bestPerTask.values());
    }
  }

  return {
    courseSlug,
    ...computeProgress({
      courseSlug,
      recapCompleted: recapCompleted ?? 0,
      qualifyingAttempts: qualifyingAttempts ?? 0,
      practicalScore,
    }),
  };
}

/**
 * Recomputes and stores the stored `progress` for one enrollment, marking the
 * track complete at 100%. Returns null when the learner has no (withdrawn or
 * missing) seat on that track.
 */
export async function recalculateCourseProgress(
  client: ServerClient,
  userId: string,
  courseSlug: string,
): Promise<CourseProgressBreakdown | null> {
  if (!courseSlug) return null;

  const { data: enrollment, error } = await client
    .from("course_enrollments")
    .select(
      "id, status, progress, progress_reset_at, completed_at, courses!inner(title)",
    )
    .eq("user_id", userId)
    .eq("courses.slug", courseSlug)
    .maybeSingle<
      EnrollmentForProgress & { courses: { title: string } | null }
    >();

  if (error || !enrollment || enrollment.status === "withdrawn") {
    return null;
  }

  const breakdown = await loadBreakdown(
    client,
    userId,
    courseSlug,
    enrollment.progress_reset_at,
  );

  const isComplete = breakdown.progress >= 100;
  const patch: Record<string, unknown> = { progress: breakdown.progress };

  if (isComplete) {
    patch.status = "completed";
    patch.completed_at =
      enrollment.completed_at ?? new Date().toISOString();
  }

  const { error: updateError } = await client
    .from("course_enrollments")
    .update(patch)
    .eq("id", enrollment.id);

  if (updateError) {
    console.error("Could not update course progress:", updateError.message);
    return breakdown;
  }

  if (isComplete && enrollment.status !== "completed") {
    await client.from("activity_events").insert({
      user_id: userId,
      event_type: "course_completed",
      course_slug: courseSlug,
      summary: `Completed ${enrollment.courses?.title ?? courseSlug}`,
      metadata: { progress: breakdown.progress },
    });
  }

  return breakdown;
}

export async function listRecapCompletions(
  client: ServerClient,
  userId: string,
  courseSlug: string,
): Promise<string[]> {
  const { data, error } = await client
    .from("course_recap_completions")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if (error) {
    console.error("Could not load recap completions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.lesson_id as string);
}
