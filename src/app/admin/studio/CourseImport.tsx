"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import {
  MdCheckCircle,
  MdContentCopy,
  MdErrorOutline,
  MdFileUpload,
  MdOutlineDataObject,
  MdRestore,
} from "react-icons/md";
import { importCourseBundle } from "./import-actions";
import { courseJsonNotes, sampleCourseJson } from "./sample-course";

export default function CourseImport() {
  const [json, setJson] = useState(sampleCourseJson);
  const [publish, setPublish] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [warnings, setWarnings] = useState<string[]>([]);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = async (file: File) => {
    setMessage(null);

    if (!/\.json$/i.test(file.name) && file.type !== "application/json") {
      setMessage({ tone: "error", text: "That is not a .json file." });
      return;
    }

    try {
      const content = await file.text();
      JSON.parse(content);
      setJson(content);
      setMessage({ tone: "ok", text: `Loaded ${file.name}. Check it, then import.` });
    } catch {
      setMessage({ tone: "error", text: "That file is not valid JSON." });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) void readFile(file);
  };

  const handleImport = () => {
    setMessage(null);
    setWarnings([]);
    setSavedSlug(null);

    startTransition(async () => {
      const result = await importCourseBundle(json, { publish });

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message });
        return;
      }

      setSavedSlug(result.slug);
      setWarnings(result.warnings);
      setMessage({
        tone: "ok",
        text: `${publish ? "Published" : "Saved as a draft"} — ${result.sections} section${
          result.sections === 1 ? "" : "s"
        }, ${result.questions} question${result.questions === 1 ? "" : "s"}.`,
      });
    });
  };

  return (
    <div className='grid gap-6 xl:grid-cols-[1.4fr_0.6fr]'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-7'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-slate-500'>
            <MdOutlineDataObject size={18} />
            <p className='text-xs font-bold uppercase tracking-[0.28em]'>
              Course JSON
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setJson(sampleCourseJson)}
              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4]'
            >
              <MdRestore size={14} /> Load sample
            </button>
            <button
              type='button'
              onClick={() => void navigator.clipboard?.writeText(json)}
              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300'
            >
              <MdContentCopy size={14} /> Copy
            </button>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800'
            >
              <MdFileUpload size={14} /> Upload .json
            </button>
            <input
              ref={fileRef}
              type='file'
              accept='application/json,.json'
              className='hidden'
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void readFile(file);
                event.target.value = "";
              }}
            />
          </div>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-5 rounded-2xl border-2 border-dashed p-1 transition ${
            dragging ? "border-[#2660A4] bg-[#2660A4]/5" : "border-transparent"
          }`}
        >
          <textarea
            value={json}
            onChange={(event) => setJson(event.target.value)}
            rows={26}
            spellCheck={false}
            className='w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 font-mono text-[12.5px] leading-6 text-slate-800 outline-none transition focus:border-[#2660A4] focus:bg-white'
          />
          <p className='px-2 pb-1 pt-2 text-center text-xs font-semibold text-slate-400'>
            Drop a .json file anywhere in this box, or paste the JSON directly.
          </p>
        </div>

        {message && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
              message.tone === "ok"
                ? "bg-[#1F8A70]/10 text-[#166b56]"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.tone === "ok" ? (
              <MdCheckCircle size={18} className='mt-0.5 shrink-0' />
            ) : (
              <MdErrorOutline size={18} className='mt-0.5 shrink-0' />
            )}
            <div>
              <p>{message.text}</p>
              {warnings.length > 0 && (
                <ul className='mt-2 space-y-1 text-xs font-medium'>
                  {warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              )}
              {savedSlug && (
                <Link
                  href={`/admin?view=questions&course=${savedSlug}`}
                  className='mt-2 inline-flex text-xs font-bold underline underline-offset-4'
                >
                  Add more questions to this course →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
          <label className='inline-flex items-center gap-2 text-sm font-semibold text-slate-600'>
            <input
              type='checkbox'
              checked={publish}
              onChange={(event) => setPublish(event.target.checked)}
              className='h-4 w-4 accent-[#2660A4]'
            />
            Publish to the catalogue now
          </label>

          <button
            type='button'
            onClick={handleImport}
            disabled={pending}
            className='inline-flex items-center gap-2 rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
          >
            <MdFileUpload size={15} />
            {pending ? "Importing…" : publish ? "Import & publish" : "Import as draft"}
          </button>
        </div>
      </div>

      <aside className='space-y-4'>
        <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-[0.28em] text-slate-400'>
            The contract
          </p>
          <ul className='mt-3 space-y-2.5 text-sm leading-6 text-slate-600'>
            {courseJsonNotes.map((note) => (
              <li key={note} className='flex gap-2'>
                <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2660A4]' />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className='rounded-[28px] border border-slate-900 bg-slate-900 p-5 text-white'>
          <p className='text-xs font-bold uppercase tracking-[0.28em] text-white/60'>
            Drafts
          </p>
          <p className='mt-2 text-sm leading-6 text-white/80'>
            Importing without publishing keeps the course out of the catalogue.
            Re-import the same JSON with the same slug to publish it later — it
            updates in place instead of creating a duplicate.
          </p>
        </div>
      </aside>
    </div>
  );
}
