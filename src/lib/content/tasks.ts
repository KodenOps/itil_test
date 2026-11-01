import { createClient } from "@/lib/supabase/server";

export type LearningTask = {
  slug: string;
  title: string;
  description: string;
  link: string | null;
  download: string | null;
  status: "open" | "locked";
  bg: string;
  basic_concept: string[];
};

type TaskRow = {
  slug: string;
  title: string;
  description: string;
  link: string | null;
  download: string | null;
  status: string;
  accent: string;
  concepts: string[] | null;
};

/** Practical tasks, migrated from src/data/excel-task.ts. */
export async function listLearningTasks(
  courseSlug = "excel-fundamentals",
): Promise<LearningTask[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_tasks")
      .select("slug, title, description, link, download, status, accent, concepts")
      .eq("course_slug", courseSlug)
      .order("position", { ascending: true })
      .returns<TaskRow[]>();

    if (error) throw error;

    return (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description,
      link: row.link,
      download: row.download,
      status: row.status === "locked" ? "locked" : "open",
      bg: row.accent,
      basic_concept: row.concepts ?? [],
    }));
  } catch (error) {
    console.error("Could not load practical tasks:", error);
    return [];
  }
}
