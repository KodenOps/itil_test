"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { leaveCourse, resetCourseProgress } from "@/app/actions/enroll";
import { useAppStore } from "@/store/app-store";
import type { Enrollment } from "@/types/app";
import { MdCheckCircle, MdLockOutline } from "react-icons/md";

export default function ProfileCourseList({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  const router = useRouter();
  const { removeEnrollment } = useAppStore();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = async (enrollment: Enrollment) => {
    setPendingId(enrollment.courseId);
    setError(null);

    const result = await leaveCourse(enrollment.courseId);

    if (!result.ok) {
      setError(result.message ?? "Could not leave this course.");
      setPendingId(null);
      return;
    }

    removeEnrollment(enrollment.courseId);
    setPendingId(null);
    router.refresh();
  };

  const handleReset = async (enrollment: Enrollment) => {
    setResettingId(enrollment.courseId);
    setError(null);

    const result = await resetCourseProgress(enrollment.courseId);

    setResettingId(null);

    if (!result.ok) {
      setError(result.message ?? "Could not reset your progress.");
      return;
    }

    router.refresh();
  };

  if (enrollments.length === 0) {
    return (
      <div className='rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center'>
        <p className='text-sm font-semibold text-slate-900'>
          You are not enrolled in any course yet.
        </p>
        <p className='mt-2 text-sm text-slate-600'>
          Pick up to two tracks from the catalogue and they will appear here.
        </p>
        <Link
          href='/'
          className='mt-5 inline-flex rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d]'
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {error && (
        <p className='rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700'>
          {error}
        </p>
      )}

      {enrollments.map((enrollment) => (
        <div
          key={enrollment.id}
          className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'
        >
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: enrollment.accentFrom }}
                />
                <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-500'>
                  {enrollment.status === "active"
                    ? "In progress"
                    : enrollment.status === "completed"
                      ? "Completed track"
                      : enrollment.status}
                </p>
              </div>
              <h3 className='mt-2 text-lg font-black text-slate-900'>
                {enrollment.courseTitle}
              </h3>
              <p className='mt-1 max-w-xl text-sm leading-6 text-slate-600'>
                {enrollment.courseSummary}
              </p>
            </div>

            <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center'>
              <Link
                href={enrollment.courseHref}
                className='inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto'
              >
                Continue
              </Link>
              <button
                type='button'
                onClick={() => handleReset(enrollment)}
                disabled={resettingId === enrollment.courseId}
                className='inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50 sm:w-auto'
              >
                {resettingId === enrollment.courseId
                  ? "Resetting…"
                  : "Reset my progress"}
              </button>
              <button
                type='button'
                onClick={() => handleLeave(enrollment)}
                disabled={pendingId === enrollment.courseId}
                className='inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto'
              >
                {pendingId === enrollment.courseId ? "Leaving…" : "Leave"}
              </button>
            </div>
          </div>

          <div className='mt-4'>
            <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
              <span className='flex items-center gap-1.5'>
                {enrollment.progress > 0 ? (
                  <MdCheckCircle size={13} className='text-emerald-600' />
                ) : (
                  <MdLockOutline size={13} />
                )}
                Progress
              </span>
              <span>
                {enrollment.status === "completed"
                  ? "100% · Track complete"
                  : `${enrollment.progress}%`}
              </span>
            </div>
            <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100'>
              <div
                className='h-full rounded-full transition-all'
                style={{
                  width: `${enrollment.progress}%`,
                  backgroundImage: `linear-gradient(90deg, ${enrollment.accentFrom}, ${enrollment.accentTo})`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
