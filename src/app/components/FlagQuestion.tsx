"use client";

import { useState } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdErrorOutline,
  MdFlag,
} from "react-icons/md";
import {
  QUESTION_REPORT_ISSUES,
  QUESTION_REPORT_ISSUE_LABELS,
} from "@/types/app";

export default function FlagQuestion({
  questionId,
  questionPrompt,
  courseSlug,
}: {
  questionId: string;
  questionPrompt: string;
  courseSlug?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<string>("wrong-answer");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );

  const submit = async () => {
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/flag-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          questionPrompt,
          courseSlug: courseSlug ?? "",
          issueType,
          description,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };

      if (!res.ok || !data.ok) {
        setMessage({
          tone: "error",
          text: data.message ?? "Could not send the report.",
        });
        return;
      }

      setMessage({
        tone: "ok",
        text: data.message ?? "Report sent. Watch your notifications for a reply.",
      });
      setDescription("");
    } catch {
      setMessage({ tone: "error", text: "Network error — try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={() => {
          setOpen(true);
          setMessage(null);
        }}
        className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600'
      >
        <MdFlag size={13} />
        Report an issue
      </button>

      {open && (
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center'>
          <div className='w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.24em] text-slate-400'>
                  Flag this question
                </p>
                <h3 className='mt-2 text-lg font-black leading-snug text-slate-900'>
                  What looks wrong?
                </h3>
              </div>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='text-slate-400 transition hover:text-slate-700'
                aria-label='Close'
              >
                <MdClose size={20} />
              </button>
            </div>

            <p className='mt-3 line-clamp-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500'>
              {questionPrompt}
            </p>

            <div className='mt-4 space-y-2'>
              {QUESTION_REPORT_ISSUES.map((issue) => (
                <label
                  key={issue}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    issueType === issue
                      ? "border-[#2660A4] bg-[#2660A4]/5 text-[#2660A4]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type='radio'
                    name='issue'
                    checked={issueType === issue}
                    onChange={() => setIssueType(issue)}
                    className='h-4 w-4 accent-[#2660A4]'
                  />
                  {QUESTION_REPORT_ISSUE_LABELS[issue]}
                </label>
              ))}
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder='Tell us what you expected instead (optional, but it helps).'
              className='mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
            />

            {message && (
              <p
                className={`mt-3 flex items-start gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ${
                  message.tone === "ok"
                    ? "bg-[#1F8A70]/10 text-[#166b56]"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.tone === "ok" ? (
                  <MdCheckCircle size={14} className='mt-0.5 shrink-0' />
                ) : (
                  <MdErrorOutline size={14} className='mt-0.5 shrink-0' />
                )}
                {message.text}
              </p>
            )}

            <div className='mt-4 flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300'
              >
                Close
              </button>
              <button
                type='button'
                onClick={submit}
                disabled={sending}
                className='inline-flex items-center gap-1.5 rounded-full bg-[#2660A4] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
              >
                <MdFlag size={14} />
                {sending ? "Sending…" : "Send report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
