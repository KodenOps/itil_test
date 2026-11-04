"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdLink,
  MdOutlineArticle,
  MdOutlineCloudUpload,
  MdOutlineVisibility,
  MdPublic,
  MdRefresh,
} from "react-icons/md";
import {
  deleteBlogPost,
  previewBlogLink,
  saveBlogPost,
  setBlogPostPublished,
} from "./blog-actions";
import { blocksToMarkdown, markdownToBlocks } from "@/lib/content/blog";
import type { BlogPost, BlogSource } from "@/types/app";

type Draft = {
  id: string | null;
  title: string;
  summary: string;
  category: string;
  author: string;
  source: BlogSource;
  externalUrl: string;
  coverImage: string;
  markdown: string;
  published: boolean;
};

const EMPTY: Draft = {
  id: null,
  title: "",
  summary: "",
  category: "",
  author: "CertifyHub studio",
  source: "studio",
  externalUrl: "",
  coverImage: "",
  markdown:
    "Open with the one idea the reader should leave with.\n\n## The first section\n\nExplain it in two short paragraphs. Short sentences beat long ones.\n\n- A concrete example\n- The trade-off nobody mentions\n\n> A quote that earns its place.\n\n## Exam angle\n\nWhat a question about this would actually test.",
  published: false,
};

const SOURCE_OPTIONS: { value: BlogSource; label: string }[] = [
  { value: "studio", label: "Written here (studio)" },
  { value: "hashnode", label: "Hashnode" },
  { value: "medium", label: "Medium" },
  { value: "dev", label: "Dev.to" },
  { value: "external", label: "Other blog" },
];

