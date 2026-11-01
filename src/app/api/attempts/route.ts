import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { isSameOriginRequest, rateLimit } from "@/lib/security/request";

export const dynamic = "force-dynamic";

type AttemptBody = {
  courseSlug?: string;
  mode?: string;
  total?: number;
  correct?: number;
  durationSeconds?: number;
};

/**
 * Records a completed assessment. This is what powers "learning activity"
 * on the profile page and the engagement metrics in the admin dashboard.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Cross-site request blocked." },
      { status: 403 },
    );
  }

  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const limit = rateLimit(`attempts:${viewer.userId}`, 60, 10 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts recorded. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: AttemptBody;

  try {
    body = (await request.json()) as AttemptBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const total = Number(body.total);
  const correct = Number(body.correct);

  if (!Number.isFinite(total) || total <= 0) {
    return NextResponse.json(
      { error: "total must be a positive number." },
      { status: 400 },
    );
  }

  const safeCorrect = Number.isFinite(correct)
    ? Math.min(Math.max(correct, 0), total)
    : 0;
  const score = Math.round((safeCorrect / total) * 10000) / 100;
  const courseSlug = body.courseSlug?.trim() || null;

  if (courseSlug) {
    const { data: enrollment } = await viewer.supabase
      .from("course_enrollments")
      .select("id, progress, courses!inner(slug)")
      .eq("user_id", viewer.userId)
      .eq("courses.slug", courseSlug)
      .maybeSingle<{ id: string; progress: number }>();

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course." },
        { status: 403 },
      );
    }

    const progress = Math.max(enrollment.progress, Math.min(100, score));

    await viewer.supabase
      .from("course_enrollments")
      .update({ progress })
      .eq("id", enrollment.id);
  }

  const { error } = await viewer.supabase.from("quiz_attempts").insert({
    user_id: viewer.userId,
    course_slug: courseSlug,
    mode: body.mode?.slice(0, 40) ?? "practice",
    question_count: Math.round(total),
    correct_count: Math.round(safeCorrect),
    score,
    duration_seconds: Number.isFinite(Number(body.durationSeconds))
      ? Math.round(Number(body.durationSeconds))
      : null,
  });

  if (error) {
    console.error("Could not record attempt:", error.message);
    return NextResponse.json(
      { error: "Could not record your attempt." },
      { status: 500 },
    );
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "quiz_attempt",
    course_slug: courseSlug,
    summary: `Scored ${score}% (${Math.round(safeCorrect)}/${Math.round(total)})`,
    metadata: { mode: body.mode ?? "practice", score },
  });

  return NextResponse.json({ ok: true, score });
}
