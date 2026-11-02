"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { enrollInCourse, leaveCourse } from "@/app/actions/enroll";
import type { Course } from "@/types/app";
import {
  MdEngineering,
  MdOutlineWorkOutline,
  MdOutlineBarChart,
  MdOutlineCloud,
  MdCheckCircle,
  MdLockOutline,
} from "react-icons/md";
import { SiKubernetes } from "react-icons/si";

const ICONS = {
  work: MdOutlineWorkOutline,
  kubernetes: SiKubernetes,
  engineering: MdEngineering,
  cloud: MdOutlineCloud,
  chart: MdOutlineBarChart,
} as const;

type Props = {
  courses: Course[];
  enrolledIds: string[];
  isSignedIn: boolean;
  activeCount: number;
  limit: number;
  isAdmin: boolean;
};

export default function CourseCatalog({
  courses,
  enrolledIds,
  isSignedIn,
  activeCount,
  limit,
  isAdmin,
}: Props) {
  const router = useRouter();
  const { addEnrollment, removeEnrollment, enrollments } = useAppStore();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );

  const enrolledSet = new Set([...enrolledIds, ...enrollments.map((e) => e.courseId)]);
  const atLimit = enrolledSet.size >= limit;

  const handleEnroll = async (course: Course) => {
    if (!isSignedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/#courses")}`);
      return;
    }

    setPendingId(course.id);
    setMessage(null);

    const result = await enrollInCourse(course.id);

    if (!result.ok) {
      setMessage({ tone: "error", text: result.message ?? "Could not enroll." });
      setPendingId(null);
      return;
    }

    addEnrollment({
      id: `local-${course.id}`,
      courseId: course.id,
      courseSlug: course.slug,
      courseTitle: course.title,
      courseHref: course.href,
      courseSummary: course.summary,
      accentFrom: course.accentFrom,
      accentTo: course.accentTo,
      status: "active",
      progress: 0,
      enrolledAt: new Date().toISOString(),
    });

    setMessage({ tone: "ok", text: `Seat reserved on ${course.title}. Start with the recap.` });
    setPendingId(null);
    router.refresh();
  };

  const handleLeave = async (course: Course) => {
    setPendingId(course.id);
    setMessage(null);

    const result = await leaveCourse(course.id);

    if (!result.ok) {
      setMessage({ tone: "error", text: result.message ?? "Could not leave." });
      setPendingId(null);
      return;
    }

    removeEnrollment(course.id);
    setMessage({ tone: "ok", text: `You left ${course.title}. Your past attempts are still on your profile.` });
    setPendingId(null);
    router.refresh();
  };

  const openCourse = (course: Course) => {
    if (!isSignedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(course.href)}`);
      return;
    }

    if (!enrolledSet.has(course.id)) {
      setMessage({
        tone: "error",
        text: `Reserve a seat on ${course.title} to open its recap, videos and practice bank.`,
      });
      return;
    }

    router.push(course.href);
  };

  if (courses.length === 0) {
    return (
      <div
        id='courses'
        className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm'
      >
        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
          Exam catalogue
        </p>
        <h2 className='mt-3 text-2xl font-black text-slate-900'>
          No exam tracks are published yet.
        </h2>
        <p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600'>
          Run <code className='rounded bg-slate-100 px-1'>supabase/schema.sql</code>{" "}
          to create and seed the exam catalogue, then reload this page.
          {isAdmin && " You can also sync question banks from Admin → Content."}
        </p>
      </div>
    );
  }

  return (
    <div id='courses' className='flex flex-col gap-6'>
      {message && (
        <div
          className={`rounded-2xl border px-5 py-3 text-sm font-medium ${
            message.tone === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
            Exam catalogue
          </p>
          <h2 className='mt-2 text-2xl font-black text-slate-900 sm:text-3xl'>
            {limit === 1 ? "Pick your exam track" : `Pick up to ${limit} exam tracks`}
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
            Each track gives you the topic recap, the key-concept videos, and a
            question bank in the format of the real exam.
          </p>
        </div>
        <p className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600'>
          {courses.length} exam tracks ·{" "}
          {courses.reduce((total, course) => total + course.enrolled, 0)} seats
          reserved
        </p>
      </div>

      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {courses.map((course, index) => {
          const isEnrolled = enrolledSet.has(course.id);
          const Icon = ICONS[course.icon as keyof typeof ICONS] ?? ICONS.work;
          const disableEnroll = !isEnrolled && atLimit;

          return (
            <article
              key={course.id}
              className='group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
            >
              <div
                className='relative overflow-hidden rounded-[22px] p-6 text-white'
                style={{
                  backgroundImage: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
                }}
              >
                <div className='flex min-h-[250px] flex-col justify-between gap-6 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>
                        {course.track}
                      </p>
                      <h3 className='mt-3 text-2xl font-black leading-tight sm:text-3xl'>
                        {course.title}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                        isEnrolled
                          ? "border-emerald-200/60 bg-emerald-400/20 text-white"
                          : "border-white/20 bg-white/10 text-white/85"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <MdCheckCircle size={13} /> Seat reserved
                        </>
                      ) : (
                        <>
                          <MdLockOutline size={13} /> Enrol to open
                        </>
                      )}
                    </span>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/15'>
                        <Icon size={30} />
                      </span>
                      <div className='text-xs font-semibold uppercase tracking-widest text-white/75'>
                        <p>{course.level}</p>
                        <p className='mt-1 text-white/60'>
                          {course.questions > 0
                            ? `${course.questions} questions`
                            : `${course.estimatedHours}h path`}
                        </p>
                      </div>
                    </div>
                    <p className='text-sm leading-6 text-white/90'>
                      {course.summary}
                    </p>
                  </div>

                  <div className='flex items-center justify-between gap-3 text-sm font-semibold text-white/85'>
                    <span>
                      {course.enrolled} preparing
                      {index === 0 && course.enrolled > 0 ? " · popular" : ""}
                    </span>
                    <span className='rounded-full border border-white/20 bg-white/10 px-4 py-2 transition group-hover:bg-white/20'>
                      {isEnrolled ? "Open recap →" : "Exam details"}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2 px-2 pb-2 pt-4'>
                {isEnrolled ? (
                  <>
                    <button
                      type='button'
                      onClick={() => openCourse(course)}
                      className='flex-1 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800'
                    >
                      Open recap
                    </button>
                    <button
                      type='button'
                      onClick={() => handleLeave(course)}
                      disabled={pendingId === course.id}
                      className='rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50'
                    >
                      {pendingId === course.id ? "Leaving…" : "Leave"}
                    </button>
                  </>
                ) : (
                  <button
                    type='button'
                    onClick={() => handleEnroll(course)}
                    disabled={disableEnroll || pendingId === course.id}
                    className='w-full rounded-full bg-[#2660A4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600'
                  >                      {pendingId === course.id
                        ? "Reserving your seat…"
                        : disableEnroll
                          ? `${limit}-track limit reached`
                          : isSignedIn
                            ? "Reserve a seat on this exam"
                            : "Sign in to reserve a seat"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
