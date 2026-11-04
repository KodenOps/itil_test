import { createClient } from "@/lib/supabase/server";
import { detectBlogSource, normalizeBlogContent } from "@/lib/content/blog";
import type { BlogPost, BlogSource } from "@/types/app";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string | null;
  author: string;
  published: boolean;
  source: string;
  external_url: string | null;
  cover_image: string | null;
  content: unknown;
  created_at: string;
  updated_at: string;
};

const BLOG_COLUMNS =
  "id, slug, title, summary, category, author, published, source, external_url, cover_image, content, created_at, updated_at";

function mapRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    author: row.author,
    published: Boolean(row.published),
    source: (row.source as BlogSource) ?? "studio",
    externalUrl: row.external_url,
    coverImage: row.cover_image,
    content: normalizeBlogContent(row.content),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Published posts for the public blog. Never throws — the page degrades. */
export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(60)
      .returns<BlogRow[]>();

    if (error) throw error;

    return (data ?? []).map(mapRow);
  } catch (error) {
    console.error("Could not load blog posts:", error);
    return [];
  }
}

/** Admin listing: drafts included. RLS lets admins read every row. */
export async function listAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .order("updated_at", { ascending: false })
      .limit(200)
      .returns<BlogRow[]>();

    if (error) throw error;

    return (data ?? []).map(mapRow);
  } catch (error) {
    console.error("Could not load the admin blog list:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("slug", slug);

    if (!options.includeDrafts) query = query.eq("published", true);

    const { data, error } = await query.maybeSingle<BlogRow>();

    if (error) throw error;
    if (!data) return null;

    return mapRow(data);
  } catch (error) {
    console.error(`Could not load the blog post ${slug}:`, error);
    return null;
  }
}

export type ExternalPostMeta = {
  title: string;
  summary: string;
  coverImage: string | null;
  publishedAt: string | null;
  url: string;
  source: BlogSource;
};

function metaContent(html: string, property: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]).trim();
  }

  return "";
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * Reads Open Graph metadata from any blog URL the admin pastes. Hashnode,
 * Medium, Dev.to and Ghost all publish OG tags, and the generic fallback
 * covers everything else, so one code path handles every host.
 */
export async function fetchExternalBlogMeta(
  url: string,
): Promise<ExternalPostMeta | null> {
  const safe = url.trim();
  if (!/^https?:\/\//i.test(safe)) return null;

  try {
    const res = await fetch(safe, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CertifyHubBot/1.0; +https://certifyhub.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const html = (await res.text()).slice(0, 400_000);

    const title =
      metaContent(html, "og:title") ||
      metaContent(html, "twitter:title") ||
      decodeEntities(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim();

    if (!title) return null;

    const summary =
      metaContent(html, "og:description") ||
      metaContent(html, "description") ||
      metaContent(html, "twitter:description");

    const coverImage =
      metaContent(html, "og:image") ||
      metaContent(html, "twitter:image") ||
      null;

    const publishedAt =
      metaContent(html, "article:published_time") ||
      metaContent(html, "datePublished") ||
      null;

    return {
      title: title.slice(0, 200),
      summary: summary.slice(0, 500),
      coverImage,
      publishedAt,
      url: safe,
      source: detectBlogSource(safe),
    };
  } catch (error) {
    console.error("Could not fetch blog metadata:", error);
    return null;
  }
}
