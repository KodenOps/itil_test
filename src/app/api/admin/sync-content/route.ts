import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { buildContentSeed } from "@/lib/content/seed";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHUNK_SIZE = 150;

async function upsertInChunks(
  supabase: SupabaseServerClient,
  table: string,
  onConflict: string,
  rows: Record<string, unknown>[],
) {
  let written = 0;

  for (let index = 0; index < rows.length; index += CHUNK_SIZE) {
    const chunk = rows.slice(index, index + CHUNK_SIZE);

    const { error } = await supabase
      .from(table)
      .upsert(chunk, { onConflict, ignoreDuplicates: false });

    if (error) {
      throw new Error(`${table}: ${error.message}`);
    }

    written += chunk.length;
  }

  return written;
}

/**
 * Moves every question bank, practical task and review from src/data into
 * Postgres. Admin-only: RLS re-checks the role on each write.
 */
export async function POST() {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (viewer.profile.role !== "admin") {
    return NextResponse.json(
      { error: "Only administrators can sync content." },
      { status: 403 },
    );
  }

  try {
    const { data: courses } = await viewer.supabase
      .from("courses")
      .select("slug");

    const slugs = new Set((courses ?? []).map((c) => c.slug as string));

    if (slugs.size === 0) {
      return NextResponse.json(
        {
          error:
            "No courses found. Run supabase/schema.sql first — it seeds the course catalogue.",
        },
        { status: 409 },
      );
    }

    const seed = buildContentSeed();

    const questions = seed.questions.filter((q) => slugs.has(q.course_slug));
    const tasks = seed.tasks.filter(
      (t) => !t.course_slug || slugs.has(t.course_slug),
    );

    const [questionCount, taskCount, reviewCount] = await Promise.all([
      upsertInChunks(
        viewer.supabase,
        "questions",
        "course_slug,external_id",
        questions,
      ),
      upsertInChunks(viewer.supabase, "learning_tasks", "slug", tasks),
      upsertInChunks(viewer.supabase, "reviews", "external_id", seed.reviews),
    ]);

    await viewer.supabase.from("activity_events").insert({
      user_id: viewer.userId,
      event_type: "content_sync",
      summary: `Synced ${questionCount} questions, ${taskCount} tasks and ${reviewCount} reviews`,
      metadata: { questionCount, taskCount, reviewCount },
    });

    return NextResponse.json({
      ok: true,
      counts: {
        questions: questionCount,
        tasks: taskCount,
        reviews: reviewCount,
      },
    });
  } catch (error) {
    console.error("Content sync failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Content sync failed unexpectedly.",
      },
      { status: 500 },
    );
  }
}
