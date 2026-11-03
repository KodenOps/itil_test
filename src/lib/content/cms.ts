import { createClient } from "@/lib/supabase/server";
import {
  CONTENT_BLOCK_TYPES,
  newId,
  safeContentUrl,
  type CalloutTone,
  type ContentBlock,
  type ContentBlockType,
  type CourseSection,
} from "@/types/cms";

const BLOCK_TYPES = new Set<string>(CONTENT_BLOCK_TYPES);
const CALLOUT_TONES: CalloutTone[] = ["info", "tip", "warning"];
const MAX_SECTIONS = 60;
const MAX_BLOCKS_PER_SECTION = 120;

export type StudioCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  accentFrom: string;
  accentTo: string;
  href: string;
  estimatedHours: number;
  position: number;
  isPublished: boolean;
};

type StudioCourseRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  accent_from: string;
  accent_to: string;
  href: string;
  estimated_hours: number;
  position: number;
  is_published: boolean;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function identifier(value: unknown): string {
  return typeof value === "string" && value.length > 0 && value.length <= 100
    ? value
    : newId();
}

function link(value: unknown): string {
  const safe = safeContentUrl(value);
  return safe ? safe.slice(0, 2048) : "";
}

function normalizeBlock(raw: unknown): ContentBlock | null {
  if (!raw || typeof raw !== "object") return null;

  const input = raw as Record<string, unknown>;
  const type = text(input.type, 30) as ContentBlockType;

  if (!BLOCK_TYPES.has(type)) return null;

  const block: ContentBlock = { id: identifier(input.id), type };

  switch (type) {
    case "heading": {
      const level = Number(input.level);
      block.text = text(input.text, 240);
      block.level = level === 3 || level === 4 ? level : 2;
      break;
    }
    case "paragraph":
      block.text = text(input.text, 8000);
      break;
    case "image":
      block.url = link(input.url);
      block.alt = text(input.alt, 240);
      block.caption = text(input.caption, 300);
      break;
    case "video":
      block.url = link(input.url);
      block.title = text(input.title, 160);
      break;
    case "video_link":
      block.url = link(input.url);
      block.title = text(input.title, 160);
      block.description = text(input.description, 500);
      break;
    case "code":
      block.language = text(input.language, 40) || "text";
      block.text =
        typeof input.text === "string" ? input.text.slice(0, 20000) : "";
      break;
    case "callout":
      block.tone = CALLOUT_TONES.includes(input.tone as CalloutTone)
        ? (input.tone as CalloutTone)
        : "tip";
      block.title = text(input.title, 160);
      block.text = text(input.text, 3000);
      break;
    case "quote":
      block.text = text(input.text, 2000);
      block.attribution = text(input.attribution, 160);
      break;
    case "list":
      block.ordered = Boolean(input.ordered);
      block.items = Array.isArray(input.items)
        ? input.items
            .map((item) => text(item, 600))
            .filter(Boolean)
            .slice(0, 40)
        : [];
      break;
    case "link":
    case "file":
      block.label = text(input.label, 120);
      block.url = link(input.url);
      block.description = text(input.description, 500);
      break;
    case "divider":
      break;
  }

  return block;
}

/** Server-side guard: the client sends JSON, so everything is re-validated. */
export function normalizeSections(input: unknown): CourseSection[] {
  if (!Array.isArray(input)) return [];

  const sections: CourseSection[] = [];

  for (const raw of input.slice(0, MAX_SECTIONS)) {
    if (!raw || typeof raw !== "object") continue;

    const section = raw as Record<string, unknown>;
    const blocks = Array.isArray(section.blocks)
      ? section.blocks
          .slice(0, MAX_BLOCKS_PER_SECTION)
          .map(normalizeBlock)
          .filter((block): block is ContentBlock => block !== null)
      : [];

    sections.push({
      id: identifier(section.id),
      title: text(section.title, 160) || "Untitled section",
      intro: text(section.intro, 800),
      blocks,
    });
  }

  return sections;
}

export async function getCourseSections(slug: string): Promise<CourseSection[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("course_pages")
      .select("sections")
      .eq("course_slug", slug)
      .maybeSingle<{ sections: unknown }>();

    if (error) throw error;

    return normalizeSections(data?.sections);
  } catch (error) {
    console.error(`Could not load the course page for ${slug}:`, error);
    return [];
  }
}

export async function listCoursePageMap(): Promise<
  Record<string, CourseSection[]>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("course_pages")
      .select("course_slug, sections")
      .returns<{ course_slug: string; sections: unknown }[]>();

    if (error) throw error;

    return Object.fromEntries(
      (data ?? []).map((row) => [row.course_slug, normalizeSections(row.sections)]),
    );
  } catch (error) {
    console.error("Could not load course studio pages:", error);
    return {};
  }
}

/** Admin-only listing that includes unpublished tracks. */
export async function listStudioCourses(): Promise<StudioCourse[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("courses")
      .select(
        "id, slug, title, summary, track, level, accent_from, accent_to, href, estimated_hours, position, is_published",
      )
      .order("position", { ascending: true })
      .returns<StudioCourseRow[]>();

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      track: row.track,
      level: row.level,
      accentFrom: row.accent_from,
      accentTo: row.accent_to,
      href: row.href,
      estimatedHours: Number(row.estimated_hours ?? 12),
      position: Number(row.position ?? 0),
      isPublished: Boolean(row.is_published),
    }));
  } catch (error) {
    console.error("Could not load studio courses:", error);
    return [];
  }
}
