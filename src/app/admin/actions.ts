"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import { recalculateCourseProgress } from "@/lib/content/progress";
import {
  COURSE_REQUEST_STATUSES,
  COURSE_REQUEST_STATUS_LABELS,
  type AppRole,
  type CourseRequestStatus,
} from "@/types/app";

const ROLES: AppRole[] = ["learner", "instructor", "admin"];

export type AdminActionResult = { ok: boolean; message?: string };

export async function setUserRole(
  userId: string,
  role: string,
): Promise<AdminActionResult> {
  const viewer = await requireAdmin();

  if (!ROLES.includes(role as AppRole)) {
    return { ok: false, message: "Unknown role." };
  }

  if (userId === viewer.userId) {
    return { ok: false, message: "You cannot change your own role." };
  }

  const { error } = await viewer.supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Role change failed:", error.message);
    return { ok: false, message: "Could not update that user's role." };
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "role_change",
    summary: `Set a member's role to ${role}`,
    metadata: { targetUser: userId, role },
  });

  revalidatePath("/admin");

  return { ok: true };
}

export async function inviteUser(input: {
  email: string;
  role: string;
}): Promise<AdminActionResult> {
  const viewer = await requireAdmin();

  const email = input.email.trim().toLowerCase();
  const role = input.role;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  if (!ROLES.includes(role as AppRole)) {
    return { ok: false, message: "Pick a valid role." };
  }

  const { error } = await viewer.supabase.from("role_invites").insert({
    email,
    role,
    invited_by: viewer.userId,
  });

  if (error) {
    if (error.code === "23505" || error.code === "235055") {
      return {
        ok: false,
        message: "That address already has a pending invitation.",
      };
    }

    console.error("Invitation failed:", error.message);
    return { ok: false, message: "Could not create the invitation." };
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "invitation",
    summary: `Invited ${email} as ${role}`,
    metadata: { email, role },
  });

  revalidatePath("/admin");

  return { ok: true };
}

export async function setCourseRequestStatus(
  id: string,
  status: string,
): Promise<AdminActionResult> {
  const viewer = await requireAdmin();

  if (!COURSE_REQUEST_STATUSES.includes(status as CourseRequestStatus)) {
    return { ok: false, message: "Unknown status." };
  }

  const { data, error } = await viewer.supabase
    .from("course_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    console.error("Course request update failed:", error?.message);
    return { ok: false, message: "Could not update that request." };
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "course_request",
    summary: `Marked a course request as ${COURSE_REQUEST_STATUS_LABELS[status as CourseRequestStatus]}`,
    metadata: { requestId: id, status },
  });

  revalidatePath("/admin");

  return { ok: true };
}

export async function gradeAssessmentSubmission(
  id: string,
  score: string,
): Promise<AdminActionResult> {
  const viewer = await requireAdmin();
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
    return { ok: false, message: "Enter a score between 0 and 100." };
  }

  const { data: submission, error: readError } = await viewer.supabase
    .from("assessment_submissions")
    .select("id, user_id, course_slug")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      user_id: string;
      course_slug: string | null;
    }>();

  if (readError || !submission) {
    console.error("Could not load submission:", readError?.message);
    return { ok: false, message: "Could not find that submission." };
  }

  const { error } = await viewer.supabase
    .from("assessment_submissions")
    .update({
      status: "graded",
      score: Math.round(numericScore * 100) / 100,
      graded_at: new Date().toISOString(),
      graded_by: viewer.userId,
    })
    .eq("id", id);

  if (error) {
    console.error("Could not grade submission:", error.message);
    return { ok: false, message: "Could not save that score." };
  }

  if (submission.course_slug) {
    await recalculateCourseProgress(
      viewer.supabase,
      submission.user_id,
      submission.course_slug,
    );
  }

  await viewer.supabase.from("activity_events").insert({
    user_id: viewer.userId,
    event_type: "assessment_graded",
    course_slug: submission.course_slug,
    summary: `Graded a practical assessment at ${numericScore}%`,
    metadata: { submissionId: id, score: numericScore },
  });

  revalidatePath("/admin");
  revalidatePath("/profile");

  return { ok: true };
}

export async function revokeInvite(id: string): Promise<AdminActionResult> {
  const viewer = await requireAdmin();

  const { error } = await viewer.supabase
    .from("role_invites")
    .update({ status: "revoked" })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    console.error("Could not revoke invitation:", error.message);
    return { ok: false, message: "Could not revoke that invitation." };
  }

  revalidatePath("/admin");

  return { ok: true };
}
