"use client";

import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

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
    signedIn,
    enrolled,
    clearError: () => setError(null),
  };
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
