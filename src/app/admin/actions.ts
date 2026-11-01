"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import type { AppRole } from "@/types/app";

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
