"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  MdAdd,
  MdCheck,
  MdClose,
  MdDeleteOutline,
  MdDragIndicator,
  MdFileUpload,
  MdOutlineCloudDone,
  MdOutlineQuiz,
  MdSave,
  MdWarningAmber,
} from "react-icons/md";
import { saveQuestionBank } from "./actions";
import { saveQuestionDraft } from "./import-actions";
import {
  TEST_FORMATS,
  TEST_FORMAT_LABELS,
  emptyQuestion,
  parseQuestionBank,
  questionProblems,
  toStoredQuestions,
  type BankQuestion,
  type TestFormat,
} from "@/types/questionBank";

type CourseOption = {
  slug: string;
  title: string;
  isPublished: boolean;
  liveQuestions: number;
  draftQuestions: number;
};

export default function QuestionBankEditor({
  courses,
  courseSlug,
  live,
  draft,
  draftSavedAt,
}: {
  courses: CourseOption[];
  courseSlug: string;
  live: BankQuestion[];
  draft: BankQuestion[] | null;
  draftSavedAt: string | null;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<BankQuestion[]>(draft ?? live);
  const [format, setFormat] = useState<TestFormat>(
    live[0]?.format ?? draft?.[0]?.format ?? "practice-index",
  );
  const [newQuestion, setNewQuestion] = useState<BankQuestion>(
    emptyQuestion("practice-index"),
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const course = courses.find((item) => item.slug === courseSlug) ?? null;
  const invalidCount = questions.filter(
    (question) => questionProblems(question).length > 0,
  ).length;

  const updateQuestion = (index: number, patch: Partial<BankQuestion>) =>
    setQuestions((current) =>
      current.map((question, position) =>
        position === index ? { ...question, ...patch } : question,
      ),
    );

  const move = (from: number, to: number) => {
    setQuestions((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const mergeBank = (incoming: BankQuestion[], label: string) => {
    setQuestions((current) => {
      const seen = new Set(current.map((question) => question.externalId));
      const additions = incoming.filter((question) => {
        if (seen.has(question.externalId)) return false;
        seen.add(question.externalId);
        return true;
      });
      return [...current, ...additions];
    });

    setMessage({
      tone: "ok",
      text: `${label}: ${incoming.length} question${incoming.length === 1 ? "" : "s"} parsed.`,
    });
  };

  const handleJsonFile = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text());
      const parsed = parseQuestionBank(raw, format);

      if (parsed.questions.length === 0) {
        setMessage({
          tone: "error",
          text: parsed.errors[0] ?? "No questions were found in that file.",
        });
        return;
      }

      mergeBank(parsed.questions, file.name);

      if (parsed.errors.length > 0) {
        setMessage({
          tone: "error",
          text: `${parsed.questions.length} parsed, ${parsed.errors.length} skipped: ${parsed.errors[0]}`,
        });
      }
    } catch {
      setMessage({ tone: "error", text: "That file is not valid JSON." });
    }
  };

  const addManual = () => {
    const problems = questionProblems(newQuestion);

    if (problems.length > 0) {
      setMessage({ tone: "error", text: problems[0] });
      return;
    }

    const externalId =
      newQuestion.externalId.trim() ||
      `${courseSlug || "q"}-${Date.now().toString(36)}`;

    setQuestions((current) => [
      ...current,
      { ...newQuestion, externalId, format, id: `${externalId}-${current.length}` },
    ]);

    setNewQuestion(emptyQuestion(format));
    setMessage({ tone: "ok", text: "Question added to the bank. Save to keep it." });
  };

  const handleSaveDraft = () => {
    startTransition(async () => {
      const result = await saveQuestionDraft(
        courseSlug,
        questions.map((question) => ({
          externalId: question.externalId,
          category: question.category,
          prompt: question.prompt,
          options: question.options,
          answers: question.answers,
          multiple: question.multiple,
          explanation: question.explanation,
          imageUrl: question.imageUrl,
          format: question.format,
        })),
      );

      setMessage({
        tone: result.ok ? "ok" : "error",
        text: result.ok
          ? "Draft saved. Learners still see the live bank."
          : result.message,
      });

      if (result.ok) router.refresh();
    });
  };

  const handlePublish = () => {
    if (questions.length === 0) {
      setMessage({ tone: "error", text: "Add at least one question first." });
      return;
    }

    startTransition(async () => {
      const result = await saveQuestionBank({
        slug: courseSlug,
        format,
        questions: toStoredQuestions(questions),
        mode: "replace",
      });

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      setMessage({
        tone: "ok",
        text: `${result.count} question${result.count === 1 ? "" : "s"} published to ${course?.title ?? courseSlug}.`,
      });

      router.refresh();
    });
  };

  if (courses.length === 0) {
    return (
      <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center'>
        <MdOutlineQuiz size={30} className='mx-auto text-slate-300' />
        <p className='mt-3 text-sm font-semibold text-slate-600'>
          No courses yet. Import a course JSON first.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Course picker */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
        <label className='flex-1'>
          <span className='text-xs font-bold uppercase tracking-[0.22em] text-slate-500'>
            Course
          </span>
          <select
            value={courseSlug}
            onChange={(event) =>
              router.push(`/admin?view=questions&course=${event.target.value}`)
            }
            className='mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#2660A4]'
          >
            {courses.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title} · {option.liveQuestions} live
                {option.draftQuestions ? ` · ${option.draftQuestions} draft` : ""}
                {option.isPublished ? "" : " (unpublished)"}
              </option>
            ))}
          </select>
        </label>

        <div className='flex flex-wrap gap-2 pt-6'>
          <button
            type='button'
            onClick={() => fileRef.current?.click()}
            className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4]'
          >
            <MdFileUpload size={14} /> Upload JSON
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='application/json,.json'
            className='hidden'
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleJsonFile(file);
              event.target.value = "";
            }}
          />
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as TestFormat)}
            className='rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none'
          >
            {TEST_FORMATS.map((option) => (
              <option key={option} value={option}>
                {TEST_FORMAT_LABELS[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.25fr_0.75fr]'>
        {/* Bank */}
        <div
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("Files")) {
              event.preventDefault();
              setDropping(true);
            }
          }}
          onDragLeave={() => setDropping(false)}
          onDrop={(event) => {
            const file = event.dataTransfer.files?.[0];
            setDropping(false);
            if (file) {
              event.preventDefault();
              void handleJsonFile(file);
            }
          }}
          className={`rounded-[28px] border bg-white p-5 shadow-lg shadow-slate-200/60 transition ${
            dropping ? "border-[#2660A4] border-2" : "border-slate-200"
          }`}
        >
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.28em] text-slate-400'>
                Question bank
              </p>
              <p className='mt-1 text-sm text-slate-600'>
                {questions.length} question{questions.length === 1 ? "" : "s"}
                {questions.length !== live.length && (
                  <span className='ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800'>
                    Unsaved changes
                  </span>
                )}
              </p>
            </div>
            <p className='text-xs font-semibold text-slate-400'>
              Drag the handle to reorder · drop a .json file to import
            </p>
          </div>

          {invalidCount > 0 && (
            <p className='mt-3 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800'>
              <MdWarningAmber size={14} />
              {invalidCount} question{invalidCount === 1 ? "" : "s"} still need
              fixing before publishing.
            </p>
          )}

          <div className='mt-4 space-y-2'>
            {questions.length === 0 && (
              <p className='rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500'>
                Nothing here yet. Add a question on the right, or drop a JSON bank.
              </p>
            )}

            {questions.map((question, index) => {
              const problems = questionProblems(question);

              return (
                <div
                  key={question.id}
                  draggable
                  onDragStart={() => setDraggingIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggingIndex !== null && draggingIndex !== index) {
                      move(draggingIndex, index);
                    }
                    setDraggingIndex(null);
                  }}
                  className={`rounded-2xl border p-3.5 transition ${
                    draggingIndex === index
                      ? "border-[#2660A4] bg-[#2660A4]/5 opacity-70"
                      : problems.length > 0
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-slate-100 bg-slate-50/60"
                  }`}
                >
                  <div className='flex items-start gap-2'>
                    <span className='mt-1 cursor-grab text-slate-400 active:cursor-grabbing'>
                      <MdDragIndicator size={16} />
                    </span>

                    <div className='min-w-0 flex-1'>
                      <textarea
                        value={question.prompt}
                        onChange={(event) =>
                          updateQuestion(index, { prompt: event.target.value })
                        }
                        rows={2}
                        className='w-full resize-y bg-transparent text-sm font-semibold text-slate-900 outline-none'
                      />

                      <div className='mt-2 space-y-1.5'>
                        {question.options.map((option, optionIndex) => {
                          const correct = question.answers.includes(optionIndex);

                          return (
                            <div key={optionIndex} className='flex items-center gap-2'>
                              <button
                                type='button'
                                onClick={() => {
                                  const answers = question.multiple
                                    ? correct
                                      ? question.answers.filter(
                                          (value) => value !== optionIndex,
                                        )
                                      : [...question.answers, optionIndex].sort()
                                    : [optionIndex];
                                  updateQuestion(index, { answers });
                                }}
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition ${
                                  correct
                                    ? "border-[#1F8A70] bg-[#1F8A70] text-white"
                                    : "border-slate-300 text-slate-400 hover:border-[#2660A4]"
                                }`}
                                aria-label={`Mark option ${optionIndex + 1} correct`}
                              >
                                {correct ? <MdCheck size={13} /> : optionIndex + 1}
                              </button>
                              <input
                                value={option}
                                onChange={(event) => {
                                  const options = [...question.options];
                                  options[optionIndex] = event.target.value;
                                  updateQuestion(index, { options });
                                }}
                                className='w-full rounded-lg border border-transparent bg-white px-2 py-1 text-[13px] text-slate-700 outline-none transition focus:border-slate-200'
                              />
                              <button
                                type='button'
                                onClick={() =>
                                  updateQuestion(index, {
                                    options: question.options.filter(
                                      (_, position) => position !== optionIndex,
                                    ),
                                    answers: question.answers
                                      .filter((value) => value !== optionIndex)
                                      .map((value) =>
                                        value > optionIndex ? value - 1 : value,
                                      ),
                                  })
                                }
                                className='shrink-0 text-slate-300 transition hover:text-red-500'
                                aria-label='Remove option'
                              >
                                <MdClose size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className='mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500'>
                        <label className='inline-flex items-center gap-1.5'>
                          <input
                            type='checkbox'
                            checked={question.multiple}
                            onChange={(event) =>
                              updateQuestion(index, {
                                multiple: event.target.checked,
                                answers: event.target.checked
                                  ? question.answers
                                  : question.answers.slice(0, 1),
                              })
                            }
                            className='h-3.5 w-3.5 accent-[#2660A4]'
                          />
                          Multiple answers
                        </label>
                        <button
                          type='button'
                          onClick={() =>
                            updateQuestion(index, {
                              options: [...question.options, ""],
                            })
                          }
                          className='text-[#2660A4] hover:underline'
                        >
                          + option
                        </button>
                        <span className='rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-400'>
                          {question.externalId}
                        </span>
                        {problems.length > 0 && (
                          <span className='text-amber-700'>{problems[0]}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((_, position) => position !== index),
                        )
                      }
                      className='mt-1 shrink-0 text-slate-300 transition hover:text-red-500'
                      aria-label='Remove question'
                    >
                      <MdDeleteOutline size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {message && (
            <p
              className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                message.tone === "ok"
                  ? "bg-[#1F8A70]/10 text-[#166b56]"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className='mt-5 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={handleSaveDraft}
              disabled={pending || !courseSlug}
              className='inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 disabled:opacity-60'
            >
              <MdSave size={15} /> Save draft
            </button>
            <button
              type='button'
              onClick={handlePublish}
              disabled={pending || !courseSlug}
              className='inline-flex items-center gap-2 rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
            >
              <MdOutlineCloudDone size={15} /> Publish bank
            </button>
            {draftSavedAt && (
              <span className='text-xs font-semibold text-slate-400'>
                Draft saved {new Date(draftSavedAt).toLocaleString("en-GB")}
              </span>
            )}
          </div>
        </div>

        {/* Add a question */}
        <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-[0.28em] text-slate-400'>
            Add one question
          </p>

          <div className='mt-4 space-y-3'>
            <input
              value={newQuestion.externalId}
              onChange={(event) =>
                setNewQuestion({ ...newQuestion, externalId: event.target.value })
              }
              placeholder='id (optional) — e.g. kcna-014'
              className='w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2660A4]'
            />
            <textarea
              value={newQuestion.prompt}
              onChange={(event) =>
                setNewQuestion({ ...newQuestion, prompt: event.target.value })
              }
              rows={3}
              placeholder='The question, exactly as the learner sees it.'
              className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
            />
            <input
              value={newQuestion.category}
              onChange={(event) =>
                setNewQuestion({ ...newQuestion, category: event.target.value })
              }
              placeholder='Category (optional)'
              className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
            />

            {newQuestion.options.map((option, index) => (
              <div key={index} className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() =>
                    setNewQuestion({
                      ...newQuestion,
                      answers: newQuestion.multiple
                        ? newQuestion.answers.includes(index)
                          ? newQuestion.answers.filter((value) => value !== index)
                          : [...newQuestion.answers, index].sort()
                        : [index],
                    })
                  }
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                    newQuestion.answers.includes(index)
                      ? "border-[#1F8A70] bg-[#1F8A70] text-white"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  {newQuestion.answers.includes(index) ? (
                    <MdCheck size={13} />
                  ) : (
                    index + 1
                  )}
                </button>
                <input
                  value={option}
                  onChange={(event) => {
                    const options = [...newQuestion.options];
                    options[index] = event.target.value;
                    setNewQuestion({ ...newQuestion, options });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
                />
              </div>
            ))}

            <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
              <label className='inline-flex items-center gap-1.5'>
                <input
                  type='checkbox'
                  checked={newQuestion.multiple}
                  onChange={(event) =>
                    setNewQuestion({
                      ...newQuestion,
                      multiple: event.target.checked,
                    })
                  }
                  className='h-3.5 w-3.5 accent-[#2660A4]'
                />
                Multiple answers
              </label>
              <button
                type='button'
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    options: [...newQuestion.options, ""],
                  })
                }
                className='text-[#2660A4] hover:underline'
              >
                + option
              </button>
            </div>

            <textarea
              value={newQuestion.explanation}
              onChange={(event) =>
                setNewQuestion({ ...newQuestion, explanation: event.target.value })
              }
              rows={2}
              placeholder='Explanation shown after answering.'
              className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2660A4]'
            />

            <button
              type='button'
              onClick={addManual}
              className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800'
            >
              <MdAdd size={16} /> Add to bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
