import Link from "next/link";
import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { staticBlogPosts, studioPost } from "./blog";
import { listPublishedBlogPosts } from "@/lib/content/blog-posts";
import { blogHostLabel } from "@/lib/content/blog";
import type { BlogPost, BlogSource } from "@/types/app";

export const dynamic = "force-dynamic";

type Card = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  source: BlogSource;
  label: string;
  externalUrl: string | null;
  coverImage: string | null;
  readMinutes: number | null;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value.slice(0, 10);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function minutesFor(post: Pick<BlogPost, "content">): number | null {
  const words = post.content
    .map((block) =>
      "text" in block && typeof block.text === "string" ? block.text : "",
    )
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return words > 0 ? Math.max(1, Math.round(words / 220)) : null;
}

function sourceTone(source: BlogSource): string {
  switch (source) {
    case "studio":
      return "bg-[#2660A4] text-white";
    case "hashnode":
      return "bg-[#2962ff]/10 text-[#1f4bd8]";
    case "medium":
      return "bg-slate-900 text-white";
    case "dev":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-[#1F8A70]/10 text-[#166b56]";
  }
}

function CardCover({ post, priority }: { post: Card; priority?: boolean }) {
  if (!post.coverImage) {
    return (
      <div className='flex h-44 items-center justify-center bg-gradient-to-br from-[#2660A4]/10 to-[#1F8A70]/10'>
        <span className='text-4xl font-black text-[#2660A4]/30'>
          {post.title.slice(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <div className='relative h-44 overflow-hidden bg-slate-100 sm:h-48'>
      <Image
        src={post.coverImage}
        alt={post.title}
        fill
        priority={priority}
        sizes='(max-width: 768px) 100vw, 33vw'
        className='object-cover transition duration-500 group-hover:scale-105'
        unoptimized
      />
    </div>
  );
}

export default async function BlogPage() {
  const dbPosts = await listPublishedBlogPosts();

  const dbStudio: Card[] = dbPosts
    .filter((post) => post.source === "studio")
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      category: post.category ?? "Studio",
      publishedAt: post.createdAt,
      source: post.source,
      label: post.author || "CertifyHub studio",
      externalUrl: post.externalUrl,
      coverImage: post.coverImage,
      readMinutes: minutesFor(post),
    }));

  const pinned: Card = {
    slug: studioPost.slug,
    title: studioPost.title,
    summary: studioPost.summary,
    category: studioPost.category,
    publishedAt: studioPost.publishedAt,
    source: studioPost.source,
    label: "CertifyHub studio",
    externalUrl: studioPost.externalUrl,
    coverImage: studioPost.coverImage,
    readMinutes: studioPost.readMinutes ?? null,
  };

  const external: Card[] = [
    ...staticBlogPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      category: post.category,
      publishedAt: post.publishedAt,
      source: post.source,
      label: blogHostLabel(post.externalUrl),
      externalUrl: post.externalUrl,
      coverImage: post.coverImage,
      readMinutes: null,
    })),
    ...dbPosts
      .filter((post) => post.source !== "studio")
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        category: post.category ?? "External",
        publishedAt: post.createdAt,
        source: post.source,
        label: blogHostLabel(post.externalUrl),
        externalUrl: post.externalUrl,
        coverImage: post.coverImage,
        readMinutes: null,
      })),
  ].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <div className='min-h-screen w-full bg-slate-50'>
      <NavBar />

      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.10),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_60%,_#eef2f7_100%)]' />

        <section className='mx-auto max-w-6xl px-4 pt-28 pb-10 md:px-8'>
          <p className='text-xs font-bold uppercase tracking-[0.3em] text-[#2660A4]'>
            The CertifyHub publication
          </p>
          <h1 className='mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
            Exam notes, track recaps and the occasional strongly-held opinion
            about caching
          </h1>
          <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base'>
            Everything worth reading before you sit the paper — written in the
            studio here, or published on Hashnode, Medium and Dev.to and linked
            in one place.
          </p>
        </section>
      </main>

      <section className='mx-auto max-w-6xl px-4 pb-16 md:px-8'>
        {/* Featured studio article — the DevOps & Sys Eng track */}
        <Link
          href={`/blog/${pinned.slug}`}
          className='group grid overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50 lg:grid-cols-[1.05fr_0.95fr]'
        >
          <div className='relative min-h-[260px] bg-slate-100 lg:min-h-full'>
            {pinned.coverImage ? (
              <Image
                src={pinned.coverImage}
                alt={pinned.title}
                fill
                priority
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover transition duration-700 group-hover:scale-105'
                unoptimized
              />
            ) : (
              <div className='h-full w-full bg-gradient-to-br from-[#2660A4]/15 to-[#1F8A70]/15' />
            )}
            <span className='absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2660A4] shadow-sm'>
              Featured
            </span>
          </div>

          <div className='flex flex-col justify-center gap-4 p-7 sm:p-10'>
            <div className='flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]'>
              <span className={`rounded-full px-3 py-1 ${sourceTone(pinned.source)}`}>
                {pinned.category}
              </span>
              <span className='text-slate-400'>{formatDate(pinned.publishedAt)}</span>
              {pinned.readMinutes && (
                <>
                  <span className='text-slate-300'>·</span>
                  <span className='text-slate-400'>{pinned.readMinutes} min read</span>
                </>
              )}
            </div>

            <h2 className='text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl'>
              {pinned.title}
            </h2>
            <p className='text-sm leading-7 text-slate-600'>{pinned.summary}</p>

            <span className='mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#2660A4]'>
              Read the recap
              <span className='transition group-hover:translate-x-1'>→</span>
            </span>
          </div>
        </Link>

        {/* Studio posts created from the admin dashboard */}
        {dbStudio.length > 0 && (
          <div className='mt-14'>
            <div className='flex items-end justify-between gap-4'>
              <h2 className='text-lg font-black text-slate-900'>
                Fresh from the studio
              </h2>
              <span className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
                {dbStudio.length} post{dbStudio.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {dbStudio.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <CardCover post={post} />
                  <div className='flex flex-1 flex-col p-5'>
                    <div className='flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]'>
                      <span className={`rounded-full px-2.5 py-1 ${sourceTone(post.source)}`}>
                        {post.category}
                      </span>
                      <span className='text-slate-400'>
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className='mt-3 text-base font-black leading-snug text-slate-900'>
                      {post.title}
                    </h3>
                    <p className='mt-2 line-clamp-3 text-sm leading-6 text-slate-600'>
                      {post.summary}
                    </p>
                    <span className='mt-auto pt-4 text-xs font-bold text-[#2660A4]'>
                      Read post →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* External publication */}
        <div className='mt-14'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <h2 className='text-lg font-black text-slate-900'>
                From the wider publication
              </h2>
              <p className='mt-1 text-sm text-slate-600'>
                Posts published on Hashnode and elsewhere — open the card for
                the summary, then jump to the original.
              </p>
            </div>
            <span className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500'>
              {external.length} posts
            </span>
          </div>

          {external.length === 0 ? (
            <p className='mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500'>
              No external posts yet. An admin can paste a blog link in the
              studio and it will show up here.
            </p>
          ) : (
            <div className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {external.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <CardCover post={post} />
                  <div className='flex flex-1 flex-col p-5'>
                    <div className='flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]'>
                      <span className={`rounded-full px-2.5 py-1 ${sourceTone(post.source)}`}>
                        {post.label}
                      </span>
                      <span className='text-slate-400'>
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className='mt-3 text-base font-black leading-snug text-slate-900'>
                      {post.title}
                    </h3>
                    <p className='mt-2 line-clamp-3 text-sm leading-6 text-slate-600'>
                      {post.summary}
                    </p>
                    <span className='mt-auto pt-4 text-xs font-bold text-[#2660A4]'>
                      Open post →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
