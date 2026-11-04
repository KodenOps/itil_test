import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MdArrowBack, MdOpenInNew, MdSchedule, MdTag } from "react-icons/md";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { staticBlogPosts, studioPost } from "@/app/blog/blog";
import { getBlogPostBySlug } from "@/lib/content/blog-posts";
import { blogHostLabel } from "@/lib/content/blog";
import type { BlogContentBlock, BlogSource } from "@/types/app";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatDate(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value.slice(0, 10);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readMinutes(blocks: BlogContentBlock[]): number {
  const words = blocks
    .map((block) => ("text" in block && block.text ? block.text : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

function badge(source: BlogSource, label: string) {
  const tone =
    source === "studio"
      ? "bg-[#2660A4] text-white"
      : source === "medium"
        ? "bg-slate-900 text-white"
        : "bg-[#2660A4]/10 text-[#2660A4]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${tone}`}
    >
      {label}
    </span>
  );
}

function Block({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 className='mt-10 text-xl font-black tracking-tight text-slate-900'>
          {block.text}
        </h3>
      ) : (
        <h2 className='mt-12 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl'>
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className='mt-5 text-[15px] leading-8 text-slate-700 sm:text-base'>
          {block.text}
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol className='mt-5 space-y-2.5 pl-5 text-[15px] leading-7 text-slate-700 sm:text-base'>
          {block.items.map((item, index) => (
            <li key={index} className='list-decimal pl-1'>
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className='mt-5 space-y-2.5 pl-5 text-[15px] leading-7 text-slate-700 sm:text-base'>
          {block.items.map((item, index) => (
            <li key={index} className='relative pl-4'>
              <span className='absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-[#2660A4]' />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className='mt-7 border-l-4 border-[#2660A4] bg-slate-50/80 py-3 pl-5 pr-4'>
          <p className='text-base italic leading-7 text-slate-700'>{block.text}</p>
          {block.attribution && (
            <footer className='mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>
              {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <div className='mt-7 rounded-3xl border border-[#2660A4]/15 bg-[#2660A4]/5 p-5 sm:p-6'>
          {block.title && (
            <p className='text-[11px] font-bold uppercase tracking-[0.22em] text-[#2660A4]'>
              {block.title}
            </p>
          )}
          <p className='mt-2 text-sm leading-7 text-slate-700'>{block.text}</p>
        </div>
      );
    case "code":
      return (
        <pre className='mt-7 overflow-x-auto rounded-2xl bg-slate-900 p-5 text-[13px] leading-6 text-slate-100'>
          <code>{block.text}</code>
        </pre>
      );
    case "image":
      return (
        <figure className='mt-8'>
          <div className='relative h-64 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:h-80'>
            <Image
              src={block.url}
              alt={block.alt || ""}
              fill
              sizes='(max-width: 900px) 100vw, 800px'
              className='object-cover'
              unoptimized
            />
          </div>
          {block.caption && (
            <figcaption className='mt-2 text-center text-xs font-semibold text-slate-400'>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "divider":
      return <hr className='mt-10 border-slate-200' />;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const staticPost =
    [studioPost, ...staticBlogPosts].find((post) => post.slug === slug) ?? null;

  const dbPost = staticPost ? null : await getBlogPostBySlug(slug);

  if (!staticPost && !dbPost) notFound();

  // Static posts intentionally carry nulls (no external URL, no cover image),
  // so pick a source first instead of merging them with `??` — that would fall
  // through a static null to the (absent) database row and throw.
  const post = staticPost
    ? {
        title: staticPost.title,
        summary: staticPost.summary,
        category: staticPost.category,
        source: staticPost.source,
        externalUrl: staticPost.externalUrl,
        coverImage: staticPost.coverImage,
        publishedAt: staticPost.publishedAt,
        blocks: staticPost.content ?? [],
      }
    : {
        title: dbPost!.title,
        summary: dbPost!.summary,
        category: dbPost!.category ?? "Article",
        source: dbPost!.source,
        externalUrl: dbPost!.externalUrl,
        coverImage: dbPost!.coverImage,
        publishedAt: dbPost!.createdAt,
        blocks: dbPost!.content,
      };

  const { title, summary, category, source, externalUrl, coverImage, publishedAt, blocks } =
    post;
  const label =
    source === "studio"
      ? "CertifyHub studio"
      : blogHostLabel(externalUrl) ||
        (source === "medium" ? "Medium" : "External blog");

  const related = staticBlogPosts
    .filter((post) => post.slug !== slug)
    .slice(0, 3);

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />

        <article className='mx-auto w-full max-w-3xl px-5 pt-28 pb-16 md:px-8'>
          <Link
            href='/blog'
            className='group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2660A4]'
          >
            <MdArrowBack
              size={15}
              className='transition group-hover:-translate-x-1'
            />
            Back to the blog
          </Link>

          <header className='mt-6'>
            <div className='flex flex-wrap items-center gap-2'>
              {badge(source, label)}
              <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500'>
                <MdTag size={12} />
                {category}
              </span>
            </div>

            <h1 className='mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem]'>
              {title}
            </h1>

            <p className='mt-4 text-base leading-8 text-slate-600'>{summary}</p>

            <div className='mt-6 flex flex-wrap items-center gap-4 border-y border-slate-200 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
              <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
              {blocks.length > 0 && (
                <>
                  <span className='text-slate-300'>·</span>
                  <span className='inline-flex items-center gap-1.5'>
                    <MdSchedule size={13} />
                    {readMinutes(blocks)} min read
                  </span>
                </>
              )}
              {externalUrl && (
                <>
                  <span className='text-slate-300'>·</span>
                  <a
                    href={externalUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1.5 text-[#2660A4] hover:underline'
                  >
                    <MdOpenInNew size={13} />
                    View original
                  </a>
                </>
              )}
            </div>
          </header>

          {coverImage && (
            <div className='relative mt-8 h-60 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-lg shadow-slate-200/60 sm:h-80'>
              <Image
                src={coverImage}
                alt={title}
                fill
                priority
                sizes='(max-width: 900px) 100vw, 800px'
                className='object-cover'
                unoptimized
              />
            </div>
          )}

          <div className='mt-4'>
            {blocks.length > 0 ? (
              blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))
            ) : (
              <div className='mt-10 rounded-[28px] border border-slate-200 bg-slate-50/70 p-6 sm:p-8'>
                <p className='text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400'>
                  Published on {label}
                </p>
                <p className='mt-3 text-sm leading-7 text-slate-600'>
                  This post lives on {label}, so the full article opens there.
                  The summary above is pulled from the source so the blog keeps
                  a single, searchable index.
                </p>

                {externalUrl ? (
                  <a
                    href={externalUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d]'
                  >
                    Read the full post on {label}
                    <MdOpenInNew size={15} />
                  </a>
                ) : (
                  <p className='mt-5 text-sm text-slate-500'>
                    This post has not been published yet.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className='mt-14 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm'>
            <p className='text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400'>
              Keep reading
            </p>
            <div className='mt-4 grid gap-3 sm:grid-cols-3'>
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='group rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-[#2660A4]/30 hover:bg-white'
                >
                  <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400'>
                    {blogHostLabel(post.externalUrl)}
                  </p>
                  <p className='mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900'>
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
