"use client";

/**
 * Fire-and-forget attempt recording. Never blocks the assessment flow and
 * never throws — a failed write must not cost the learner their result.
 */
export function recordAttempt(input: {
  courseSlug: string;
  mode: string;
  total: number;
  correct: number;
  durationSeconds?: number;
}) {
  if (typeof window === "undefined") return;

  void fetch("/api/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => {
    /* activity tracking is best-effort */
  });
}
