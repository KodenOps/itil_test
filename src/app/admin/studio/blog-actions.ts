"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/profile";
import {
  isBlogSource,
  markdownToBlocks,
  normalizeBlogContent,
  safeBlogUrl,
  slugify,
} from "@/lib/content/blog";
import { fetchExternalBlogMeta } from "@/lib/content/blog-posts";
import type { BlogSource } from "@/types/app";

export type BlogActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; message: string };

export type BlogPostInput = {
  id?: string | null;
  title: string;
  summary: string;
  category: string;
  author: string;
  source: string;
  externalUrl: string;
  coverImage: string;
  markdown: string;
  published: boolean;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  base: string,
  currentId: string | null,
): Promise<string> {
  const seed = base || `post-${Date.now().toString(36)}`;
  let candidate = seed;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const query = supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", candidate);
    const { data } = await query.maybeSingle<{ id: string }>();

    if (!data || data.id === currentId) return candidate;

    candidate = `${seed}-${attempt + 2}`;
  }

  return `${seed}-${Date.now().toString(36)}`;
}

export async function saveBlogPost(
  input: BlogPostInput,
): Promise<BlogActionResult<{ id: string; slug: string }>> {
  const viewer = await requireAdmin();

  const title = text(input.title, 200);
  if (title.length < 4) {
    return { ok: false, message: "Give the post a title of at least 4 characters." };
  }

  const source: BlogSource = isBlogSource(input.source) ? input.source : "studio";
  const externalUrl = source === "studio" ? "" : safeBlogUrl(input.externalUrl) ?? "";

  if (source !== "studio" && !externalUrl) {
    return {
      ok: false,
      message: "Paste the full https:// link to the published blog post.",
    };
  }

  const content =
    source === "studio" ? markdownToBlocks(text(input.markdown, 120_000)) : [];

  if (source === "studio" && content.length === 0) {
    return { ok: false, message: "Write the post body before saving." };
  }

  const published = Boolean(input.published);
  const id = input.id ? text(input.id, 60) : null;

  const existing = id
    ? (
        await viewer.supabase
          .from("blog_posts")
          .select("id, slug, published, title")
          .eq("id", id)
          .maybeSingle<{ id: string; slug: string; published: boolean; title: string }>()
      ).data
    : null;

  if (id && !existing) {
    return { ok: false, message: "That post no longer exists." };
  }

  const slug = await uniqueSlug(
    viewer.supabase,
    existing?.slug ?? slugify(title),
    existing?.id ?? null,
  );

  const row = {
    slug,
    title,
    summary: text(input.summary, 600),
    category: text(input.category, 60) || null,
    author: text(input.author, 80) || "CertifyHub studio",
    source,
    external_url: externalUrl || null,
    cover_image: safeBlogUrl(input.coverImage) || null,
    content: normalizeBlogContent(content),
    published,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = existing
    ? await viewer.supabase
        .from("blog_posts")
        .update(row)
        .eq("id", existing.id)
        .select("id, slug")
        .maybeSingle<{ id: string; slug: string }>()
    : await viewer.supabase
        .from("blog_posts")
        .insert({ ...row, created_by: viewer.userId })
        .select("id, slug")
        .maybeSingle<{ id: string; slug: string }>();

  if (error || !data) {
    console.error("Could not save the blog post:", error?.message);
    return {
      ok: false,
      message:
        error?.code === "42P01"
          ? "Run supabase/schema-20261104.sql to create the blog_posts table."
          : "Could not save the post. Check the fields and try again.",
    };
  }

  // A published post is news: tell learners once, when it first goes live.
  if (published && (!existing || !existing.published)) {
    const { data: learners } = await viewer.supabase
      .from("profiles")
      .select("id")
      .neq("id", viewer.userId)
      .limit(500)
      .returns<{ id: string }[]>();

    const rows = (learners ?? []).map((learner) => ({
      user_id: learner.id,
      actor_id: viewer.userId,
      type: "blog_published" as const,
      title: "New post on the blog",
      body: title,
      link: `/blog/${slug}`,
    }));

    if (rows.length > 0) {
      const { error: notifyError } = await viewer.supabase
        .from("notifications")
        .insert(rows);

      if (notifyError) {
        console.warn("Could not notify learners about the post:", notifyError.message);
      }
    }
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");

  return { ok: true, id: data.id, slug: data.slug };
}

export async function setBlogPostPublished(
  id: string,
  published: boolean,
): Promise<BlogActionResult> {
  const viewer = await requireAdmin();

  const { error } = await viewer.supabase
    .from("blog_posts")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Could not change the post status:", error.message);
    return { ok: false, message: "Could not update that post." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin");

  return { ok: true };
}

export async function deleteBlogPost(id: string): Promise<BlogActionResult> {
  const viewer = await requireAdmin();

  const { error } = await viewer.supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Could not delete the blog post:", error.message);
    return { ok: false, message: "Could not delete that post." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin");

  return { ok: true };
}

/** Pulls Open Graph metadata for an external blog link the admin pasted. */
export async function previewBlogLink(url: string): Promise<
  BlogActionResult<{
    title: string;
    summary: string;
    coverImage: string;
    source: BlogSource;
  }>
> {
  await requireAdmin();

  const safe = safeBlogUrl(url);

  if (!safe || !/^https?:\/\//i.test(safe)) {
    return { ok: false, message: "Paste a full https:// blog link first." };
  }

  const meta = await fetchExternalBlogMeta(safe);

  if (!meta) {
    return {
      ok: false,
      message:
        "That page did not return any metadata. Check the link, or fill the fields in by hand.",
    };
  }

  return {
    ok: true,
    title: meta.title,
    summary: meta.summary,
    coverImage: meta.coverImage ?? "",
    source: meta.source,
  };
}
