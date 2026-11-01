"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/supabase/profile";

export type ProfileActionResult = { ok: boolean; message?: string };

export async function updateDisplayName(
  formData: FormData,
): Promise<ProfileActionResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return { ok: false, message: "You are not signed in." };
  }

  const fullName = String(formData.get("fullName") ?? "")
    .trim()
    .slice(0, 80);

  if (!fullName) {
    return { ok: false, message: "Please enter a name." };
  }

  const { error } = await viewer.supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", viewer.userId);

  if (error) {
    console.error("Could not update profile:", error.message);
    return { ok: false, message: "Could not save your name. Try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/admin");

  return { ok: true };
}