function formatDate(value: string): string {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? value.slice(0, 10)
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function draftFromPost(post: BlogPost): Draft {
  return {
    id: post.id,
    title: post.title,
    summary: post.summary,
    category: post.category ?? "",
    author: post.author,
    source: post.source,
    externalUrl: post.externalUrl ?? "",
    coverImage: post.coverImage ?? "",
    markdown: blocksToMarkdown(post.content),
    published: post.published,
  };
}

export default function BlogStudio({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [fetching, setFetching] = useState(false);
  const [pending, startTransition] = useTransition();

  const preview = useMemo(
    () => markdownToBlocks(draft.markdown),
    [draft.markdown],
  );

  const draftPosts = posts.filter((post) => !post.published);
  const livePosts = posts.filter((post) => post.published);

  const update = (patch: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const handleFetch = async () => {
    if (!draft.externalUrl.trim()) {
      setMessage({ tone: "error", text: "Paste the blog link first." });
      return;
    }

    setFetching(true);
    setMessage(null);

    const result = await previewBlogLink(draft.externalUrl);

    setFetching(false);

    if (!result.ok) {
      setMessage({ tone: "error", text: result.message });
      return;
    }

    setDraft((current) => ({
      ...current,
      title: result.title || current.title,
      summary: result.summary || current.summary,
      coverImage: result.coverImage || current.coverImage,
      source: result.source === "studio" ? "external" : result.source,
    }));

    setMessage({
      tone: "ok",
      text: "Details pulled from the source. Check the title and summary, then save.",
    });
  };

  const handleSave = (published: boolean) => {
    setMessage(null);

    startTransition(async () => {
      const result = await saveBlogPost({ ...draft, published });

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      setMessage({
        tone: "ok",
        text: published ? "Published — it is live on /blog." : "Saved as a draft.",
      });

      setDraft({ ...EMPTY, id: result.id, published });
      router.refresh();
    });
  };

  const handleDelete = (post: BlogPost) => {
    startTransition(async () => {
      const result = await deleteBlogPost(post.id);

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      if (draft.id === post.id) setDraft(EMPTY);
      router.refresh();
    });
  };

  const handleToggle = (post: BlogPost) => {
    startTransition(async () => {
      const result = await setBlogPostPublished(post.id, !post.published);

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className='grid gap-6 xl:grid-cols-[1.35fr_0.65fr]'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-7'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-slate-500'>
            <MdOutlineArticle size={18} />
            <p className='text-xs font-bold uppercase tracking-[0.28em]'>
              {draft.id ? "Editing post" : "New blog post"}
            </p>
          </div>

          <div className='flex gap-2'>
            {draft.id && (
              <button
                type='button'
                onClick={() => setDraft(EMPTY)}
                className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300'
              >
                <MdAdd size={14} /> New
              </button>
            )}
            <button
              type='button'
              onClick={() => update({ source: draft.source === "studio" ? "hashnode" : "studio" })}
              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4]'
            >
              <MdLink size={14} />
              {draft.source === "studio" ? "Link an external post" : "Write a post instead"}
            </button>
          </div>
        </div>

        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
          <label className='sm:col-span-2'>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Title
            </span>
            <input
              value={draft.title}
              onChange={(event) => update({ title: event.target.value })}
              placeholder='What Docker layer caching actually caches'
              className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          <label>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Category
            </span>
            <input
              value={draft.category}
              onChange={(event) => update({ category: event.target.value })}
              placeholder='Kubernetes'
              className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          <label>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Source
            </span>
            <select
              value={draft.source}
              onChange={(event) => update({ source: event.target.value as BlogSource })}
              className='mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {draft.source !== "studio" && (
            <div className='sm:col-span-2'>
              <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
                External blog link
              </span>
              <div className='mt-1.5 flex flex-col gap-2 sm:flex-row'>
                <input
                  value={draft.externalUrl}
                  onChange={(event) => update({ externalUrl: event.target.value })}
                  placeholder='https://kodenops.hashnode.dev/building-docker-images'
                  className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
                />
                <button
                  type='button'
                  onClick={handleFetch}
                  disabled={fetching}
                  className='inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-60'
                >
                  {fetching ? (
                    <MdRefresh size={15} className='animate-spin' />
                  ) : (
                    <MdOutlineCloudUpload size={15} />
                  )}
                  Fetch details
                </button>
              </div>
              <p className='mt-1.5 text-xs text-slate-400'>
                Hashnode, Medium, Dev.to and any page with Open Graph tags fill the
                title, summary and cover automatically.
              </p>
            </div>
          )}

          <label className='sm:col-span-2'>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Summary
            </span>
            <textarea
              value={draft.summary}
              onChange={(event) => update({ summary: event.target.value })}
              rows={2}
              placeholder='One or two sentences for the card on /blog.'
              className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          <label>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Author
            </span>
            <input
              value={draft.author}
              onChange={(event) => update({ author: event.target.value })}
              className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          <label>
            <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
              Cover image URL
            </span>
            <input
              value={draft.coverImage}
              onChange={(event) => update({ coverImage: event.target.value })}
              placeholder='https://…'
              className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          {draft.source === "studio" && (
            <label className='sm:col-span-2'>
              <span className='text-xs font-bold uppercase tracking-[0.18em] text-slate-500'>
                Body
              </span>
              <textarea
                value={draft.markdown}
                onChange={(event) => update({ markdown: event.target.value })}
                rows={16}
                spellCheck
                className='mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-[13px] leading-6 text-slate-900 outline-none transition focus:border-[#2660A4]'
              />
              <p className='mt-1.5 text-xs text-slate-400'>
                Markdown-lite: <code>## Heading</code>, blank-line paragraphs,{" "}
                <code>- bullets</code>, <code>&gt; quote</code>,{" "}
                <code>``` code ```</code>, <code>---</code>, and{" "}
                <code>![alt](url)</code> images.
              </p>
            </label>
          )}
        </div>

        {message && (
          <p
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
              message.tone === "ok"
                ? "bg-[#1F8A70]/10 text-[#166b56]"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className='mt-5 flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={() => handleSave(false)}
            disabled={pending}
            className='inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 disabled:opacity-60'
          >
            Save as draft
          </button>
          <button
            type='button'
            onClick={() => handleSave(true)}
            disabled={pending}
            className='inline-flex items-center gap-2 rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
          >
            <MdPublic size={15} />
            {draft.published ? "Update & keep published" : "Publish to /blog"}
          </button>
          {(() => {
            const saved = posts.find((post) => post.id === draft.id);

            // Drafts have no public URL yet, so only live posts get a link.
            if (!saved?.published) return null;

            return (
              <a
                href={`/blog/${saved.slug}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-[#2660A4] transition hover:bg-[#2660A4]/5'
              >
                <MdOutlineVisibility size={15} /> View live post
              </a>
            );
          })()}
        </div>
      </div>

      {/* Right column: live preview + post list */}
      <div className='space-y-6'>
        {draft.source === "studio" && (
          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60'>
            <p className='text-xs font-bold uppercase tracking-[0.28em] text-slate-400'>
              Preview
            </p>
            <h3 className='mt-3 text-lg font-black leading-snug text-slate-900'>
              {draft.title || "Untitled post"}
            </h3>
            <p className='mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
              {draft.category || "Uncategorised"}
            </p>
            <div className='mt-3 max-h-64 space-y-2 overflow-y-auto text-sm leading-6 text-slate-600'>
              {preview.slice(0, 12).map((block, index) => (
                <p key={index} className={block.type === "heading" ? "font-bold text-slate-900" : ""}>
                  {block.type === "list"
                    ? block.items.join(" · ")
                    : block.type === "divider"
                      ? "—"
                      : "text" in block
                        ? block.text
                        : ""}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-bold uppercase tracking-[0.28em] text-slate-400'>
              Posts ({posts.length})
            </p>
            <span className='text-[11px] font-bold text-slate-400'>
              {draftPosts.length} draft{draftPosts.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className='mt-4 space-y-2'>
            {posts.length === 0 && (
              <p className='rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500'>
                No posts yet. Write one on the left, or paste a Hashnode link.
              </p>
            )}

            {[...draftPosts, ...livePosts].map((post) => (
              <div
                key={post.id}
                className='rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5'
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-bold text-slate-900'>
                      {post.title}
                    </p>
                    <p className='mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400'>
                      {post.source === "studio" ? "Studio" : post.source} ·{" "}
                      {formatDate(post.updatedAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      post.published
                        ? "bg-[#1F8A70]/15 text-[#166b56]"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {post.published ? "Live" : "Draft"}
                  </span>
                </div>

                <div className='mt-2.5 flex flex-wrap gap-2'>
                  <button
                    type='button'
                    onClick={() => setDraft(draftFromPost(post))}
                    className='inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm transition hover:text-[#2660A4]'
                  >
                    <MdEdit size={12} /> Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => handleToggle(post)}
                    disabled={pending}
                    className='inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm transition hover:text-[#2660A4] disabled:opacity-60'
                  >
                    <MdPublic size={12} />
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDelete(post)}
                    disabled={pending}
                    className='inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-60'
                  >
                    <MdDeleteOutline size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
