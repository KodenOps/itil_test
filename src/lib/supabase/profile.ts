import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/app";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export type Viewer = {
  supabase: ServerClient;
  userId: string;
  email: string | null;
  profile: Profile;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
  last_active_at: string | null;
};

export function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role ?? "learner",
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
  };
}

/**
 * The single server-side source of truth for "who is making this request".
 * The JWT is cryptographically verified, the profile row is then fetched
 * (RLS: self or staff). Returns null when Supabase is not configured or
 * nobody is signed in, so callers can render a signed-out state.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  let supabase: ServerClient;

  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Supabase client unavailable:", error);
    return null;
  }

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims as { sub?: string; email?: string };
  const userId = claims.sub;

  if (!userId) return null;

  const { data: row, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    console.error("Could not load profile:", profileError.message);
  }

  if (row) {
    return { supabase, userId, email: row.email, profile: toProfile(row) };
  }

  // Self-heal: the sign-up trigger normally creates the row, but an older
  // account (or a temporarily disabled trigger) may not have one yet.
  const email = (claims.email ?? `${userId}@unknown.local`).toLowerCase();

  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: userId, email, role: "learner" })
    .select("*")
    .maybeSingle<ProfileRow>();

  const profile: Profile = created
    ? toProfile(created)
    : {
        id: userId,
        email,
        fullName: null,
        avatarUrl: null,
        role: "learner",
        createdAt: new Date().toISOString(),
        lastActiveAt: null,
      };

  return { supabase, userId, email, profile };
});

export async function requireViewer(
  redirectTo = "/login",
): Promise<Viewer> {
  const viewer = await getViewer();

  if (!viewer) {
    redirect(redirectTo);
  }

  return viewer;
}

export async function requireAdmin(): Promise<Viewer> {
  const viewer = await requireViewer();

  if (viewer.profile.role !== "admin") {
    redirect("/");
  }

  return viewer;
}

export function isAdmin(viewer: Viewer | null): boolean {
  return viewer?.profile.role === "admin";
}

export function isStaff(viewer: Viewer | null): boolean {
  return (
    viewer?.profile.role === "admin" || viewer?.profile.role === "instructor"
  );
}
