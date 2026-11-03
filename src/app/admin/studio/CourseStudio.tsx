"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdCheckCircle,
  MdCode,
  MdDeleteOutline,
  MdDownload,
  MdEdit,
  MdErrorOutline,
  MdFormatListBulleted,
  MdFormatQuote,
  MdHorizontalRule,
  MdImage,
  MdLink,
  MdNotes,
  MdOndemandVideo,
  MdOutlineAddPhotoAlternate,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
  MdOutlineDragIndicator,
  MdOutlineOpenInNew,
  MdSave,
  MdTitle,
  MdVisibility,
  MdCampaign,
} from "react-icons/md";
import CourseSections from "@/app/components/CourseSections";
import { createCourse, saveCoursePage, updateCourse } from "./actions";
import type { StudioCourse } from "@/lib/content/cms";
import {
  BLOCK_TYPE_LABELS,
  CONTENT_BLOCK_TYPES,
  emptyBlock,
  emptySection,
  type ContentBlock,
  type ContentBlockType,
  type CourseSection,
} from "@/types/cms";

const PALETTE_MIME = "application/x-course-block-type";
const BLOCK_MIME = "application/x-course-block";

const BLOCK_ICONS: Record<ContentBlockType, React.ReactNode> = {
  heading: <MdTitle size={17} />,
  paragraph: <MdNotes size={17} />,
  image: <MdImage size={17} />,
  video: <MdOndemandVideo size={17} />,
  video_link: <MdOndemandVideo size={17} />,
  code: <MdCode size={17} />,
  callout: <MdCampaign size={17} />,
  quote: <MdFormatQuote size={17} />,
  list: <MdFormatListBulleted size={17} />,
  link: <MdLink size={17} />,
  file: <MdDownload size={17} />,
  divider: <MdHorizontalRule size={17} />,
};

const INPUT =
  "w-full! rounded-xl! border! border-slate-200! bg-white! px-3! py-2.5! text-sm! text-slate-900! mb-0! outline-none transition focus:border-[#2660A4]!";
const LABEL = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

type EditorMeta = {
  title: string;
  summary: string;
  track: string;
  level: string;
  estimatedHours: number;
  accentFrom: string;
  accentTo: string;
  href: string;
  isPublished: boolean;
};

function metaFromCourse(course: StudioCourse): EditorMeta {
  return {
    title: course.title,
    summary: course.summary,
    track: course.track,
    level: course.level,
    estimatedHours: course.estimatedHours,
    accentFrom: course.accentFrom,
    accentTo: course.accentTo,
    href: course.href,
    isPublished: course.isPublished,
  };
}

