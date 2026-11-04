/**
 * Pure blog helpers — safe to import from both the server and the browser.
 *
 * The admin studio writes posts in a small markdown subset and stores them as
 * an array of blocks; the public blog renders those blocks. Keeping the
 * conversion here means the editor preview and the published page can never
 * drift apart.
 */

import {
  BLOG_SOURCES,
  type BlogContentBlock,
  type BlogSource,
} from "@/types/app";

const MAX_BLOCKS = 400;

export function isBlogSource(value: unknown): value is BlogSource {
  return (
    typeof value === "string" && (BLOG_SOURCES as readonly string[]).includes(value)
  );
}

export function blogSourceLabel(source: BlogSource): string {
  switch (source) {
    case "studio":
      return "CertifyHub studio";
    case "hashnode":
      return "Hashnode";
    case "medium":
      return "Medium";
    case "dev":
      return "Dev.to";
    default:
      return "External blog";
  }
}

/** Highlights the host an external post lives on. */
export function blogHostLabel(url: string | null | undefined): string {
  if (!url) return "External blog";

  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    if (host.includes("hashnode")) return "Hashnode";
    if (host.includes("medium.com")) return "Medium";
    if (host.includes("dev.to")) return "Dev.to";
    if (host.includes("substack")) return "Substack";
    if (host.includes("ghost")) return "Ghost";

    return host;
  } catch {
    return "External blog";
  }
}

export function detectBlogSource(url: string): BlogSource {
  const label = blogHostLabel(url).toLowerCase();

  if (label === "hashnode") return "hashnode";
  if (label === "medium") return "medium";
  if (label === "dev.to") return "dev";

  return "external";
}

/** A URL-safe slug. Stable enough to be used as the public blog URL. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function lineList(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => text(item, 1200))
        .filter(Boolean)
        .slice(0, 80)
    : [];
}

/**
 * Markdown-lite → blocks.
 *
 * Supported: `## heading`, `### heading`, blank-line separated paragraphs,
 * `- bullet` / `1. numbered` lists, `> quote`, ``` fenced code ```, `---`
 * divider, and `![alt](url)` images on their own line.
 */
export function markdownToBlocks(markdown: string): BlogContentBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: BlogContentBlock[] = [];

  let paragraph: string[] = [];
  let list: { items: string[]; ordered: boolean } | null = null;
  let quote: string[] = [];
  let code: { lines: string[]; language: string } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({ type: "list", items: list.items, ordered: list.ordered });
    list = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push({
      type: "quote",
      text: quote.join(" ").trim(),
      attribution: "",
    });
    quote = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (code) {
      if (line.trim().startsWith("```")) {
        blocks.push({
          type: "code",
          text: code.lines.join("\n"),
          language: code.language,
        });
        code = null;
      } else {
        code.lines.push(raw);
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();
      code = { lines: [], language: line.trim().slice(3).trim() || "text" };
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({ type: "divider" });
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        type: "heading",
        text: heading[2].trim(),
        level: heading[1].length === 3 ? 3 : 2,
      });
      continue;
    }

    const image = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (image) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        type: "image",
        url: image[2],
        alt: image[1],
        caption: "",
      });
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      flushQuote();
      if (!list || list.ordered) {
        flushList();
        list = { items: [], ordered: false };
      }
      list.items.push(bullet[1].trim());
      continue;
    }

    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      flushQuote();
      if (!list || !list.ordered) {
        flushList();
        list = { items: [], ordered: true };
      }
      list.items.push(numbered[1].trim());
      continue;
    }

    if (line.trim().startsWith(">")) {
      flushParagraph();
      flushList();
      quote.push(line.trim().slice(1).trim());
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();

  if (code) {
    blocks.push({ type: "code", text: code.lines.join("\n"), language: code.language });
  }

  return blocks.slice(0, MAX_BLOCKS);
}

/** Blocks → the same markdown subset, so posts round-trip in the editor. */
export function blocksToMarkdown(blocks: BlogContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `${"#".repeat(block.level)} ${block.text}`;
        case "paragraph":
          return block.text;
        case "list":
          return block.items
            .map((item, index) =>
              block.ordered ? `${index + 1}. ${item}` : `- ${item}`,
            )
            .join("\n");
        case "quote":
          return block.attribution
            ? `> ${block.text}\n> — ${block.attribution}`
            : `> ${block.text}`;
        case "callout":
          return `> ${block.title ? `**${block.title}** — ` : ""}${block.text}`;
        case "code":
          return `\`\`\`${block.language}\n${block.text}\n\`\`\``;
        case "image":
          return `![${block.alt}](${block.url})`;
        case "divider":
          return "---";
      }
    })
    .join("\n\n");
}

/** Server-side guard: the studio sends JSON, so everything is re-validated. */
export function normalizeBlogContent(input: unknown): BlogContentBlock[] {
  if (!Array.isArray(input)) return [];

  const blocks: BlogContentBlock[] = [];

  for (const raw of input.slice(0, MAX_BLOCKS)) {
    if (!raw || typeof raw !== "object") continue;

    const block = raw as Record<string, unknown>;
    const type = text(block.type, 20);

    switch (type) {
      case "heading": {
        const heading = text(block.text, 240);
        if (!heading) break;
        blocks.push({
          type: "heading",
          text: heading,
          level: Number(block.level) === 3 ? 3 : 2,
        });
        break;
      }
      case "paragraph": {
        const value = text(block.text, 8000);
        if (value) blocks.push({ type: "paragraph", text: value });
        break;
      }
      case "list": {
        const items = lineList(block.items);
        if (items.length) {
          blocks.push({
            type: "list",
            items,
            ordered: Boolean(block.ordered),
          });
        }
        break;
      }
      case "quote": {
        const value = text(block.text, 2000);
        if (value) {
          blocks.push({
            type: "quote",
            text: value,
            attribution: text(block.attribution, 160),
          });
        }
        break;
      }
      case "callout": {
        const value = text(block.text, 3000);
        if (value) {
          blocks.push({
            type: "callout",
            text: value,
            title: text(block.title, 160),
          });
        }
        break;
      }
      case "code": {
        const value =
          typeof block.text === "string" ? block.text.slice(0, 20000) : "";
        if (value.trim()) {
          blocks.push({
            type: "code",
            text: value,
            language: text(block.language, 40) || "text",
          });
        }
        break;
      }
      case "image": {
        const url = text(block.url, 2048);
        if (url) {
          blocks.push({
            type: "image",
            url,
            alt: text(block.alt, 240),
            caption: text(block.caption, 300),
          });
        }
        break;
      }
      case "divider":
        blocks.push({ type: "divider" });
        break;
    }
  }

  return blocks;
}

/** Only absolute http(s) links and same-site paths are accepted. */
export function safeBlogUrl(value: unknown): string | null {
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
