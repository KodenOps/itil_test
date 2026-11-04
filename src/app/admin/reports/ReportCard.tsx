"use client";

import { useState, useTransition } from "react";
import {
  MdCheck,
  MdClose,
  MdEditNote,
  MdOutlineQuestionAnswer,
  MdOutlineSend,
} from "react-icons/md";
import { replyToReport, updateReportedQuestion } from "./actions";
import {
  QUESTION_REPORT_ISSUE_LABELS,
  QUESTION_REPORT_STATUSES,
  QUESTION_REPORT_STATUS_LABELS,
  type QuestionReport as Report,
  type QuestionReportStatus,
} from "@/types/app";

function statusTone(status: QuestionReportStatus): string {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-800";
    case "reviewing":
      return "bg-[#2660A4]/10 text-[#2660A4]";
    case "resolved":
      return "bg-[#1F8A70]/15 text-[#166b56]";
    default:
      return "bg-slate-200 text-slate-600";
  }
}

export default function ReportCard({ report }: { report: Report }) {
  const [status, setStatus] = useState<QuestionReportStatus>(report.status);
  const [reply, setReply] = useState(report.adminReply);
  const [editing, setEditing] = useState(false);
  const [prompt, setPrompt] = useState(report.question?.prompt ?? report.questionPrompt);
  const [options, setOptions] = useState<string[]>(report.question?.options ?? []);
  const [answers, setAnswers] = useState<number[]>(report.question?.answers ?? []);
  const [explanation, setExplanation] = useState(report.question?.explanation ?? "");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const handleReply = () => {
    startTransition(async () => {
      const result = await replyToReport({
        reportId: report.id,
        status,
        reply,
      });

      setMessage(
        result.ok
          ? { tone: "ok", text: "Reply saved — the reporter has been notified." }
          : { tone: "error", text: result.message },
      );
    });
  };

  const handleQuestionSave = () => {
    startTransition(async () => {
      const result = await updateReportedQuestion({
        reportId: report.id,
        courseSlug: report.courseSlug ?? "",
        externalId: report.question?.externalId ?? report.questionId,
        prompt,
        options,
        answers,
        explanation,
      });

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      setEditing(false);
      setMessage({
        tone: "ok",
        text: "Question updated. The reporter got a notification.",
      });
    });
  };

  return (
    <div className='rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusTone(report.status)}`}>
              {QUESTION_REPORT_STATUS_LABELS[report.status]}
            </span>
            <span className='rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600'>
              {QUESTION_REPORT_ISSUE_LABELS[report.issueType]}
            </span>
            <span className='text-[11px] font-semibold text-slate-400'>
              {new Date(report.createdAt).toLocaleString("en-GB")}
            </span>
          </div>

          <p className='mt-2 text-sm font-bold text-slate-900'>
            {report.userName}
            {report.userEmail && (
              <span className='ml-1.5 font-medium text-slate-400'>
                {report.userEmail}
              </span>
            )}
          </p>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400'>
            {report.courseTitle ?? "Unlinked course"} · {report.questionId}
          </p>
        </div>

        <button
          type='button'
          onClick={() => setEditing((value) => !value)}
          disabled={!report.question}
          className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4] disabled:opacity-40'
        >
          <MdEditNote size={14} />
          {editing ? "Close editor" : "Edit question"}
        </button>
      </div>

      <p className='mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700'>
        {report.description || "No extra description was given."}
      </p>

      {!editing && (
        <p className='mt-2 line-clamp-2 text-xs font-semibold text-slate-500'>
          <MdOutlineQuestionAnswer className='mr-1 inline' size={13} />
          {report.questionPrompt}
        </p>
      )}

      {editing && (
        <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
            Edit the stored question
          </p>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            className='mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
          />

          <div className='mt-3 space-y-2'>
            {options.map((option, index) => {
              const correct = answers.includes(index);

              return (
                <div key={index} className='flex items-center gap-2'>
                  <button
                    type='button'
                    onClick={() =>
                      setAnswers((current) =>
                        current.includes(index)
                          ? current.filter((value) => value !== index)
                          : [...current, index].sort((a, b) => a - b),
                      )
                    }
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      correct
                        ? "border-[#1F8A70] bg-[#1F8A70] text-white"
                        : "border-slate-300 text-slate-400"
                    }`}
                    aria-label={`Toggle option ${index + 1}`}
                  >
                    {correct ? <MdCheck size={13} /> : index + 1}
                  </button>
                  <input
                    value={option}
                    onChange={(event) => {
                      const next = [...options];
                      next[index] = event.target.value;
                      setOptions(next);
                    }}
                    className='w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[13px] text-slate-700 outline-none focus:border-[#2660A4]'
                  />
                  <button
                    type='button'
                    onClick={() => {
                      setOptions((current) =>
                        current.filter((_, position) => position !== index),
                      );
                      setAnswers((current) =>
                        current
                          .filter((value) => value !== index)
                          .map((value) => (value > index ? value - 1 : value)),
                      );
                    }}
                    className='shrink-0 text-slate-300 transition hover:text-red-500'
                    aria-label='Remove option'
                  >
                    <MdClose size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type='button'
            onClick={() => setOptions((current) => [...current, ""])}
            className='mt-2 text-xs font-bold text-[#2660A4] hover:underline'
          >
            + add option
          </button>

          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows={2}
            placeholder='Explanation shown after answering'
            className='mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
          />

          <button
            type='button'
            onClick={handleQuestionSave}
            disabled={pending}
            className='mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-60'
          >
            Save question
          </button>
        </div>
      )}

      <div className='mt-4 grid gap-3 sm:grid-cols-[1fr_auto]'>
        <textarea
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          rows={2}
          placeholder='Reply to the reporter — this lands in their notification bell.'
          className='w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
        />

        <div className='flex flex-col gap-2'>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as QuestionReportStatus)}
            className='rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none'
          >
            {QUESTION_REPORT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {QUESTION_REPORT_STATUS_LABELS[option]}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={handleReply}
            disabled={pending}
            className='inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#2660A4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
          >
            <MdOutlineSend size={14} /> Send reply
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${
            message.tone === "ok"
              ? "bg-[#1F8A70]/10 text-[#166b56]"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