export default function CourseStudio({
  courses,
  pages,
}: {
  courses: StudioCourse[];
  pages: Record<string, CourseSection[]>;
}) {
  const router = useRouter();
  const [created, setCreated] = useState<StudioCourse[]>([]);
  const [activeSlug, setActiveSlug] = useState(courses[0]?.slug ?? "");
  const [showCreate, setShowCreate] = useState(courses.length === 0);

  const allCourses = useMemo(() => {
    const seen = new Set(courses.map((course) => course.slug));
    return [...courses, ...created.filter((course) => !seen.has(course.slug))];
  }, [courses, created]);

  const active = allCourses.find((course) => course.slug === activeSlug);

  useEffect(() => {
    if (!active && allCourses[0]) setActiveSlug(allCourses[0].slug);
  }, [active, allCourses]);

  return (
    <div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
      <aside className='space-y-4'>
        <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-slate-500'>
              Courses
            </p>
            <button
              type='button'
              onClick={() => setShowCreate((value) => !value)}
              className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0E2F5E] text-white transition hover:bg-[#173f73]'
              aria-label='Create a course'
            >
              <MdAdd size={17} />
            </button>
          </div>

          <div className='mt-3 space-y-1.5'>
            {allCourses.map((course) => {
              const selected = course.slug === activeSlug;

              return (
                <button
                  key={course.slug}
                  type='button'
                  onClick={() => setActiveSlug(course.slug)}
                  className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-[#0E2F5E] text-white shadow-md"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className='flex items-center justify-between gap-2'>
                    <span className='truncate text-sm font-bold'>{course.title}</span>
                    {!course.isPublished && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                          selected
                            ? "bg-white/15 text-white/80"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Draft
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-[11px] ${
                      selected ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {course.slug}
                  </span>
                </button>
              );
            })}

            {allCourses.length === 0 && (
              <p className='rounded-2xl bg-slate-50 px-3 py-4 text-xs leading-5 text-slate-500'>
                No courses yet. Create the first one above.
              </p>
            )}
          </div>
        </div>

        {showCreate && (
          <NewCourseForm
            onCreated={(course) => {
              setCreated((previous) => [...previous, course]);
              setActiveSlug(course.slug);
              setShowCreate(false);
              router.refresh();
            }}
          />
        )}

        <div className='rounded-3xl border border-slate-200 bg-slate-50/80 p-4'>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-slate-500'>
            How it works
          </p>
          <ul className='mt-3 space-y-2.5 text-xs leading-5 text-slate-600'>
            <li>Drag a block type into a section, or click it to append.</li>
            <li>Drag blocks to reorder them. Arrow buttons work on mobile.</li>
            <li>New courses open at /courses/&lt;slug&gt; once saved.</li>
            <li>
              Question banks still come from{" "}
              <span className='font-semibold text-slate-800'>Content sync</span>,
              not this editor.
            </li>
          </ul>
        </div>
      </aside>

      <div className='min-w-0'>
        {active ? (
          <CourseEditor
            key={active.slug}
            course={active}
            initialSections={pages[active.slug] ?? []}
          />
        ) : (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center'>
            <p className='text-lg font-black text-slate-900'>Start with a course</p>
            <p className='mt-2 text-sm text-slate-600'>
              Create a course, then build its sections and content blocks here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NewCourseForm({ onCreated }: { onCreated: (course: StudioCourse) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [track, setTrack] = useState("Exam track");
  const [level, setLevel] = useState("Foundation");
  const [hours, setHours] = useState(12);
  const [accentFrom, setAccentFrom] = useState("#2660A4");
  const [accentTo, setAccentTo] = useState("#26a465");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await createCourse({
      title,
      summary,
      track,
      level,
      estimatedHours: Number(hours),
      accentFrom,
      accentTo,
    });

    setPending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    onCreated(result.course);
  };

  return (
    <form
      onSubmit={submit}
      className='space-y-3 rounded-3xl border border-[#2660A4]/20 bg-white p-4 shadow-sm'
    >
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#2660A4]'>
          New course
        </p>
        <p className='mt-1 text-xs leading-5 text-slate-500'>
          A slug and studio page URL are created automatically.
        </p>
      </div>

      <div>
        <label className={LABEL} htmlFor='new-course-title'>
          Title
        </label>
        <input
          id='new-course-title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='e.g. Power BI Advanced DAX'
          className={INPUT}
          required
          minLength={3}
          maxLength={120}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor='new-course-summary'>
          Summary
        </label>
        <textarea
          id='new-course-summary'
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={3}
          placeholder='One or two lines for the catalogue card.'
          className={`${INPUT} resize-y`}
          maxLength={500}
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className={LABEL} htmlFor='new-course-track'>
            Track
          </label>
          <input
            id='new-course-track'
            value={track}
            onChange={(event) => setTrack(event.target.value)}
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor='new-course-level'>
            Level
          </label>
          <input
            id='new-course-level'
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className={INPUT}
          />
        </div>
      </div>

      <div className='grid grid-cols-[1fr_auto_auto] items-end gap-2'>
        <div>
          <label className={LABEL} htmlFor='new-course-hours'>
            Hours
          </label>
          <input
            id='new-course-hours'
            type='number'
            min={1}
            max={200}
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor='new-course-from'>
            From
          </label>
          <input
            id='new-course-from'
            type='color'
            value={accentFrom}
            onChange={(event) => setAccentFrom(event.target.value)}
            className='h-10 w-12 cursor-pointer rounded-lg! border border-slate-200 bg-white! p-1!'
          />
        </div>
        <div>
          <label className={LABEL} htmlFor='new-course-to'>
            To
          </label>
          <input
            id='new-course-to'
            type='color'
            value={accentTo}
            onChange={(event) => setAccentTo(event.target.value)}
            className='h-10 w-12 cursor-pointer rounded-lg! border border-slate-200 bg-white! p-1!'
          />
        </div>
      </div>

      {error && (
        <p className='flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700'>
          <MdErrorOutline size={15} className='mt-0.5 shrink-0' /> {error}
        </p>
      )}

      <button
        type='submit'
        disabled={pending}
        className='w-full! rounded-full! bg-[#2660A4]! px-4! py-2.5! text-sm! font-bold! text-white! transition hover:bg-[#1f4f8d]! disabled:opacity-60'
      >
        {pending ? "Creating…" : "Create course"}
      </button>
    </form>
  );
}

function CourseEditor({
  course,
  initialSections,
}: {
  course: StudioCourse;
  initialSections: CourseSection[];
}) {
  const router = useRouter();
  const [meta, setMeta] = useState<EditorMeta>(() => metaFromCourse(course));
  const [sections, setSections] = useState<CourseSection[]>(() =>
    structuredClone(initialSections),
  );
  const [baseline, setBaseline] = useState(() =>
    JSON.stringify({ meta: metaFromCourse(course), sections: initialSections }),
  );
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [uploadingBlock, setUploadingBlock] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dirty =
    JSON.stringify({ meta, sections }) !== baseline;

  const studioHref = `/courses/${course.slug}`;

  const updateSection = (sectionId: string, patch: Partial<CourseSection>) => {
    setSections((previous) =>
      previous.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    );
  };

  const updateBlock = (
    sectionId: string,
    blockId: string,
    patch: Partial<ContentBlock>,
  ) => {
    setSections((previous) =>
      previous.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              blocks: section.blocks.map((block) =>
                block.id === blockId ? { ...block, ...patch } : block,
              ),
            }
          : section,
      ),
    );
  };

  const addBlock = (
    sectionId: string,
    type: ContentBlockType,
    index?: number,
  ) => {
    setSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) return section;

        const blocks = [...section.blocks];
        const at =
          index === undefined
            ? blocks.length
            : Math.max(0, Math.min(index, blocks.length));

        blocks.splice(at, 0, emptyBlock(type));

        return { ...section, blocks };
      }),
    );
  };

  const addBlockToLastSection = (type: ContentBlockType) => {
    if (sections.length === 0) {
      const first = emptySection(0);
      first.blocks.push(emptyBlock(type));
      setSections([first]);
      return;
    }

    addBlock(sections[sections.length - 1].id, type);
  };

  const removeBlock = (sectionId: string, blockId: string) => {
    setSections((previous) =>
      previous.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              blocks: section.blocks.filter((block) => block.id !== blockId),
            }
          : section,
      ),
    );
  };

  const moveBlockByButton = (
    sectionId: string,
    blockId: string,
    direction: -1 | 1,
  ) => {
    setSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) return section;

        const index = section.blocks.findIndex((block) => block.id === blockId);
        const target = index + direction;

        if (index < 0 || target < 0 || target >= section.blocks.length) {
          return section;
        }

        const blocks = [...section.blocks];
        const [block] = blocks.splice(index, 1);
        blocks.splice(target, 0, block);

        return { ...section, blocks };
      }),
    );
  };

  const moveBlock = (
    sourceSectionId: string,
    blockId: string,
    targetSectionId: string,
    targetIndex: number,
  ) => {
    setSections((previous) => {
      const source = previous.find((section) => section.id === sourceSectionId);
      const sourceIndex = source?.blocks.findIndex((block) => block.id === blockId) ?? -1;

      if (!source || sourceIndex < 0) return previous;

      const block = source.blocks[sourceIndex];
      const next = previous.map((section) => ({
        ...section,
        blocks: [...section.blocks],
      }));

      const sourceNext = next.find((section) => section.id === sourceSectionId);
      sourceNext?.blocks.splice(sourceIndex, 1);

      const target = next.find((section) => section.id === targetSectionId);
      if (!target) return previous;

      const insertAt =
        sourceSectionId === targetSectionId && sourceIndex < targetIndex
          ? targetIndex - 1
          : targetIndex;

      target.blocks.splice(
        Math.max(0, Math.min(insertAt, target.blocks.length)),
        0,
        block,
      );

      return next;
    });
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    sectionId: string,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);

    const type = event.dataTransfer.getData(PALETTE_MIME) as ContentBlockType;

    if (type && CONTENT_BLOCK_TYPES.includes(type)) {
      addBlock(sectionId, type, index);
      return;
    }

    const raw = event.dataTransfer.getData(BLOCK_MIME);

    if (!raw) return;

    try {
      const payload = JSON.parse(raw) as {
        sectionId?: string;
        blockId?: string;
      };

      if (payload.sectionId && payload.blockId) {
        moveBlock(payload.sectionId, payload.blockId, sectionId, index);
      }
    } catch {
      // Ignore malformed drag payloads from other apps.
    }
  };

  const uploadImage = async (
    sectionId: string,
    block: ContentBlock,
    file: File,
  ) => {
    setUploadError(null);
    setUploadingBlock(block.id);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/course-assets", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok || !data.url) {
        throw new Error(data?.error ?? "Upload failed.");
      }

      updateBlock(sectionId, block.id, { url: data.url });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not upload that image.",
      );
    } finally {
      setUploadingBlock(null);
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);

    const metaResult = await updateCourse({
      id: course.id,
      title: meta.title,
      summary: meta.summary,
      track: meta.track,
      level: meta.level,
      estimatedHours: Number(meta.estimatedHours),
      accentFrom: meta.accentFrom,
      accentTo: meta.accentTo,
      href: meta.href,
      isPublished: meta.isPublished,
    });

    if (!metaResult.ok) {
      setSaving(false);
      setStatus({ tone: "error", text: metaResult.message });
      return;
    }

    const pageResult = await saveCoursePage(course.slug, sections);

    setSaving(false);

    if (!pageResult.ok) {
      setStatus({ tone: "error", text: pageResult.message });
      return;
    }

    setBaseline(JSON.stringify({ meta, sections }));
    setStatus({ tone: "ok", text: "Saved. The live page is up to date." });
    router.refresh();
  };

  return (
    <div className='space-y-5'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='rounded-full bg-[#0E2F5E]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0E2F5E]'>
                {course.slug}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                  meta.isPublished
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {meta.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <h2 className='mt-2 text-2xl font-black tracking-tight text-slate-900'>
              {meta.title || "Untitled course"}
            </h2>
            <p className='mt-1 text-sm text-slate-500'>
              {sections.length} sections · {sections.reduce((total, section) => total + section.blocks.length, 0)} blocks
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <div className='flex rounded-full border border-slate-200 bg-slate-50 p-1'>
              <button
                type='button'
                onClick={() => setTab("edit")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  tab === "edit"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MdEdit size={13} /> Edit
              </button>
              <button
                type='button'
                onClick={() => setTab("preview")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  tab === "preview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MdVisibility size={13} /> Preview
              </button>
            </div>

            <Link
              href={meta.href}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50'
            >
              Open page <MdOutlineOpenInNew size={13} />
            </Link>

            <button
              type='button'
              onClick={save}
              disabled={saving || !dirty}
              className='inline-flex items-center gap-1.5 rounded-full bg-[#2660A4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f4f8d] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <MdSave size={14} />
              {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>

        {status && (
          <p
            className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs ${
              status.tone === "ok"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.tone === "ok" ? (
              <MdCheckCircle size={15} className='mt-0.5 shrink-0' />
            ) : (
              <MdErrorOutline size={15} className='mt-0.5 shrink-0' />
            )}
            {status.text}
          </p>
        )}
      </div>

      {tab === "edit" ? (
        <>
          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-slate-500'>
              Catalogue details
            </p>

            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <div className='sm:col-span-2'>
                <label className={LABEL} htmlFor='course-title'>
                  Title
                </label>
                <input
                  id='course-title'
                  value={meta.title}
                  onChange={(event) =>
                    setMeta((previous) => ({ ...previous, title: event.target.value }))
                  }
                  className={INPUT}
                />
              </div>
              <div className='sm:col-span-2'>
                <label className={LABEL} htmlFor='course-summary'>
                  Summary
                </label>
                <textarea
                  id='course-summary'
                  value={meta.summary}
                  onChange={(event) =>
                    setMeta((previous) => ({ ...previous, summary: event.target.value }))
                  }
                  rows={3}
                  className={`${INPUT} resize-y`}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor='course-track'>
                  Track label
                </label>
                <input
                  id='course-track'
                  value={meta.track}
                  onChange={(event) =>
                    setMeta((previous) => ({ ...previous, track: event.target.value }))
                  }
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor='course-level'>
                  Level
                </label>
                <input
                  id='course-level'
                  value={meta.level}
                  onChange={(event) =>
                    setMeta((previous) => ({ ...previous, level: event.target.value }))
                  }
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor='course-hours'>
                  Estimated hours
                </label>
                <input
                  id='course-hours'
                  type='number'
                  min={1}
                  max={200}
                  value={meta.estimatedHours}
                  onChange={(event) =>
                    setMeta((previous) => ({
                      ...previous,
                      estimatedHours: Number(event.target.value),
                    }))
                  }
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor='course-href'>
                  Page URL
                </label>
                <input
                  id='course-href'
                  value={meta.href}
                  onChange={(event) =>
                    setMeta((previous) => ({ ...previous, href: event.target.value }))
                  }
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor='course-from'>
                  Gradient from
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    id='course-from'
                    type='color'
                    value={meta.accentFrom}
                    onChange={(event) =>
                      setMeta((previous) => ({
                        ...previous,
                        accentFrom: event.target.value,
                      }))
                    }
                    className='h-10 w-12 cursor-pointer rounded-lg! border border-slate-200 bg-white! p-1!'
                  />
                  <input
                    value={meta.accentFrom}
                    onChange={(event) =>
                      setMeta((previous) => ({
                        ...previous,
                        accentFrom: event.target.value,
                      }))
                    }
                    className={INPUT}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL} htmlFor='course-to'>
                  Gradient to
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    id='course-to'
                    type='color'
                    value={meta.accentTo}
                    onChange={(event) =>
                      setMeta((previous) => ({
                        ...previous,
                        accentTo: event.target.value,
                      }))
                    }
                    className='h-10 w-12 cursor-pointer rounded-lg! border border-slate-200 bg-white! p-1!'
                  />
                  <input
                    value={meta.accentTo}
                    onChange={(event) =>
                      setMeta((previous) => ({
                        ...previous,
                        accentTo: event.target.value,
                      }))
                    }
                    className={INPUT}
                  />
                </div>
              </div>
            </div>

            <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4'>
              <label className='flex items-center gap-2 text-sm font-semibold text-slate-700'>
                <input
                  type='checkbox'
                  checked={meta.isPublished}
                  onChange={(event) =>
                    setMeta((previous) => ({
                      ...previous,
                      isPublished: event.target.checked,
                    }))
                  }
                  className='h-4! w-4! p-0! accent-[#2660A4]'
                />
                Published in the catalogue
              </label>

              {meta.href !== studioHref && (
                <button
                  type='button'
                  onClick={() =>
                    setMeta((previous) => ({ ...previous, href: studioHref }))
                  }
                  className='rounded-full border border-[#2660A4]/30 bg-[#2660A4]/5 px-3 py-1.5 text-xs font-bold text-[#2660A4] transition hover:bg-[#2660A4]/10'
                >
                  Point this course at its studio page
                </button>
              )}
            </div>
          </div>

          <div className='sticky top-20 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg shadow-slate-200/50 backdrop-blur'>
            <div className='flex items-center justify-between gap-2 px-1 pb-2'>
              <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500'>
                Content blocks — drag or click to add
              </p>
              <span className='hidden text-[10px] text-slate-400 sm:block'>
                {sections.length === 0 ? "A section is created for you" : "Appends to the last section"}
              </span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {CONTENT_BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  type='button'
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(PALETTE_MIME, type);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => addBlockToLastSection(type)}
                  className='inline-flex cursor-grab items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-[#2660A4]/30 hover:bg-[#2660A4]/5 hover:text-[#2660A4] active:cursor-grabbing'
                >
                  <span className='text-[#2660A4]'>{BLOCK_ICONS[type]}</span>
                  {BLOCK_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {sections.length === 0 && (
            <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center'>
              <p className='text-lg font-black text-slate-900'>Build the first section</p>
              <p className='mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600'>
                Drag a block from the palette above or click one, then give the
                section a title. You can add as many sections as the track needs.
              </p>
              <button
                type='button'
                onClick={() => setSections([emptySection(0)])}
                className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#0E2F5E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173f73]'
              >
                <MdAdd size={16} /> Add a section
              </button>
            </div>
          )}

          <div className='space-y-5'>
            {sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(`section:${section.id}`);
                }}
                onDrop={(event) => handleDrop(event, section.id, section.blocks.length)}
              >
                <div className='flex items-start gap-3'>
                  <span className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white'>
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>

                  <div className='min-w-0 flex-1 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <label className={LABEL}>Section title</label>
                      <input
                        value={section.title}
                        onChange={(event) =>
                          updateSection(section.id, { title: event.target.value })
                        }
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label className={LABEL}>Intro (optional)</label>
                      <input
                        value={section.intro ?? ""}
                        onChange={(event) =>
                          updateSection(section.id, { intro: event.target.value })
                        }
                        className={INPUT}
                        placeholder='A short lead-in for this section'
                      />
                    </div>
                  </div>

                  <div className='flex shrink-0 items-center gap-1'>
                    <button
                      type='button'
                      onClick={() => {
                        setSections((previous) => {
                          if (sectionIndex === 0) return previous;
                          const next = [...previous];
                          const [item] = next.splice(sectionIndex, 1);
                          next.splice(sectionIndex - 1, 0, item);
                          return next;
                        });
                      }}
                      className='rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
                      aria-label='Move section up'
                    >
                      <MdOutlineArrowUpward size={15} />
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setSections((previous) => {
                          if (sectionIndex >= previous.length - 1) return previous;
                          const next = [...previous];
                          const [item] = next.splice(sectionIndex, 1);
                          next.splice(sectionIndex + 1, 0, item);
                          return next;
                        });
                      }}
                      className='rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
                      aria-label='Move section down'
                    >
                      <MdOutlineArrowDownward size={15} />
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Delete the section “${section.title}” and its blocks?`,
                          )
                        ) {
                          return;
                        }

                        setSections((previous) =>
                          previous.filter((item) => item.id !== section.id),
                        );
                      }}
                      className='rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600'
                      aria-label='Delete section'
                    >
                      <MdDeleteOutline size={16} />
                    </button>
                  </div>
                </div>

                <div className='mt-4 space-y-2'>
                  {section.blocks.map((block, blockIndex) => (
                    <div
                      key={block.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragOver(`${section.id}:${blockIndex}`);
                      }}
                      onDrop={(event) => handleDrop(event, section.id, blockIndex)}
                    >
                      <DropLine
                        active={dragOver === `${section.id}:${blockIndex}`}
                      />
                      <BlockCard
                        sectionId={section.id}
                        block={block}
                        index={blockIndex}
                        total={section.blocks.length}
                        uploading={uploadingBlock === block.id}
                        onChange={(patch) => updateBlock(section.id, block.id, patch)}
                        onRemove={() => removeBlock(section.id, block.id)}
                        onMove={(direction) =>
                          moveBlockByButton(section.id, block.id, direction)
                        }
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            BLOCK_MIME,
                            JSON.stringify({ sectionId: section.id, blockId: block.id }),
                          );
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onUpload={(file) => uploadImage(section.id, block, file)}
                      />
                    </div>
                  ))}

                  <DropLine
                    active={dragOver === `section:${section.id}`}
                    label='Drop here to add to this section'
                  />
                </div>

                <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
                  <select
                    value=''
                    onChange={(event) => {
                      const type = event.target.value as ContentBlockType;
                      if (type) addBlock(section.id, type);
                      event.target.value = "";
                    }}
                    className='w-auto! rounded-xl! border! border-slate-200! bg-white! px-3! py-2! text-xs! font-semibold! text-slate-600!'
                  >
                    <option value=''>+ Add a block…</option>
                    {CONTENT_BLOCK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {BLOCK_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>

                  <span className='text-[10px] font-semibold uppercase tracking-wide text-slate-400'>
                    {section.blocks.length} block{section.blocks.length === 1 ? "" : "s"}
                  </span>
                </div>
              </section>
            ))}
          </div>

          {uploadError && (
            <p className='flex items-start gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-700'>
              <MdErrorOutline size={15} className='mt-0.5 shrink-0' /> {uploadError}
            </p>
          )}

          {sections.length > 0 && (
            <button
              type='button'
              onClick={() => setSections((previous) => [...previous, emptySection(previous.length)])}
              className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-600 transition hover:border-[#2660A4]/40 hover:bg-[#2660A4]/5 hover:text-[#2660A4]'
            >
              <MdAdd size={17} /> Add another section
            </button>
          )}
        </>
      ) : (
        <div className='rounded-[28px] border border-slate-200 bg-slate-50/60 p-4 sm:p-6'>
          <p className='mb-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500'>
            Live preview — unsaved changes included
          </p>
          {sections.length > 0 ? (
            <CourseSections sections={sections} />
          ) : (
            <p className='rounded-2xl bg-white px-5 py-8 text-center text-sm text-slate-500'>
              Add a section to see the page preview.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DropLine({ active, label }: { active?: boolean; label?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg transition-all ${
        active ? "my-1 h-8 bg-[#2660A4]/10 px-2" : "h-1"
      }`}
    >
      {active && (
        <>
          <span className='h-0.5 flex-1 rounded-full bg-[#2660A4]' />
          {label && (
            <span className='text-[9px] font-bold uppercase tracking-wide text-[#2660A4]'>
              {label}
            </span>
          )}
          <span className='h-0.5 flex-1 rounded-full bg-[#2660A4]' />
        </>
      )}
    </div>
  );
}

function BlockCard({
  sectionId: _sectionId,
  block,
  index,
  total,
  uploading,
  onChange,
  onRemove,
  onMove,
  onDragStart,
  onUpload,
}: {
  sectionId: string;
  block: ContentBlock;
  index: number;
  total: number;
  uploading: boolean;
  onChange: (patch: Partial<ContentBlock>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  onUpload: (file: File) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50/50'>
      <div className='flex items-center gap-2 px-3 py-2'>
        <span
          draggable
          onDragStart={onDragStart}
          className='cursor-grab text-slate-300 active:cursor-grabbing'
          title='Drag to reorder'
        >
          <MdOutlineDragIndicator size={18} />
        </span>
        <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#2660A4] shadow-sm'>
          {BLOCK_ICONS[block.type]}
        </span>
        <button
          type='button'
          onClick={() => setExpanded((value) => !value)}
          className='flex-1 text-left text-xs font-bold text-slate-700'
        >
          {BLOCK_TYPE_LABELS[block.type]}
          <span className='ml-2 font-normal text-slate-400'>
            {block.type === "heading"
              ? block.text
              : block.type === "paragraph"
                ? block.text?.slice(0, 46)
                : block.title || block.label || ""}
          </span>
        </button>
        <button
          type='button'
          onClick={() => onMove(-1)}
          disabled={index === 0}
          className='rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-30'
          aria-label='Move block up'
        >
          <MdOutlineArrowUpward size={14} />
        </button>
        <button
          type='button'
          onClick={() => onMove(1)}
          disabled={index >= total - 1}
          className='rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-30'
          aria-label='Move block down'
        >
          <MdOutlineArrowDownward size={14} />
        </button>
        <button
          type='button'
          onClick={onRemove}
          className='rounded-md p-1 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600'
          aria-label='Delete block'
        >
          <MdDeleteOutline size={15} />
        </button>
      </div>

      {expanded && (
        <div className='space-y-3 border-t border-slate-200/70 px-3 py-3'>
          <BlockFields
            block={block}
            onChange={onChange}
            uploading={uploading}
            onUpload={onUpload}
          />
        </div>
      )}
    </div>
  );
}

function BlockFields({
  block,
  onChange,
  uploading,
  onUpload,
}: {
  block: ContentBlock;
  onChange: (patch: Partial<ContentBlock>) => void;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className='grid gap-2 sm:grid-cols-[1fr_140px]'>
          <div>
            <label className={LABEL}>Heading text</label>
            <input
              value={block.text ?? ""}
              onChange={(event) => onChange({ text: event.target.value })}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Size</label>
            <select
              value={block.level ?? 2}
              onChange={(event) =>
                onChange({ level: Number(event.target.value) as 2 | 3 | 4 })
              }
              className={INPUT}
            >
              <option value={2}>Large</option>
              <option value={3}>Medium</option>
              <option value={4}>Small</option>
            </select>
          </div>
        </div>
      );

    case "paragraph":
      return (
        <div>
          <label className={LABEL}>Body</label>
          <textarea
            value={block.text ?? ""}
            onChange={(event) => onChange({ text: event.target.value })}
            rows={5}
            className={`${INPUT} resize-y`}
            placeholder='Blank lines create new paragraphs.'
          />
        </div>
      );

    case "image":
      return (
        <>
          <div>
            <label className={LABEL}>Image URL</label>
            <input
              value={block.url ?? ""}
              onChange={(event) => onChange({ url: event.target.value })}
              className={INPUT}
              placeholder='https://… or upload below'
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <label className='inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#2660A4]/30 bg-[#2660A4]/5 px-3 py-1.5 text-xs font-bold text-[#2660A4] transition hover:bg-[#2660A4]/10'>
              <MdOutlineAddPhotoAlternate size={15} />
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type='file'
                accept='image/jpeg,image/png,image/webp,image/gif,image/avif'
                className='hidden'
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onUpload(file);
                  event.target.value = "";
                }}
              />
            </label>
            <span className='text-[10px] text-slate-400'>JPG, PNG, WebP, GIF, AVIF · 8MB</span>
          </div>
          {block.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url}
              alt={block.alt ?? ""}
              className='max-h-40 w-full rounded-xl border border-slate-200 object-cover'
            />
          )}
          <div className='grid gap-2 sm:grid-cols-2'>
            <div>
              <label className={LABEL}>Alt text</label>
              <input
                value={block.alt ?? ""}
                onChange={(event) => onChange({ alt: event.target.value })}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Caption</label>
              <input
                value={block.caption ?? ""}
                onChange={(event) => onChange({ caption: event.target.value })}
                className={INPUT}
              />
            </div>
          </div>
        </>
      );

    case "video":
      return (
        <>
          <div>
            <label className={LABEL}>Video URL</label>
            <input
              value={block.url ?? ""}
              onChange={(event) => onChange({ url: event.target.value })}
              className={INPUT}
              placeholder='YouTube, Vimeo, or an .mp4 link'
            />
          </div>
          <div>
            <label className={LABEL}>Title (optional)</label>
            <input
              value={block.title ?? ""}
              onChange={(event) => onChange({ title: event.target.value })}
              className={INPUT}
            />
          </div>
        </>
      );

    case "video_link":
      return (
        <>
          <div>
            <label className={LABEL}>Video link</label>
            <input
              value={block.url ?? ""}
              onChange={(event) => onChange({ url: event.target.value })}
              className={INPUT}
              placeholder='https://youtube.com/…'
            />
          </div>
          <div className='grid gap-2 sm:grid-cols-2'>
            <div>
              <label className={LABEL}>Link title</label>
              <input
                value={block.title ?? ""}
                onChange={(event) => onChange({ title: event.target.value })}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <input
                value={block.description ?? ""}
                onChange={(event) => onChange({ description: event.target.value })}
                className={INPUT}
              />
            </div>
          </div>
        </>
      );

    case "code":
      return (
        <>
          <div className='grid gap-2 sm:grid-cols-[1fr_160px]'>
            <div>
              <label className={LABEL}>Language label</label>
              <input
                value={block.language ?? ""}
                onChange={(event) => onChange({ language: event.target.value })}
                className={INPUT}
                placeholder='sql, python, text…'
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Code</label>
            <textarea
              value={block.text ?? ""}
              onChange={(event) => onChange({ text: event.target.value })}
              rows={8}
              className={`${INPUT} resize-y font-mono!`}
              spellCheck={false}
            />
          </div>
        </>
      );

    case "callout":
      return (
        <>
          <div className='grid gap-2 sm:grid-cols-[160px_1fr]'>
            <div>
              <label className={LABEL}>Tone</label>
              <select
                value={block.tone ?? "tip"}
                onChange={(event) =>
                  onChange({ tone: event.target.value as "info" | "tip" | "warning" })
                }
                className={INPUT}
              >
                <option value='tip'>Tip</option>
                <option value='info'>Information</option>
                <option value='warning'>Warning</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <input
                value={block.title ?? ""}
                onChange={(event) => onChange({ title: event.target.value })}
                className={INPUT}
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Callout text</label>
            <textarea
              value={block.text ?? ""}
              onChange={(event) => onChange({ text: event.target.value })}
              rows={3}
              className={`${INPUT} resize-y`}
            />
          </div>
        </>
      );

    case "quote":
      return (
        <>
          <div>
            <label className={LABEL}>Quote</label>
            <textarea
              value={block.text ?? ""}
              onChange={(event) => onChange({ text: event.target.value })}
              rows={3}
              className={`${INPUT} resize-y`}
            />
          </div>
          <div>
            <label className={LABEL}>Attribution</label>
            <input
              value={block.attribution ?? ""}
              onChange={(event) => onChange({ attribution: event.target.value })}
              className={INPUT}
              placeholder='e.g. ITIL 4 Foundation syllabus'
            />
          </div>
        </>
      );

    case "list":
      return (
        <>
          <label className='flex items-center gap-2 text-xs font-semibold text-slate-600'>
            <input
              type='checkbox'
              checked={Boolean(block.ordered)}
              onChange={(event) => onChange({ ordered: event.target.checked })}
              className='h-4! w-4! p-0! accent-[#2660A4]'
            />
            Numbered list
          </label>
          <div>
            <label className={LABEL}>Items — one per line</label>
            <textarea
              value={(block.items ?? []).join("\n")}
              onChange={(event) =>
                onChange({
                  items: event.target.value.split("\n").slice(0, 40),
                })
              }
              rows={5}
              className={`${INPUT} resize-y`}
            />
          </div>
        </>
      );

    case "link":
    case "file":
      return (
        <>
          <div className='grid gap-2 sm:grid-cols-2'>
            <div>
              <label className={LABEL}>
                {block.type === "file" ? "Download label" : "Button label"}
              </label>
              <input
                value={block.label ?? ""}
                onChange={(event) => onChange({ label: event.target.value })}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>URL</label>
              <input
                value={block.url ?? ""}
                onChange={(event) => onChange({ url: event.target.value })}
                className={INPUT}
                placeholder='https://…'
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <input
              value={block.description ?? ""}
              onChange={(event) => onChange({ description: event.target.value })}
              className={INPUT}
            />
          </div>
        </>
      );

    case "divider":
      return (
        <p className='rounded-lg bg-white px-3 py-2 text-xs text-slate-500'>
          A horizontal rule. No settings.
        </p>
      );

    default:
      return null;
  }
}
