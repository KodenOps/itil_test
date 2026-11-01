import { createClient } from "@/lib/supabase/server";

export type ReviewRecord = {
  id: string;
  name: string;
  role: string | null;
  body: string;
  avatarUrl: string | null;
};

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
      avatarUrl: (row.avatar_url as string | null) ?? null,
    }));
  } catch (error) {
    console.error("Could not load reviews:", error);
    return [];
  }
}
