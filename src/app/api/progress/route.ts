import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { isSameOriginRequest, rateLimit } from "@/lib/security/request";
import {
  RECAP_TOTALS,
  getRecapTotal,
  listRecapCompletions,
  recalculateCourseProgress,
} from "@/lib/content/progress";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" } as const;

type ProgressBody = {
  courseSlug?: string;
  lessonId?: string;
};

/** Recap completions for a track, plus the current stored progress. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get("courseSlug")?.trim() ?? "";

  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug is required." },
      { status: 400, headers: NO_STORE },
    );
  }

  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json(
      {
        signedIn: false,
        enrolled: false,
        completed: [] as string[],
        progress: 0,
        total: getRecapTotal(courseSlug),
      },
      { headers: NO_STORE },
    );
  }

  const { data: enrollment } = await viewer.supabase
    .from("course_enrollments")
    .select("id, status, progress, courses!inner(slug)")
    .eq("user_id", viewer.userId)
    .eq("courses.slug", courseSlug)
    .maybeSingle<{ id: string; status: string; progress: number }>();

  const completed = await listRecapCompletions(
    viewer.supabase,
    viewer.userId,
    courseSlug,
  );

  return NextResponse.json(
    {
      signedIn: true,
      enrolled:
        enrollment?.status === "active" || enrollment?.status === "completed",
      completed,
      progress: enrollment?.progress ?? 0,
      total: getRecapTotal(courseSlug),
    },
    { headers: NO_STORE },
  );
}

/** Records one completed recap and recalculates the track's progress. */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Cross-site request blocked." },
      { status: 403, headers: NO_STORE },
    );
  }

  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json(
      { error: "Sign in to track your progress." },
      { status: 401, headers: NO_STORE },
    );
  }

  const limit = rateLimit(`progress:${viewer.userId}`, 120, 10 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many updates. Please slow down." },
      {
        status: 429,
        headers: {
          ...NO_STORE,
          "Retry-After": String(limit.retryAfterSeconds),
        },
      },
    );
  }

  let body: ProgressBody;

  try {
    body = (await request.json()) as ProgressBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: NO_STORE },
    );
  }

  const courseSlug = body.courseSlug?.trim() ?? "";
  const lessonId = body.lessonId?.trim() ?? "";

  if (!courseSlug || !lessonId) {
    return NextResponse.json(
      { error: "courseSlug and lessonId are required." },
      { status: 400, headers: NO_STORE },
    );
  }

  if (!Object.hasOwn(RECAP_TOTALS, courseSlug)) {
    return NextResponse.json(
      { error: "Unknown course." },
      { status: 400, headers: NO_STORE },
    );
  }

  if (lessonId.length > 120) {
    return NextResponse.json(
      { error: "Invalid recap." },
      { status: 400, headers: NO_STORE },
    );
  }

  const { data: enrollment } = await viewer.supabase
    .from("course_enrollments")
    .select("id, status, courses!inner(slug)")
    .eq("user_id", viewer.userId)
    .eq("courses.slug", courseSlug)
    .maybeSingle<{ id: string; status: string }>();

  if (!enrollment || enrollment.status === "withdrawn") {
    return NextResponse.json(
      { error: "Reserve a seat on this track to record progress." },
      { status: 403, headers: NO_STORE },
    );
  }

  const { error } = await viewer.supabase.from("course_recap_completions").upsert(
    {
      user_id: viewer.userId,
      course_slug: courseSlug,
      lesson_id: lessonId,
    },
    {
      onConflict: "user_id,course_slug,lesson_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    console.error("Could not save recap completion:", error.message);
    return NextResponse.json(
      { error: "Could not save that recap. Please try again." },
      { status: 500, headers: NO_STORE },
    );
  }

  const breakdown = await recalculateCourseProgress(
    viewer.supabase,
    viewer.userId,
    courseSlug,
  );

  return NextResponse.json(
    {
      ok: true,
      completed: lessonId,
      progress: breakdown?.progress ?? 0,
      recapCompleted: breakdown?.recapCompleted ?? 0,
      recapTotal: breakdown?.recapTotal ?? getRecapTotal(courseSlug),
    },
    { headers: NO_STORE },
  );
}
