import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { listEnrollments } from "@/lib/content/courses";
import { ENROLLMENT_LIMIT } from "@/types/app";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, max-age=0",
} as const;

/**
 * Hydrates the global client store (session, role label, enrolments).
 */
export async function GET() {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json(
      {
        configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        user: null,
        profile: null,
        enrollments: [],
        limit: ENROLLMENT_LIMIT,
      },
      { headers: NO_STORE },
    );
  }

  const enrollments = await listEnrollments();

  return NextResponse.json(
    {
      configured: true,
      user: { id: viewer.userId, email: viewer.email },
      profile: viewer.profile,
      enrollments,
      limit: ENROLLMENT_LIMIT,
    },
    { headers: NO_STORE },
  );
}
