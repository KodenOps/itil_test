/**
 * The shape of a studio-built course page. Pure client-safe helpers live here
 * so the editor, the server validator and the public renderer all agree.
 */

export const CONTENT_BLOCK_TYPES = [
  "heading",
  "paragraph",
  "image",
  "video",
  "video_link",
  "code",
  "callout",
  "quote",
  "list",
  "link",
  "file",
  "divider",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];

export const BLOCK_TYPE_LABELS: Record<ContentBlockType, string> = {
  heading: "Heading",
  paragraph: "Body text",
  image: "Image",
  video: "Video embed",
  video_link: "Video link",
  code: "Code block",
  callout: "Callout",
  quote: "Quote",
  list: "List",
  link: "Button link",
  file: "File download",
  divider: "Divider",
};

export type CalloutTone = "info" | "tip" | "warning";

export type ContentBlock = {
  id: string;
  type: ContentBlockType;
  text?: string;
  level?: 2 | 3 | 4;
  url?: string;
  alt?: string;
  caption?: string;
  title?: string;
  description?: string;
  language?: string;
  tone?: CalloutTone;
  ordered?: boolean;
  items?: string[];
  label?: string;
  attribution?: string;
};

export type CourseSection = {
  id: string;
  title: string;
  intro?: string;
  blocks: ContentBlock[];
};

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyBlock(type: ContentBlockType): ContentBlock {
  const base: ContentBlock = { id: newId(), type };

  switch (type) {
    case "heading":
      return { ...base, text: "New section heading", level: 2 };
    case "paragraph":
      return {
        ...base,
        text: "Write the explanation here. Keep it focused and short enough to scan.",
      };
    case "image":
      return { ...base, url: "", alt: "", caption: "" };
    case "video":
      return { ...base, url: "", title: "" };
    case "video_link":
      return { ...base, url: "", title: "Watch the walkthrough", description: "" };
    case "code":
      return { ...base, language: "text", text: "" };
    case "callout":
      return {
        ...base,
        tone: "tip",
        title: "Key idea",
        text: "The one thing to remember from this section.",
      };
    case "quote":
      return { ...base, text: "", attribution: "" };
    case "list":
      return { ...base, ordered: false, items: ["First point", "Second point"] };
    case "link":
      return { ...base, label: "Open resource", url: "", description: "" };
    case "file":
      return { ...base, label: "Download the worksheet", url: "", description: "" };
    case "divider":
      return base;
  }
}

export function emptySection(index: number): CourseSection {
  return {
    id: newId(),
    title: `Section ${index + 1}`,
    intro: "",
    blocks: [],
  };
}

/** Only absolute http(s) links or same-site paths are rendered. */
export function safeContentUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const url = value.trim();

  if (!url) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** YouTube and Vimeo links become privacy-friendly embeds. */
export function videoEmbedUrl(value: unknown): string | null {
  const safe = safeContentUrl(value);

  if (!safe) return null;

  try {
    const parsed = new URL(safe);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.searchParams.get("v") ??
        (parsed.pathname.startsWith("/embed/")
          ? parsed.pathname.split("/")[2]
          : null);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function isDirectVideoUrl(value: unknown): boolean {
  const safe = safeContentUrl(value);

  if (!safe) return false;

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(safe);
}
