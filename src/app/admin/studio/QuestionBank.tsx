"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdAdd,
  MdCheckCircle,
  MdDeleteOutline,
  MdDragIndicator,
  MdErrorOutline,
  MdOutlineAddPhotoAlternate,
  MdOutlineContentCopy,
  MdOutlineDataObject,
  MdOutlineEditNote,
  MdSave,
  MdUploadFile,
} from "react-icons/md";
import { loadQuestionBank, saveQuestionBank } from "./actions";
import {
  TEST_FORMATS,
  TEST_FORMAT_HINTS,
  TEST_FORMAT_LABELS,
  emptyQuestion,
  newQuestionId,
  parseQuestionBank,
  questionProblems,
  toStoredQuestions,
  type BankQuestion,
  type TestFormat,
} from "@/types/questionBank";

const QUESTION_MIME = "application/x-bank-question";
const OPTION_MIME = "application/x-bank-option";

const INPUT =
  "w-full! rounded-xl! border! border-slate-200! bg-white! px-3! py-2.5! text-sm! text-slate-900! mb-0! outline-none transition focus:border-[#2660A4]!";
const LABEL =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

const EXAMPLE = `[
  {
    "id": "kcna-001",
    "category": "Kubernetes Fundamentals",
    "prompt": "Which command lists pods in every namespace?",
    "options": ["kubectl get pods", "kubectl get pods -A", "kubectl pods", "kubectl list"],
    "answer": 1,
    "explanation": "The -A flag covers all namespaces.",
    "imageUrl": "",
    "format": "exam-index"
  },
  {
    "prompt": "Which of these are control plane components? (select all that apply)",
    "options": ["kube-apiserver", "kubelet", "etcd", "kube-proxy"],
    "answer": ["kube-apiserver", "etcd"],
    "multiple": true,
    "format": "exam-text"
  }
]`;

