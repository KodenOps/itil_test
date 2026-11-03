import type { ReactNode } from "react";
import {
  MdArrowForward,
  MdDownload,
  MdInfoOutline,
  MdLightbulbOutline,
  MdPlayCircleOutline,
  MdWarningAmber,
} from "react-icons/md";
import {
  isDirectVideoUrl,
  safeContentUrl,
  videoEmbedUrl,
  type ContentBlock,
  type CourseSection,
} from "@/types/cms";

const CALLOUT_STYLES = {
  info: {
    box: "border-sky-200 bg-sky-50/80",
    icon: "text-sky-600",
    title: "text-sky-900",
    body: "text-sky-800",
    Icon: MdInfoOutline,
  },
  tip: {
    box: "border-emerald-200 bg-emerald-50/80",
    icon: "text-emerald-600",
    title: "text-emerald-900",
    body: "text-emerald-800",
    Icon: MdLightbulbOutline,
  },
  warning: {
    box: "border-amber-200 bg-amber-50/80",
    icon: "text-amber-600",
    title: "text-amber-900",
    body: "text-amber-800",
    Icon: MdWarningAmber,
  },
} as const;

function Paragraphs({ text }: { text: string }) {
  return (
    <div className='space-y-4'>
      {text
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part, index) => (
          <p
            key={index}
            className='whitespace-pre-line text-[15px] leading-8 text-slate-700 sm:text-base'
          >
            {part}
          </p>
        ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const text = block.text?.trim();
      if (!text) return null;

      if (block.level === 4) {
        return (
          <h4 className='pt-1 text-base font-black tracking-tight text-slate-900'>
            {text}
          </h4>
        );
      }

      if (block.level === 3) {
        return (
          <h3 className='pt-1 text-xl font-black tracking-tight text-slate-900'>
            {text}
          </h3>
        );
      }

      return (
        <h2 className='pt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl'>
          {text}
        </h2>
      );
    }

    case "paragraph":
      return block.text ? <Paragraphs text={block.text} /> : null;

    case "image": {
      const url = safeContentUrl(block.url);
      if (!url) return null;

      return (
        <figure className='overflow-hidden rounded-3xl border border-slate-200 bg-slate-50'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={block.alt ?? ""}
            loading='lazy'
            className='max-h-[560px] w-full object-cover'
          />
          {block.caption ? (
            <figcaption className='border-t border-slate-200 bg-white px-5 py-3 text-xs leading-6 text-slate-500'>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "video": {
      const url = safeContentUrl(block.url);
      if (!url) return null;

      const embed = videoEmbedUrl(url);

      if (embed) {
        return (
          <figure className='overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-lg shadow-slate-200/60'>
            <div className='aspect-video w-full'>
              <iframe
                src={embed}
                title={block.title || "Course video"}
                className='h-full w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
                referrerPolicy='strict-origin-when-cross-origin'
              />
            </div>
            {block.title ? (
              <figcaption className='bg-white px-5 py-3 text-sm font-semibold text-slate-700'>
                {block.title}
              </figcaption>
            ) : null}
          </figure>
        );
      }

      if (isDirectVideoUrl(url)) {
        return (
          <figure className='overflow-hidden rounded-3xl border border-slate-200 bg-slate-950'>
            <video controls preload='metadata' className='w-full' src={url} />
            {block.title ? (
              <figcaption className='bg-white px-5 py-3 text-sm font-semibold text-slate-700'>
                {block.title}
              </figcaption>
            ) : null}
          </figure>
        );
      }

      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-[#2660A4]/40 hover:bg-[#2660A4]/5'
        >
          <span className='flex items-center gap-2'>
            <MdPlayCircleOutline size={20} className='text-[#2660A4]' />
            {block.title || "Open video"}
          </span>
          <MdArrowForward size={16} />
        </a>
      );
    }

    case "video_link": {
      const url = safeContentUrl(block.url);
      if (!url) return null;

      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2660A4]/30 hover:shadow-md'
        >
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2660A4]/10 text-[#2660A4]'>
            <MdPlayCircleOutline size={24} />
          </span>
          <span className='min-w-0'>
            <span className='block text-sm font-black text-slate-900 group-hover:text-[#0E2F5E]'>
              {block.title || "Watch the video"}
            </span>
            {block.description ? (
              <span className='mt-1 block text-sm leading-6 text-slate-600'>
                {block.description}
              </span>
            ) : null}
            <span className='mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#2660A4]'>
              Watch <MdArrowForward size={13} />
            </span>
          </span>
        </a>
      );
    }

    case "code": {
      if (!block.text) return null;

      return (
        <div className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg shadow-slate-300/40'>
          <div className='flex items-center justify-between border-b border-white/10 px-4 py-2.5'>
            <span className='text-[11px] font-bold uppercase tracking-[0.2em] text-white/50'>
              {block.language || "text"}
            </span>
            <span className='flex gap-1.5'>
              <span className='h-2.5 w-2.5 rounded-full bg-rose-400/70' />
              <span className='h-2.5 w-2.5 rounded-full bg-amber-400/70' />
              <span className='h-2.5 w-2.5 rounded-full bg-emerald-400/70' />
            </span>
          </div>
          <pre className='max-h-[520px] overflow-auto px-5 py-4 text-[13px] leading-6 text-emerald-100'>
            <code className='whitespace-pre'>{block.text}</code>
          </pre>
        </div>
      );
    }

    case "callout": {
      const tone = CALLOUT_STYLES[block.tone ?? "tip"];
      const Icon = tone.Icon;

      return (
        <aside className={`rounded-2xl border p-5 ${tone.box}`}>
          <div className='flex items-start gap-3'>
            <Icon size={20} className={`mt-0.5 shrink-0 ${tone.icon}`} />
            <div>
              {block.title ? (
                <p className={`text-sm font-black ${tone.title}`}>{block.title}</p>
              ) : null}
              {block.text ? (
                <p className={`mt-1 whitespace-pre-line text-sm leading-7 ${tone.body}`}>
                  {block.text}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      );
    }

    case "quote":
      return block.text ? (
        <blockquote className='rounded-3xl border-l-4 border-[#2660A4] bg-slate-50 px-6 py-5'>
          <p className='text-base font-medium italic leading-8 text-slate-700'>
            “{block.text}”
          </p>
          {block.attribution ? (
            <footer className='mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500'>
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      ) : null;

    case "list": {
      const items = (block.items ?? []).filter(Boolean);
      if (items.length === 0) return null;

      const Tag = block.ordered ? "ol" : "ul";

      return (
        <Tag
          className={`space-y-2.5 pl-5 text-[15px] leading-7 text-slate-700 ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-[#2660A4]`}
        >
          {items.map((item, index) => (
            <li key={index} className='pl-1'>
              {item}
            </li>
          ))}
        </Tag>
      );
    }

    case "link": {
      const url = safeContentUrl(block.url);
      if (!url) return null;

      const external = /^https?:/i.test(url);

      return (
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          {block.description ? (
            <p className='mb-3 text-sm leading-6 text-slate-600'>{block.description}</p>
          ) : null}
          <a
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className='inline-flex items-center gap-2 rounded-full bg-[#0E2F5E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173f73]'
          >
            {block.label || "Open link"} <MdArrowForward size={15} />
          </a>
        </div>
      );
    }

    case "file": {
      const url = safeContentUrl(block.url);
      if (!url) return null;

      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#2660A4]/40 hover:bg-[#2660A4]/5'
        >
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600'>
            <MdDownload size={20} />
          </span>
          <span className='min-w-0'>
            <span className='block text-sm font-bold text-slate-900'>
              {block.label || "Download file"}
            </span>
            {block.description ? (
              <span className='block text-xs leading-5 text-slate-500'>
                {block.description}
              </span>
            ) : null}
          </span>
        </a>
      );
    }

    case "divider":
      return <hr className='border-slate-200' />;

    default:
      return null;
  }
}

/** One section card, also used by the sequential learner view. */
export function CourseSectionCard({
  section,
  index,
  footer,
}: {
  section: CourseSection;
  index: number;
  footer?: ReactNode;
}) {
  return (
    <section
      id={`section-${section.id}`}
      className='scroll-mt-28 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8'
    >
      <div className='flex items-start gap-4'>
        <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E2F5E] text-sm font-black text-white'>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className='min-w-0'>
          <h2 className='text-2xl font-black tracking-tight text-slate-900'>
            {section.title}
          </h2>
          {section.intro ? (
            <p className='mt-2 max-w-3xl text-sm leading-7 text-slate-600'>
              {section.intro}
            </p>
          ) : null}
        </div>
      </div>

      {section.blocks.length > 0 ? (
        <div className='mt-6 space-y-5'>
          {section.blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </div>
      ) : (
        <p className='mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500'>
          This section has no content blocks yet.
        </p>
      )}

      {footer ? <div className='mt-7'>{footer}</div> : null}
    </section>
  );
}

/**
 * Renders a studio-built page. Shared by the public course page and the
 * studio's live preview so both always look the same.
 */
export default function CourseSections({
  sections,
}: {
  sections: CourseSection[];
}) {
  return (
    <div className='space-y-8'>
      {sections.map((section, index) => (
        <CourseSectionCard
          key={section.id}
          section={section}
          index={index}
        />
      ))}
    </div>
  );
}
