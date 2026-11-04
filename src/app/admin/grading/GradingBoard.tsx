"use client";

import { useMemo, useState } from "react";
import {
  MdOutlineFileDownload,
  MdOutlineFilterAlt,
  MdOutlineGrading,
  MdOutlineReply,
} from "react-icons/md";
import AdminGradeSubmission from "../AdminGradeSubmission";
import { storedFileName } from "@/lib/storage";

export type GradingSubmission = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  file_path: string;
  course_slug: string | null;
  task_name: string | null;
  status: string;
  score: number | null;
  graded_at: string | null;
  created_at: string;
};

const PASS_MARK = 70;

type StatusKey = "pending" | "graded";
type OutcomeKey = "passed" | "below";
type Filters = {
  status: StatusKey[];
  outcome: OutcomeKey[];
  tracks: string[];
};

const EMPTY_FILTERS: Filters = { status: [], outcome: [], tracks: [] };

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function Checkbox({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count: number;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition ${
        checked
          ? "bg-slate-100 font-bold text-slate-900"
          : "font-semibold text-slate-600 hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-slate-900"
      />
      <span className="flex-1">{label}</span>
      <span className="text-[11px] font-bold text-slate-400">{count}</span>
    </label>
  );
}

export default function GradingBoard({
  submissions,
  courseTitles,
}: {
  submissions: GradingSubmission[];
  courseTitles: Record<string, string>;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const trackLabel = (slug: string | null) =>
    (slug ? courseTitles[slug] : null) ?? slug ?? "Practical assessment";

  // Counts are computed against the current dataset so each box shows how many
  // submissions it would surface, before the other filters are applied.
  const counts = useMemo(() => {
    const status = { pending: 0, graded: 0 };
    const outcome = { passed: 0, below: 0 };

    for (const submission of submissions) {
      if (submission.status === "graded") status.graded += 1;
      else status.pending += 1;

      if (submission.status === "graded" && submission.score !== null) {
        if (Number(submission.score) >= PASS_MARK) outcome.passed += 1;
        else outcome.below += 1;
      }
    }

    return { status, outcome };
  }, [submissions]);

  const tracks = useMemo(() => {
    const seen = new Map<string, string>();

    for (const submission of submissions) {
      const key = submission.course_slug ?? "";
      if (!seen.has(key)) seen.set(key, trackLabel(submission.course_slug));
    }

    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [submissions]); // eslint-disable-line react-hooks/exhaustive-deps

  const trackCounts = useMemo(() => {
    const map = new Map<string, number>();

    for (const submission of submissions) {
      const key = submission.course_slug ?? "";
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return map;
  }, [submissions]);

  const visible = submissions.filter((submission) => {
    const isGraded = submission.status === "graded";
    const score = submission.score === null ? null : Number(submission.score);

    if (filters.status.length > 0) {
      const key: StatusKey = isGraded ? "graded" : "pending";
      if (!filters.status.includes(key)) return false;
    }

    if (filters.outcome.length > 0) {
      // An ungraded submission has no outcome yet, so it cannot match these.
      if (score === null) return false;

      const key: OutcomeKey = score >= PASS_MARK ? "passed" : "below";
      if (!filters.outcome.includes(key)) return false;
    }

    if (
      filters.tracks.length > 0 &&
      !filters.tracks.includes(submission.course_slug ?? "")
    ) {
      return false;
    }

    return true;
  });

  const activeCount =
    filters.status.length + filters.outcome.length + filters.tracks.length;

  return (
    <div className="grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start">
      <aside className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-2 px-1.5">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <MdOutlineFilterAlt size={15} /> Filter
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-[11px] font-bold text-[#2660A4] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 space-y-5">
          <div>
            <p className="px-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Status
            </p>
            <Checkbox
              label="Pending grading"
              count={counts.status.pending}
              checked={filters.status.includes("pending")}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: toggle(prev.status, "pending"),
                }))
              }
            />
            <Checkbox
              label="Graded"
              count={counts.status.graded}
              checked={filters.status.includes("graded")}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: toggle(prev.status, "graded"),
                }))
              }
            />
          </div>

          <div>
            <p className="px-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Outcome
            </p>
            <Checkbox
              label={`Passed · ${PASS_MARK}%+`}
              count={counts.outcome.passed}
              checked={filters.outcome.includes("passed")}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  outcome: toggle(prev.outcome, "passed"),
                }))
              }
            />
            <Checkbox
              label={`Below ${PASS_MARK}%`}
              count={counts.outcome.below}
              checked={filters.outcome.includes("below")}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  outcome: toggle(prev.outcome, "below"),
                }))
              }
            />
          </div>

          {tracks.length > 1 && (
            <div>
              <p className="px-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Track
              </p>
              {tracks.map(([key, label]) => (
                <Checkbox
                  key={key || "unspecified"}
                  label={label}
                  count={trackCounts.get(key) ?? 0}
                  checked={filters.tracks.includes(key)}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      tracks: toggle(prev.tracks, key),
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
          Showing {visible.length} of {submissions.length} submissions. Boxes
          inside a group combine; groups stack.
        </p>
      </aside>

      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((submission) => {
          const isGraded = submission.status === "graded";
          const hasStoredFile = submission.file_path.includes("/");
          const trackTitle = trackLabel(submission.course_slug);

          return (
            <article
              key={submission.id}
              className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {trackTitle}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-slate-900">
                    {submission.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">{submission.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isGraded
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isGraded
                    ? `Graded · ${Math.round(Number(submission.score))}%`
                    : "Pending Grading"}
                </span>
              </div>

              <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-slate-800">Track:</span>{" "}
                  {trackTitle}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Task:</span>{" "}
                  {submission.task_name ?? "Not specified"}
                </p>
                <p className="min-w-0 truncate">
                  <span className="font-semibold text-slate-800">File:</span>{" "}
                  {storedFileName(submission.file_path)}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">
                    Submitted:
                  </span>{" "}
                  {formatDateTime(submission.created_at)}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Graded:</span>{" "}
                  {submission.graded_at
                    ? formatDateTime(submission.graded_at)
                    : "Waiting"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {hasStoredFile ? (
                    <a
                      href={`/api/admin/submissions/${submission.id}/download`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#2660A4]/30 bg-[#2660A4]/5 px-3 py-1.5 text-xs font-semibold text-[#2660A4] transition hover:bg-[#2660A4]/10"
                    >
                      <MdOutlineFileDownload size={14} /> Download file
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-400">
                      <MdOutlineFileDownload size={14} /> File unavailable
                    </span>
                  )}
                  <a
                    href={`mailto:${encodeURIComponent(submission.email)}?subject=${encodeURIComponent(
                      "Your practical assessment",
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <MdOutlineReply size={13} /> Contact learner
                  </a>
                </div>
                <AdminGradeSubmission
                  submissionId={submission.id}
                  score={
                    submission.score === null ? null : Number(submission.score)
                  }
                  graded={isGraded}
                />
              </div>
            </article>
          );
        })}

        {visible.length === 0 && (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 xl:col-span-2">
            <span className="mb-1 flex items-center gap-2 font-bold text-slate-700">
              <MdOutlineGrading size={16} />
              {submissions.length === 0
                ? "No practical submissions yet"
                : "No submissions match these filters"}
            </span>
            {submissions.length === 0
              ? "They appear here as soon as a learner uploads a workbook."
              : "Untick a box on the left, or clear the filters to see everything again."}
          </p>
        )}
      </div>
    </div>
  );
}