export default function QuestionBank({
  courseSlug,
  courseTitle,
}: {
  courseSlug: string;
  courseTitle: string;
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [format, setFormat] = useState<TestFormat>("exam-index");
  const [mode, setMode] = useState<"builder" | "json">("builder");
  const [pasted, setPasted] = useState("");
  const [importMode, setImportMode] = useState<"replace" | "append">("replace");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await loadQuestionBank(courseSlug);

      if (cancelled) return;

      if (result.ok) {
        setQuestions(result.questions);
        setFormat(result.questions[0]?.format ?? "exam-index");
      } else {
        setStatus({ tone: "error", text: result.message });
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  const update = (id: string, patch: Partial<BankQuestion>) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === id ? { ...question, ...patch } : question,
      ),
    );
  };

  const setAnswer = (question: BankQuestion, index: number) => {
    update(question.id, {
      answers: question.multiple
        ? question.answers.includes(index)
          ? question.answers.filter((value) => value !== index)
          : [...question.answers, index].sort((a, b) => a - b)
        : [index],
    });
  };

  const moveQuestion = (from: number, to: number) => {
    setQuestions((previous) => {
      if (from === to || from < 0 || from >= previous.length) return previous;

      const next = [...previous];
      const [item] = next.splice(from, 1);
      next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
      return next;
    });
  };

  const moveOption = (question: BankQuestion, from: number, to: number) => {
    if (from === to || from < 0 || from >= question.options.length) return;

    const options = [...question.options];
    const [item] = options.splice(from, 1);
    options.splice(Math.max(0, Math.min(to, options.length)), 0, item);

    const answers = question.answers.map((index) => {
      if (index === from) return Math.min(to, options.length - 1);
      if (from < index && to >= index) return index - 1;
      if (from > index && to <= index) return index + 1;
      return index;
    });

    update(question.id, {
      options,
      answers: [...new Set(answers)].sort((a, b) => a - b),
    });
  };

  const addQuestion = () => {
    const question = emptyQuestion(format);
    question.externalId = `q-${questions.length + 1}`;
    setQuestions((previous) => [...previous, question]);
  };

  const uploadImage = async (question: BankQuestion, file: File) => {
    setUploadingId(question.id);
    setStatus(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/course-assets", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok || !data.url) {
        throw new Error(data?.error ?? "Upload failed.");
      }

      update(question.id, { imageUrl: data.url });
    } catch (error) {
      setStatus({
        tone: "error",
        text:
          error instanceof Error ? error.message : "Could not upload that image.",
      });
    } finally {
      setUploadingId(null);
    }
  };

  const { parsed, jsonBroken } = useMemo(() => {
    if (!pasted.trim()) {
      return { parsed: { questions: [], errors: [] }, jsonBroken: false };
    }

    try {
      return {
        parsed: parseQuestionBank(JSON.parse(pasted), format),
        jsonBroken: false,
      };
    } catch {
      return { parsed: { questions: [], errors: [] }, jsonBroken: true };
    }
  }, [pasted, format]);

  const save = async () => {
    setSaving(true);
    setStatus(null);

    const result = await saveQuestionBank({
      slug: courseSlug,
      format,
      mode: importMode,
      questions: toStoredQuestions(questions),
    });

    setSaving(false);

    if (!result.ok) {
      setStatus({ tone: "error", text: result.message });
      return;
    }

    setStatus({
      tone: "ok",
      text:
        result.errors.length > 0
          ? `Saved ${result.count} questions. ${result.errors.length} were skipped — see the import notes.`
          : `Saved ${result.count} questions for ${courseTitle}.`,
    });

    if (importMode === "append") {
      const refreshed = await loadQuestionBank(courseSlug);
      if (refreshed.ok) setQuestions(refreshed.questions);
    }
  };

  const importFromJson = () => {
    if (jsonBroken) {
      setStatus({ tone: "error", text: "That JSON does not parse." });
      return;
    }

    if (parsed.questions.length === 0) {
      setStatus({
        tone: "error",
        text: parsed.errors[0] ?? "No questions found in that JSON.",
      });
      return;
    }

    setQuestions((previous) =>
      importMode === "replace" ? parsed.questions : [...previous, ...parsed.questions],
    );
    setMode("builder");
    setStatus({
      tone: "ok",
      text: `Imported ${parsed.questions.length} questions into the editor${
        parsed.errors.length > 0 ? `, ${parsed.errors.length} skipped` : ""
      }. Review them, then save.`,
    });
  };

  const duplicate = (question: BankQuestion) => {
    setQuestions((previous) => {
      const index = previous.findIndex((item) => item.id === question.id);
      const copy: BankQuestion = {
        ...structuredClone(question),
        id: newQuestionId(),
        externalId: `${question.externalId || "question"}-copy`,
        prompt: question.prompt ? `${question.prompt} (copy)` : "",
      };

      const next = [...previous];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const problems = questions.flatMap((question) =>
    questionProblems(question).map((problem) => `${question.externalId}: ${problem}`),
  );

  return (
    <div className='space-y-5'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-slate-500'>
              Question bank
            </p>
            <h3 className='mt-1 text-xl font-black tracking-tight text-slate-900'>
              {questions.length} question{questions.length === 1 ? "" : "s"} for{" "}
              {courseTitle}
            </h3>
            <p className='mt-1 max-w-2xl text-xs leading-6 text-slate-500'>
              Questions feed the exam and practice runners for this course. Each
              question can accept one correct option or several.
            </p>
          </div>

          <div className='flex rounded-full border border-slate-200 bg-slate-50 p-1'>
            <button
              type='button'
              onClick={() => setMode("builder")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                mode === "builder"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MdOutlineEditNote size={14} /> Builder
            </button>
            <button
              type='button'
              onClick={() => setMode("json")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                mode === "json"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MdOutlineDataObject size={14} /> Paste JSON
            </button>
          </div>
        </div>

        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div>
            <label className={LABEL} htmlFor='bank-format'>
              Test format
            </label>
            <select
              id='bank-format'
              value={format}
              onChange={(event) => {
                const next = event.target.value as TestFormat;
                setFormat(next);
                setQuestions((previous) =>
                  previous.map((question) => ({ ...question, format: next })),
                );
              }}
              className={INPUT}
            >
              {TEST_FORMATS.map((value) => (
                <option key={value} value={value}>
                  {TEST_FORMAT_LABELS[value]}
                </option>
              ))}
            </select>
            <p className='mt-1.5 text-[11px] leading-5 text-slate-500'>
              {TEST_FORMAT_HINTS[format]}
            </p>
          </div>

          <div>
            <label className={LABEL} htmlFor='bank-mode'>
              Save mode
            </label>
            <select
              id='bank-mode'
              value={importMode}
              onChange={(event) =>
                setImportMode(event.target.value as "replace" | "append")
              }
              className={INPUT}
            >
              <option value='replace'>Replace the whole bank</option>
              <option value='append'>Append to the existing bank</option>
            </select>
            <p className='mt-1.5 text-[11px] leading-5 text-slate-500'>
              {importMode === "replace"
                ? "Existing questions for this course are deleted on save."
                : "Keeps current questions and adds the ones below."}
            </p>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4'>
          <button
            type='button'
            onClick={save}
            disabled={saving || loading || questions.length === 0}
            className='inline-flex items-center gap-2 rounded-full bg-[#2660A4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f4f8d] disabled:cursor-not-allowed disabled:opacity-40'
          >
            <MdSave size={14} />
            {saving ? "Saving…" : "Save question bank"}
          </button>
          <button
            type='button'
            onClick={addQuestion}
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50'
          >
            <MdAdd size={14} /> Add question
          </button>
          {problems.length > 0 && (
            <span className='rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700'>
              {problems.length} incomplete item{problems.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {status && (
          <p
            className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs ${
              status.tone === "ok"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.tone === "ok" ? (
              <MdCheckCircle size={15} className='mt-0.5 shrink-0' />
            ) : (
              <MdErrorOutline size={15} className='mt-0.5 shrink-0' />
            )}
            {status.text}
          </p>
        )}
      </div>

      {mode === "json" ? (
        <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-slate-500'>
              Bulk upload
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => setPasted(EXAMPLE)}
                className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50'
              >
                Load an example
              </button>
              <button
                type='button'
                onClick={importFromJson}
                disabled={!pasted.trim() || jsonBroken}
                className='inline-flex items-center gap-1.5 rounded-full bg-[#0E2F5E] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#173f73] disabled:cursor-not-allowed disabled:opacity-40'
              >
                <MdUploadFile size={13} /> Import into editor
              </button>
            </div>
          </div>

          <p className='mt-2 text-xs leading-6 text-slate-500'>
            Paste an array of questions. Accepted fields:{" "}
            <span className='font-semibold text-slate-700'>
              prompt / question, options, answer, multiple, explanation, category,
              imageUrl, format
            </span>
            . <span className='font-semibold text-slate-700'>answer</span> can be
            an index, an option letter, the option text, or an array of any of
            those for multi-answer questions.
          </p>

          <textarea
            value={pasted}
            onChange={(event) => setPasted(event.target.value)}
            rows={16}
            spellCheck={false}
            placeholder={EXAMPLE}
            className={`${INPUT} mt-3 resize-y font-mono! text-xs! leading-6!`}
          />

          <div className='mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold'>
            {jsonBroken ? (
              <span className='rounded-full bg-red-50 px-3 py-1.5 text-red-700'>
                Invalid JSON
              </span>
            ) : (
              <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700'>
                {parsed.questions.length} valid question
                {parsed.questions.length === 1 ? "" : "s"}
              </span>
            )}
            {parsed.errors.length > 0 && (
              <span className='rounded-full bg-amber-50 px-3 py-1.5 text-amber-700'>
                {parsed.errors.length} problem{parsed.errors.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {parsed.errors.length > 0 && (
            <ul className='mt-3 space-y-1 rounded-xl bg-amber-50/70 px-4 py-3 text-[11px] leading-5 text-amber-800'>
              {parsed.errors.slice(0, 12).map((error) => (
                <li key={error}>• {error}</li>
              ))}
              {parsed.errors.length > 12 && (
                <li>• …and {parsed.errors.length - 12} more.</li>
              )}
            </ul>
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          {loading && (
            <p className='rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500'>
              Loading the question bank…
            </p>
          )}

          {!loading && questions.length === 0 && (
            <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center'>
              <p className='text-lg font-black text-slate-900'>No questions yet</p>
              <p className='mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600'>
                Add questions one at a time, or paste a JSON bank to bulk upload.
              </p>
              <div className='mt-5 flex flex-wrap justify-center gap-2'>
                <button
                  type='button'
                  onClick={addQuestion}
                  className='inline-flex items-center gap-2 rounded-full bg-[#0E2F5E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173f73]'
                >
                  <MdAdd size={16} /> Add the first question
                </button>
                <button
                  type='button'
                  onClick={() => setMode("json")}
                  className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50'
                >
                  <MdOutlineDataObject size={16} /> Paste JSON
                </button>
              </div>
            </div>
          )}

          {questions.map((question, index) => {
            const isOpen = !collapsed[question.id];
            const issues = questionProblems(question);

            return (
              <div
                key={question.id}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(question.id);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(null);

                  const raw = event.dataTransfer.getData(QUESTION_MIME);
                  if (!raw) return;

                  const from = Number(raw);
                  if (Number.isInteger(from)) moveQuestion(from, index);
                }}
                className={`rounded-[24px] border bg-white p-4 shadow-sm transition ${
                  dragOver === question.id
                    ? "border-[#2660A4] ring-2 ring-[#2660A4]/20"
                    : "border-slate-200"
                }`}
              >
                <div className='flex items-start gap-3'>
                  <span
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(QUESTION_MIME, String(index));
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    className='mt-1 cursor-grab text-slate-300 transition hover:text-slate-500 active:cursor-grabbing'
                    aria-label='Drag to reorder'
                  >
                    <MdDragIndicator size={20} />
                  </span>

                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white'>
                        {index + 1}
                      </span>
                      <span className='text-[11px] font-bold text-slate-400'>
                        {question.externalId || "no id"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          question.multiple
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {question.multiple ? "Multi answer" : "Single answer"}
                      </span>
                      {issues.length > 0 && (
                        <span className='rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700'>
                          {issues.length} issue{issues.length === 1 ? "" : "s"}
                        </span>
                      )}
                      <button
                        type='button'
                        onClick={() =>
                          setCollapsed((previous) => ({
                            ...previous,
                            [question.id]: isOpen,
                          }))
                        }
                        className='ml-auto rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 transition hover:bg-slate-50'
                      >
                        {isOpen ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {!isOpen && (
                      <p className='mt-2 truncate text-sm font-semibold text-slate-700'>
                        {question.prompt || "Untitled question"}
                      </p>
                    )}

                    {isOpen && (
                      <div className='mt-3 space-y-3'>
                        <div>
                          <label className={LABEL}>Question</label>
                          <textarea
                            value={question.prompt}
                            onChange={(event) =>
                              update(question.id, { prompt: event.target.value })
                            }
                            rows={2}
                            placeholder='What does kubectl get pods -A do?'
                            className={`${INPUT} resize-y`}
                          />
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                          <div>
                            <label className={LABEL}>Question id</label>
                            <input
                              value={question.externalId}
                              onChange={(event) =>
                                update(question.id, {
                                  externalId: event.target.value,
                                })
                              }
                              className={INPUT}
                              placeholder='kcna-001'
                            />
                          </div>
                          <div>
                            <label className={LABEL}>Category</label>
                            <input
                              value={question.category}
                              onChange={(event) =>
                                update(question.id, {
                                  category: event.target.value,
                                })
                              }
                              className={INPUT}
                              placeholder='Kubernetes Fundamentals'
                            />
                          </div>
                        </div>

                        <div className='flex flex-wrap items-center gap-3'>
                          <label className='flex items-center gap-2 text-xs font-bold text-slate-700'>
                            <input
                              type='checkbox'
                              checked={question.multiple}
                              onChange={(event) =>
                                update(question.id, {
                                  multiple: event.target.checked,
                                  answers: event.target.checked
                                    ? question.answers
                                    : question.answers.slice(0, 1),
                                })
                              }
                              className='h-4! w-4! p-0! accent-[#2660A4]'
                            />
                            Accept more than one correct option
                          </label>

                          <select
                            value={question.format}
                            onChange={(event) =>
                              update(question.id, {
                                format: event.target.value as TestFormat,
                              })
                            }
                            className='w-auto! rounded-xl! border! border-slate-200! bg-white! px-3! py-2! text-xs! font-semibold! text-slate-600!'
                          >
                            {TEST_FORMATS.map((value) => (
                              <option key={value} value={value}>
                                {TEST_FORMAT_LABELS[value]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className='flex items-center justify-between'>
                            <label className={LABEL}>
                              Options — tick the correct one
                              {question.multiple ? "s" : ""}
                            </label>
                            <span className='text-[10px] font-semibold uppercase text-slate-400'>
                              drag to reorder
                            </span>
                          </div>

                          <div className='space-y-2'>
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={`${question.id}-option-${optionIndex}`}
                                draggable
                                onDragStart={(event) => {
                                  event.dataTransfer.setData(
                                    OPTION_MIME,
                                    JSON.stringify({
                                      questionId: question.id,
                                      index: optionIndex,
                                    }),
                                  );
                                  event.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();

                                  try {
                                    const payload = JSON.parse(
                                      event.dataTransfer.getData(OPTION_MIME),
                                    ) as { questionId?: string; index?: number };

                                    if (
                                      payload.questionId === question.id &&
                                      typeof payload.index === "number"
                                    ) {
                                      moveOption(
                                        question,
                                        payload.index,
                                        optionIndex,
                                      );
                                    }
                                  } catch {
                                    // Not an option drag; ignore.
                                  }
                                }}
                                className='flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-2 py-1.5'
                              >
                                <MdDragIndicator
                                  size={16}
                                  className='shrink-0 cursor-grab text-slate-300'
                                />
                                <input
                                  type={question.multiple ? "checkbox" : "radio"}
                                  name={`answer-${question.id}`}
                                  checked={question.answers.includes(optionIndex)}
                                  onChange={() => setAnswer(question, optionIndex)}
                                  className='h-4! w-4! shrink-0 p-0! accent-[#2660A4]'
                                  aria-label={`Mark option ${optionIndex + 1} correct`}
                                />
                                <input
                                  value={option}
                                  onChange={(event) =>
                                    update(question.id, {
                                      options: question.options.map((value, i) =>
                                        i === optionIndex
                                          ? event.target.value
                                          : value,
                                      ),
                                    })
                                  }
                                  className='w-full! rounded-lg! border! border-transparent! bg-white! px-2! py-1.5! text-sm! text-slate-900! outline-none transition focus:border-[#2660A4]!'
                                  placeholder={`Option ${String.fromCharCode(
                                    65 + optionIndex,
                                  )}`}
                                />
                                <button
                                  type='button'
                                  onClick={() =>
                                    update(question.id, {
                                      options: question.options.filter(
                                        (_, i) => i !== optionIndex,
                                      ),
                                      answers: question.answers
                                        .filter((index) => index !== optionIndex)
                                        .map((index) =>
                                          index > optionIndex ? index - 1 : index,
                                        ),
                                    })
                                  }
                                  disabled={question.options.length <= 2}
                                  className='shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30'
                                  aria-label='Remove option'
                                >
                                  <MdDeleteOutline size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {question.options.length < 8 && (
                            <button
                              type='button'
                              onClick={() =>
                                update(question.id, {
                                  options: [...question.options, ""],
                                })
                              }
                              className='mt-2 inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50'
                            >
                              <MdAdd size={13} /> Add option
                            </button>
                          )}
                        </div>

                        <div>
                          <label className={LABEL}>Explanation (optional)</label>
                          <textarea
                            value={question.explanation}
                            onChange={(event) =>
                              update(question.id, {
                                explanation: event.target.value,
                              })
                            }
                            rows={2}
                            className={`${INPUT} resize-y`}
                          />
                        </div>

                        <div>
                          <label className={LABEL}>Question image (optional)</label>
                          <div className='flex flex-wrap items-center gap-2'>
                            <input
                              value={question.imageUrl}
                              onChange={(event) =>
                                update(question.id, {
                                  imageUrl: event.target.value,
                                })
                              }
                              className={`${INPUT} flex-1`}
                              placeholder='https://… or upload'
                            />
                            <input
                              ref={(element) => {
                                fileInputs.current[question.id] = element;
                              }}
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) void uploadImage(question, file);
                                event.target.value = "";
                              }}
                            />
                            <button
                              type='button'
                              onClick={() => fileInputs.current[question.id]?.click()}
                              disabled={uploadingId === question.id}
                              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50'
                            >
                              <MdOutlineAddPhotoAlternate size={14} />
                              {uploadingId === question.id ? "Uploading…" : "Upload"}
                            </button>
                            {question.imageUrl && (
                              <button
                                type='button'
                                onClick={() => update(question.id, { imageUrl: "" })}
                                className='rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600'
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          {question.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={question.imageUrl}
                              alt=''
                              className='mt-2 max-h-40 rounded-xl border border-slate-200 object-contain'
                            />
                          )}
                        </div>

                        {issues.length > 0 && (
                          <ul className='space-y-1 rounded-xl bg-amber-50/70 px-4 py-2.5 text-[11px] leading-5 text-amber-800'>
                            {issues.map((issue) => (
                              <li key={issue}>• {issue}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex shrink-0 flex-col gap-1'>
                    <button
                      type='button'
                      onClick={() => duplicate(question)}
                      className='rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
                      aria-label='Duplicate question'
                    >
                      <MdOutlineContentCopy size={15} />
                    </button>
                    <button
                      type='button'
                      onClick={() =>
                        setQuestions((previous) =>
                          previous.filter((item) => item.id !== question.id),
                        )
                      }
                      className='rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600'
                      aria-label='Delete question'
                    >
                      <MdDeleteOutline size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {questions.length > 0 && (
            <button
              type='button'
              onClick={addQuestion}
              className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-600 transition hover:border-[#2660A4]/40 hover:bg-[#2660A4]/5 hover:text-[#2660A4]'
            >
              <MdAdd size={17} /> Add another question
            </button>
          )}
        </div>
      )}
    </div>
  );
}
