import { createClient } from "@/lib/supabase/server";

/**
 * An avatar URL that has passed the ReviewBar safety check. Only http(s) URLs
 * whose origin is on the allowlist, or relative paths under /public, survive
 * the sanitizer below.
 */
export type SafeAvatarUrl = string & { readonly __brand: "safe-avatar" };

export type ReviewRecord = {
  id: string;
  name: string;
  role: string | null;
  body: string;
  avatarUrl: SafeAvatarUrl | null;
};

const ALLOWED_ORIGINS = new Set([
  "https://cdn.hashnode.com",
  "https://images.unsplash.com",
]);

function sanitizeAvatar(raw: string | null): SafeAvatarUrl | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Drop anything that could execute or exfiltrate in an <img src>.
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return null;
  }

  // Relative public paths ("/images/x.jpeg") are served by Next's static
  // asset routing and are safe. Anything absolute must come from a known origin.
  if (trimmed.startsWith("/")) {
    return trimmed as SafeAvatarUrl;
  }

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_ORIGINS.has(parsed.origin)) return null;
    return trimmed as SafeAvatarUrl;
  } catch {
    return null;
  }
}

export async function listReviews(): Promise<ReviewRecord[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, role, body, avatar_url")
      .order("position", { ascending: true })
      .limit(20);

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id as string,
      name: row.name as string,
      role: (row.role as string | null) ?? null,
      body: row.body as string,
      avatarUrl: sanitizeAvatar((row.avatar_url as string | null) ?? null),
    }));
  } catch (error) {
    console.error("Could not load reviews:", error);
    return [];
  }
}
