"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/supabase/profile";
import { safeRedirectPath } from "@/lib/security/redirect";
import { ENROLLMENT_LIMIT } from "@/types/app";

export type EnrollmentActionResult = {
  ok: boolean;
  code?:
    | "NOT_AUTHENTICATED"
    | "LIMIT"
    | "ALREADY_ENROLLED"
    | "NOT_FOUND"
    | "UNKNOWN";
  message?: string;
};

export async function enrollInCourse(
  courseId: string,
): Promise<EnrollmentActionResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return {
      ok: false,
      code: "NOT_AUTHENTICATED",
      message: "Sign in to enroll in a course.",
    };
  }

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("id, slug, title")
    .eq("id", courseId)
    .maybeSingle<{ id: string; slug: string; title: string }>();

  if (!course) {
    return { ok: false, code: "NOT_FOUND", message: "Course not found." };
  }

  const { error } = await viewer.supabase.from("course_enrollments").insert({
    user_id: viewer.userId,
    course_id: courseId,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        code: "ALREADY_ENROLLED",
        message: "You are already enrolled in this course.",
      };
    }

    if (
      error.code === "P0001" ||
      error.message.includes("ENROLLMENT_LIMIT_REACHED")
    ) {
      return {
        ok: false,
        code: "LIMIT",
        message: `You can be enrolled in ${ENROLLMENT_LIMIT} courses at a time. Leave a course before joining another.`,
      };
    }

    console.error("Enrollment failed:", error.message);
    return {
      ok: false,
      code: "UNKNOWN",
      message: "We could not enroll you right now. Please try again.",
    };
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "enrollment",
    course_slug: course.slug,
    summary: `Enrolled in ${course.title}`,
    metadata: { courseId },
  });

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/admin");

  return { ok: true };
}

export async function resetCourseProgress(
  courseId: string,
): Promise<EnrollmentActionResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return { ok: false, code: "NOT_AUTHENTICATED", message: "Sign in first." };
  }

  const { data: enrollment } = await viewer.supabase
    .from("course_enrollments")
    .select("id, status, courses!inner(slug, title)")
    .eq("user_id", viewer.userId)
    .eq("course_id", courseId)
    .maybeSingle<{
      id: string;
      status: string;
      courses: { slug: string; title: string } | null;
    }>();

  if (!enrollment) {
    return { ok: false, code: "NOT_FOUND", message: "Course not found." };
  }

  // Turning a completed track back into an active seat must respect the
  // two-course limit; otherwise the database trigger would reject the reset.
  if (enrollment.status !== "active") {
    const { count } = await viewer.supabase
      .from("course_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", viewer.userId)
      .eq("status", "active")
      .neq("id", enrollment.id);

    if ((count ?? 0) >= ENROLLMENT_LIMIT) {
      return {
        ok: false,
        code: "LIMIT",
        message: `You already have ${ENROLLMENT_LIMIT} active tracks. Leave or complete one before resetting this track.`,
      };
    }
  }

  const courseSlug = enrollment.courses?.slug ?? "";

  if (courseSlug) {
    await viewer.supabase
      .from("course_recap_completions")
      .delete()
      .eq("user_id", viewer.userId)
      .eq("course_slug", courseSlug);
  }

  const { error } = await viewer.supabase
    .from("course_enrollments")
    .update({
      progress: 0,
      status: "active",
      completed_at: null,
      progress_reset_at: new Date().toISOString(),
    })
    .eq("id", enrollment.id);

  if (error) {
    console.error("Could not reset progress:", error.message);
    return {
      ok: false,
      code: "UNKNOWN",
      message:
        error.message.includes("ENROLLMENT_LIMIT_REACHED")
          ? "Free a seat before resetting this track."
          : "Could not reset your progress. Please try again.",
    };
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "progress_reset",
    course_slug: courseSlug || null,
    summary: `Reset progress on ${enrollment.courses?.title ?? "a track"}`,
    metadata: { courseId },
  });

  revalidatePath("/profile");
  revalidatePath("/");

  return { ok: true };
}

export async function leaveCourse(
  courseId: string,
): Promise<EnrollmentActionResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return { ok: false, code: "NOT_AUTHENTICATED" };
  }

  const { data: course } = await viewer.supabase
    .from("courses")
    .select("slug, title")
    .eq("id", courseId)
    .maybeSingle<{ slug: string; title: string }>();

  const { error } = await viewer.supabase
    .from("course_enrollments")
    .delete()
    .eq("user_id", viewer.userId)
    .eq("course_id", courseId);

  if (error) {
    console.error("Could not leave course:", error.message);
    return { ok: false, code: "UNKNOWN", message: "Could not leave the course." };
  }

  if (course) {
    await viewer.supabase.from("activity_events").insert({
      user_id: viewer.userId,
      event_type: "unenrollment",
      course_slug: course.slug,
      summary: `Left ${course.title}`,
      metadata: { courseId },
    });
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/admin");

  return { ok: true };
}

/**
 * Form action used by the server-rendered enrollment gate on assessment
 * routes: enroll, then continue to the page the learner asked for.
 */
export async function enrollFromGate(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") ?? "");
  // The hidden field is user-controlled; never redirect off-site with it.
  const next = safeRedirectPath(formData.get("next"), "/");

  await enrollInCourse(courseId);

  redirect(next);
}
