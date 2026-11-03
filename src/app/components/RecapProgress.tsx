"use client";

import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle, MdLockOutline } from "react-icons/md";

type ProgressResponse = {
  signedIn?: boolean;
  enrolled?: boolean;
  completed?: string[];
  progress?: number;
  total?: number;
};

/**
 * Loads the signed-in learner's completed recaps for one track and exposes
 * a "mark one complete" action. The server owns the percentage calculation;
 * the client only mirrors which recaps are already ticked.
 */
export function useRecapProgress(courseSlug: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [signedIn, setSignedIn] = useState(true);
  const [enrolled, setEnrolled] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/progress?courseSlug=${encodeURIComponent(courseSlug)}`,
          { cache: "no-store" },
        );

        if (!response.ok) return;

        const data = (await response.json()) as ProgressResponse;

        if (cancelled) return;

        setCompleted(new Set(data.completed ?? []));
        setSignedIn(Boolean(data.signedIn));
        setEnrolled(Boolean(data.enrolled));
      } catch {
        /* progress tracking is best-effort until the first interaction */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  const markCompleted = useCallback(
    async (lessonId: string) => {
      if (pendingId) return;

      setPendingId(lessonId);
      setError(null);

      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug, lessonId }),
        });
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        if (!response.ok) {
          setError(
            data?.error ??
              "Could not save that recap. Please check your seat and try again.",
          );
          return;
        }

        setCompleted((previous) => {
          const next = new Set(previous);
          next.add(lessonId);
          return next;
        });
      } catch {
        setError("Could not save that recap. Please try again.");
      } finally {
        setPendingId(null);
      }
    },
    [courseSlug, pendingId],
  );

  return {
    completed,
    markCompleted,
    pendingId,
    error,
    loaded,
    signedIn,
    enrolled,
    clearError: () => setError(null),
  };
}

/**
 * Lessons unlock in order: the first incomplete lesson is the next one to
 * study, and everything after it stays locked. Returns a predicate so each
 * page can render its own locked state.
 */
export function useSequentialUnlock(
  orderedIds: string[],
  completed: Set<string>,
  loaded = true,
) {
  const firstIncomplete = orderedIds.findIndex((id) => !completed.has(id));

  return (id: string) => {
    if (!loaded) return false;

    const index = orderedIds.indexOf(id);
    if (index < 0) return false;

    // Everything is done — keep the whole track open for revision.
    if (firstIncomplete < 0) return false;

    return index > firstIncomplete;
  };
}

/** Placeholder card shown in place of a lesson that is not unlocked yet. */
export function LockedLesson({
  lessonId,
  title,
  accentHex,
}: {
  lessonId: string;
  title: string;
  accentHex: string;
}) {
  return (
    <article
      id={lessonId}
      className='scroll-mt-32 mb-12 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-6'
    >
      <div className='flex items-start gap-3'>
        <span
          className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white'
          style={{ backgroundColor: `${accentHex}66` }}
        >
          <MdLockOutline size={16} />
        </span>
        <div>
          <h3 className='text-lg font-bold text-slate-500'>{title}</h3>
          <p className='mt-1 text-sm leading-6 text-slate-500'>
            Finish the previous lesson and mark it completed to unlock this one.
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Placeholder for a whole section that is not unlocked yet. Sections unlock
 * one at a time, so nothing inside a locked section is rendered.
 */
export function LockedSectionCard({
  title,
  accentHex,
  hint = "Each section unlocks when you mark the one before it completed.",
}: {
  title: string;
  accentHex: string;
  hint?: string;
}) {
  return (
    <div className='mb-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center'>
      <span
        className='mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white'
        style={{ backgroundColor: accentHex }}
      >
        <MdLockOutline size={20} />
      </span>
      <h3 className='mt-4 text-xl font-black text-slate-800'>
        {title} is locked
      </h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600'>
        {hint}
      </p>
    </div>
  );
}

export function RecapCompletionButton({
  completed,
  pending,
  onClick,
  accentHex,
}: {
  completed: boolean;
  pending: boolean;
  onClick: () => void;
  accentHex: string;
}) {
  if (completed) {
    return (
      <span className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
        <MdCheckCircle size={16} />
        Completed
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={pending}
      className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'
      style={{ backgroundColor: accentHex }}
    >
      <MdCheckCircle size={16} />
      {pending ? "Saving…" : "Mark as completed"}
    </button>
  );
}
