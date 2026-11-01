"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCourseRequestStatus } from "./actions";
import {
  COURSE_REQUEST_STATUSES,
  COURSE_REQUEST_STATUS_LABELS,
  type CourseRequestStatus,
} from "@/types/app";

export default function AdminCourseRequestStatus({
  requestId,
  status,
}: {
  requestId: string;
  status: CourseRequestStatus;
}) {
  const [value, setValue] = useState<CourseRequestStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = (next: CourseRequestStatus) => {
    const previous = value;
    setValue(next);
    setError(null);

    startTransition(async () => {
      const result = await setCourseRequestStatus(requestId, next);

      if (!result.ok) {
        setValue(previous);
        setError(result.message ?? "Could not update the request.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className='flex flex-col gap-1'>
      <select
        value={value}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as CourseRequestStatus)}
        aria-label='Request status'
        className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#2660A4] disabled:opacity-60'
      >
        {COURSE_REQUEST_STATUSES.map((option) => (
          <option key={option} value={option}>
            {COURSE_REQUEST_STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      {error && <span className='text-[11px] text-red-600'>{error}</span>}
    </div>
  );
}
