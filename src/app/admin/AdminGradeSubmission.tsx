"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gradeAssessmentSubmission } from "./actions";

export default function AdminGradeSubmission({
  submissionId,
  score,
  graded,
}: {
  submissionId: string;
  score: number | null;
  graded: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(
    score === null ? "" : String(Math.round(score * 10) / 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setError(null);

    startTransition(async () => {
      const result = await gradeAssessmentSubmission(submissionId, value);

      if (!result.ok) {
        setError(result.message ?? "Could not save that score.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className='flex flex-col items-end gap-1'>
      <div className='flex items-center gap-2'>
        <label className='text-[11px] font-semibold text-slate-500' htmlFor={`score-${submissionId}`}>
          Score %
        </label>
        <input
          id={`score-${submissionId}`}
          type='number'
          min={0}
          max={100}
          step='0.1'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className='w-20 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#2660A4]'
        />
        <button
          type='button'
          onClick={save}
          disabled={isPending || !value.trim()}
          className='rounded-full bg-[#2660A4] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
        >
          {isPending ? "Saving…" : graded ? "Update" : "Save score"}
        </button>
      </div>
      {error && <span className='text-[11px] text-red-600'>{error}</span>}
    </div>
  );
}
