"use client";

import { useState, useTransition } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { requestCourse } from "@/app/actions/course-request";

const LEVELS = ["Not sure yet", "Beginner", "Intermediate", "Advanced"];

type Props = {
  defaultName?: string;
  defaultEmail?: string;
  isSignedIn: boolean;
  suggestions?: string[];
};

export default function CourseRequestForm({
  defaultName = "",
  defaultEmail = "",
  isSignedIn,
  suggestions = [],
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [courseTitle, setCourseTitle] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage(null);

    startTransition(async () => {
      const result = await requestCourse(formData);

      setMessage({
        tone: result.ok ? "ok" : "error",
        text: result.message,
      });

      if (result.ok) {
        form.reset();
        setCourseTitle("");
      }
    });
  };

  return (
    <section
      id='request-course'
      className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70'
    >
      <div className='bg-gradient-to-r from-[#0E2F5E] to-[#2660A4] px-6 py-8 text-white sm:px-8'>
        <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]'>
          <MdOutlinePlaylistAdd size={14} />
          Course requests
        </span>
        <h2 className='mt-4 text-2xl font-black sm:text-3xl'>
          Not seeing the course you need? Ask for it.
        </h2>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-white/85'>
          Tell us what you want to learn. Your request goes straight to the
          CertifyHub team — and shows up in the admin dashboard so nothing gets
          lost.
        </p>
      </div>

      <form onSubmit={onSubmit} className='space-y-4 px-6 py-6 sm:px-8 sm:py-8'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='flex flex-col gap-1.5 text-sm font-semibold text-slate-700'>
            Your name
            <input
              type='text'
              name='fullName'
              defaultValue={defaultName}
              maxLength={80}
              required
              placeholder='Ada Lovelace'
              className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>

          <label className='flex flex-col gap-1.5 text-sm font-semibold text-slate-700'>
            Email
            <input
              type='email'
              name='email'
              defaultValue={defaultEmail}
              maxLength={254}
              required
              placeholder='you@example.com'
              className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>
        </div>

        <label className='flex flex-col gap-1.5 text-sm font-semibold text-slate-700'>
          Course or topic you want
          <input
            type='text'
            name='courseTitle'
            value={courseTitle}
            onChange={(event) => setCourseTitle(event.target.value)}
            maxLength={120}
            required
            placeholder='e.g. ITIL 4 Specialist: Create, Deliver and Support'
            className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#2660A4]'
          />
        </label>

        {suggestions.length > 0 && (
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs font-semibold uppercase tracking-wide text-slate-400'>
              Popular asks
            </span>
            {suggestions.map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setCourseTitle(item)}
                className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4]'
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='flex flex-col gap-1.5 text-sm font-semibold text-slate-700'>
            Your level
            <select
              name='level'
              defaultValue='Not sure yet'
              className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#2660A4]'
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className='flex flex-col gap-1.5 text-sm font-semibold text-slate-700'>
            Anything else? (optional)
            <input
              type='text'
              name='message'
              maxLength={1000}
              placeholder='Exam date, budget, format…'
              className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#2660A4]'
            />
          </label>
        </div>

        {/* Honeypot — hidden from people, filled by bots. */}
        <div className='hidden' aria-hidden='true'>
          <label>
            Website
            <input type='text' name='website' tabIndex={-1} autoComplete='off' />
          </label>
        </div>

        {message && (
          <p
            role='status'
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              message.tone === "ok"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-900"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-xs leading-5 text-slate-500'>
            {isSignedIn
              ? "We attach this request to your account so the team can follow up."
              : "No account needed — just make sure the email is right."}
          </p>
          <button
            type='submit'
            disabled={isPending}
            className='rounded-full bg-[#2660A4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isPending ? "Sending request…" : "Request this course"}
          </button>
        </div>
      </form>
    </section>
  );
}
