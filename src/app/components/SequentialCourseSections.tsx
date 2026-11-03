"use client";

import { useCallback, useState } from "react";
import {
  MdCheckCircle,
  MdLockOutline,
  MdOutlineMenuBook,
} from "react-icons/md";
import { CourseSectionCard } from "./CourseSections";
import type { CourseSection } from "@/types/cms";

type Props = {
  courseSlug: string;
  sections: CourseSection[];
  accentHex: string;
  completed: string[];
  progress: number;
  enrolled: boolean;
};

/**
 * A studio course opens one section at a time: a section stays locked until
 * the learner marks the one before it complete. Each completion is what the
 * server counts towards the recap share of the track's progress.
 */
export default function SequentialCourseSections({
  courseSlug,
  sections,
  accentHex,
  completed,
  progress,
  enrolled,
}: Props) {
  const [done, setDone] = useState<Set<string>>(() => new Set(completed));
  const [percent, setPercent] = useState(progress);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(
    async (sectionId: string) => {
      if (pendingId) return;

      setPendingId(sectionId);
      setError(null);

      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug, lessonId: sectionId }),
        });
        const data = (await response.json().catch(() => null)) as {
          error?: string;
          progress?: number;
        } | null;

        if (!response.ok) {
          setError(data?.error ?? "Could not save that section. Try again.");
          return;
        }

        setDone((previous) => new Set(previous).add(sectionId));

        if (typeof data?.progress === "number") {
          setPercent(data.progress);
        }
      } catch {
        setError("Could not save that section. Check your connection.");
      } finally {
        setPendingId(null);
      }
    },
    [courseSlug, pendingId],
  );

  if (sections.length === 0) {
    return (
      <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center'>
        <p className='text-lg font-black text-slate-900'>
          This track is being written
        </p>
        <p className='mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600'>
          An administrator has published the course but has not added its
          sections yet. Check back soon.
        </p>
      </div>
    );
  }

  const completedCount = sections.filter((section) => done.has(section.id)).length;
  const allDone = completedCount === sections.length;

  return (
    <div className='space-y-6'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-sm font-black text-slate-900'>
            <MdOutlineMenuBook size={18} style={{ color: accentHex }} />
            Your progress
          </div>
          <span className='text-sm font-bold text-slate-600'>
            {completedCount}/{sections.length} sections · {percent}%
          </span>
        </div>

        <div className='mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100'>
          <div
            className='h-full rounded-full transition-all duration-500'
            style={{
              width: `${Math.min(100, Math.max(0, percent))}%`,
              backgroundColor: accentHex,
            }}
          />
        </div>

        <p className='mt-3 text-xs leading-6 text-slate-500'>
          {allDone
            ? "Every section is complete. Your assessment results now add to this track."
            : "Finish a section to unlock the next one. Sections count towards 40% of this track; assessments make up the rest."}
        </p>

        {error && (
          <p className='mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-700'>
            {error}
          </p>
        )}

        {!enrolled && (
          <p className='mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800'>
            Reserve a seat on this track to record your progress.
          </p>
        )}
      </div>

      <div className='space-y-6'>
        {sections.map((section, index) => {
          const isDone = done.has(section.id);
          const previous = index === 0 ? null : sections[index - 1];
          const locked = previous ? !done.has(previous.id) : false;

          if (locked && previous) {
            return (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className='scroll-mt-28 rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 sm:p-8'
              >
                <div className='flex items-start gap-4'>
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-sm font-black text-white'>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <MdLockOutline size={16} className='text-slate-400' />
                      <h2 className='text-xl font-black tracking-tight text-slate-500'>
                        {section.title}
                      </h2>
                    </div>
                    <p className='mt-2 max-w-xl text-sm leading-7 text-slate-500'>
                      Finish “{previous.title}” to unlock this section.
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <CourseSectionCard
              key={section.id}
              section={section}
              index={index}
              footer={
                isDone ? (
                  <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3'>
                    <span className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700'>
                      <MdCheckCircle size={17} /> Section completed
                    </span>
                    <span className='text-xs font-semibold text-emerald-700/80'>
                      {index + 1 < sections.length
                        ? "The next section is unlocked."
                        : "You have reached the end of this track."}
                    </span>
                  </div>
                ) : (
                  <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                    <p className='text-xs leading-5 text-slate-600'>
                      Read the section, then mark it completed to unlock the
                      next one.
                    </p>
                    <button
                      type='button'
                      onClick={() => complete(section.id)}
                      disabled={pendingId !== null || !enrolled}
                      className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'
                      style={{ backgroundColor: accentHex }}
                    >
                      <MdCheckCircle size={16} />
                      {pendingId === section.id
                        ? "Saving…"
                        : "Mark section complete"}
                    </button>
                  </div>
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}
