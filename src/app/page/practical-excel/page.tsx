"use client";

import Footer from "@/app/components/Footer";
import NavBar from "@/app/components/NavBar";
import React, { useRef, useState } from "react";
import {
  MdOutlineTimer,
  MdOutlineFileDownload,
  MdOutlineCloudUpload,
  MdCheckCircle,
  MdErrorOutline,
  MdOutlineDescription,
} from "react-icons/md";

// ─── Config ──────────────────────────────────────────────────────────────────
// Point this at your actual workbook, e.g. a file placed in /public/assessments/
const WORKBOOK_DOWNLOAD_URL = "/Excel_task_beginner.xlsx";
const WORKBOOK_FILENAME = "Excel_task_beginner.xlsx";

const ACCENT = "#217346";
const ACCENT_GRADIENT = "from-[#217346] to-[#33C481]";

const ESTIMATED_TIME = "10 minutes";
const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_EXTENSIONS = [".xlsx", ".xlsm"];

const instructions: string[] = [
  "Download the workbook below — it contains the raw data and a tab for the solution",
  "Work through all 8 Tasks directly inside the 'WRITE HERE' sheet. Do not rename the sheet tabs.",
  "Save your work regularly. When finished, save the file with your name in the filename, e.g. Jane_Doe_Assessment.xlsx.",
  "Return to this page and submit the completed file using the form at the bottom, along with your name and email.",
  "You'll receive a confirmation once your submission is received. Results are currently graded manually, so allow a few minutes for feedback.",
];

const questions: string[] = [
  "Add a column named AMOUNT_SOLD_PER_PRODUCT and calculate the quantity sold for each product this month and the revenue earned for that product.",
  "Compute the number of cartons remaining (Closing Stock) at the end of each day.",
  "Add a BUYING_COST column that calculates the total purchase cost for each product.",
  "Add a PROFIT/LOSS column showing profit or loss per product; note some items may still show a loss if not all purchased stock has been sold.",
  "Calculate the total revenue generated this month.",
  "Calculate the total amount spent to purchase all items in the store.",
  "Sum the PROFIT/LOSS column to determine whether the month ended in an overall profit or loss (a negative total indicates a loss).",
  "Create a STOCK_STATUS column that flags items as LOW-IN-STOCK when Closing Stock is less than 50, otherwise mark them IN-STOCK.",
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PracticalAssessmentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateFile = (f: File): string | null => {
    const lower = f.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    if (!hasValidExt) {
      return `File must be one of: ${ACCEPTED_EXTENSIONS.join(", ")}`;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setErrorMessage(null);
    if (!f) {
      setFile(null);
      return;
    }
    const validationError = validateFile(f);
    if (validationError) {
      setErrorMessage(validationError);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!file) {
      setErrorMessage("Please attach your completed workbook.");
      return;
    }

    setStatus("submitting");
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("file", file);

      const res = await fetch("/api/submit-assessment", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Submission failed. Please try again.");
      }

      setStatus("success");
      resetForm();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='mx-auto max-w-4xl px-4 md:px-8'>
        {/* Hero */}
        <div className='relative overflow-hidden rounded-3xl my-8 p-8 md:p-12 border border-slate-200'>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${ACCENT_GRADIENT} opacity-10`}
          />
          <div
            className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20'
            style={{ backgroundColor: ACCENT }}
          />
          <div className='relative'>
            <div
              className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white mb-4'
              style={{ backgroundColor: ACCENT }}
            >
              Practical Assessment
            </div>
            <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
              Excel Practical Assessment
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600'>
              Download the workbook, complete all 8 Tasks at your own pace, then
              upload your finished file below for grading.
            </p>
            <div className='mt-6 flex flex-wrap items-center gap-4'>
              <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700'>
                <MdOutlineTimer size={18} />
                Estimated time: {ESTIMATED_TIME}
              </span>
              <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700'>
                <MdOutlineDescription size={18} />8 Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <section className='mb-12'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>
            Instructions
          </h2>
          <ol className='space-y-3'>
            {instructions.map((step, i) => (
              <li key={i} className='flex items-start gap-3'>
                <span
                  className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white'
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
                <span className='text-sm md:text-base leading-7 text-slate-600'>
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <a
            href={WORKBOOK_DOWNLOAD_URL}
            download={WORKBOOK_FILENAME}
            className='mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
            style={{ backgroundColor: ACCENT }}
          >
            <MdOutlineFileDownload size={20} />
            Download the assessment workbook
          </a>
        </section>

        {/* Questions */}
        <section className='mb-12'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>The 8 Tasks</h2>
          <p className='text-sm text-slate-500 mb-5'>
            Find below everything you are meant to do in the workbook. Each task
            is clearly labeled in the "Introduction" sheet of the workbook.
          </p>
          <div className='space-y-2.5'>
            {questions.map((q, i) => (
              <div
                key={i}
                className='flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4'
              >
                <span
                  className='text-xs font-mono font-bold shrink-0 opacity-60 mt-0.5'
                  style={{ color: ACCENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className='text-sm md:text-base leading-6 text-slate-700'>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Submission form */}
        <section className='mb-24'>
          <h2 className='text-xl font-bold text-slate-900 mb-2'>
            Submit your completed workbook
          </h2>
          <p className='text-sm text-slate-500 mb-6'>
            Your submission is graded manually — you'll hear back by email once
            it's reviewed.
          </p>

          {status === "success" ? (
            <div className='rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center'>
              <MdCheckCircle
                size={40}
                className='mx-auto text-emerald-600 mb-3'
              />
              <h3 className='text-lg font-bold text-emerald-900'>
                Submission received
              </h3>
              <p className='mt-2 text-sm text-emerald-800'>
                Thanks — your workbook has been sent in for grading. We'll
                follow up by email with your results.
              </p>
              <button
                type='button'
                onClick={() => setStatus("idle")}
                className='mt-5 rounded-full border border-emerald-300 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100'
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className='rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-5'
            >
              <div className='grid gap-5 sm:grid-cols-2'>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    Full name
                  </label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Jane Doe'
                    className='w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    Email address
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='jane@example.com'
                    className='w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  Completed workbook
                </label>
                <label
                  htmlFor='workbook-upload'
                  className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition hover:border-slate-300 hover:bg-slate-50'
                >
                  <MdOutlineCloudUpload size={28} className='text-slate-400' />
                  {file ? (
                    <span className='text-sm font-semibold text-slate-700'>
                      {file.name}
                    </span>
                  ) : (
                    <>
                      <span className='text-sm font-semibold text-slate-600'>
                        Click to upload, or drag your file here
                      </span>
                      <span className='text-xs text-slate-400'>
                        {ACCEPTED_EXTENSIONS.join(", ")} · up to{" "}
                        {MAX_FILE_SIZE_MB}MB
                      </span>
                    </>
                  )}
                </label>
                <input
                  id='workbook-upload'
                  ref={fileInputRef}
                  type='file'
                  accept={ACCEPTED_EXTENSIONS.join(",")}
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>

              {errorMessage && (
                <div className='flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'>
                  <MdErrorOutline size={18} className='mt-0.5 shrink-0' />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type='submit'
                disabled={status === "submitting"}
                className='w-full rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60'
                style={{ backgroundColor: ACCENT }}
              >
                {status === "submitting" ? "Submitting…" : "Submit for grading"}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
