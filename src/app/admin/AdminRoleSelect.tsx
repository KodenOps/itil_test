"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "./actions";
import { ROLE_LABELS, type AppRole } from "@/types/app";

const ROLES: AppRole[] = ["learner", "instructor", "admin"];

export default function AdminRoleSelect({
  userId,
  role,
  disabled = false,
}: {
  userId: string;
  role: AppRole;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<AppRole>(role);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = (next: AppRole) => {
    const previous = value;
    setValue(next);
    setError(null);

    startTransition(async () => {
      const result = await setUserRole(userId, next);

      if (!result.ok) {
        setValue(previous);
        setError(result.message ?? "Could not update the role.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className='flex flex-col gap-1'>
      <select
        value={value}
        disabled={disabled || isPending}
        onChange={(event) => onChange(event.target.value as AppRole)}
        className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#2660A4] disabled:opacity-60'
      >
        {ROLES.map((option) => (
          <option key={option} value={option}>
            {ROLE_LABELS[option]}
          </option>
        ))}
      </select>
      {error && <span className='text-[11px] text-red-600'>{error}</span>}
    </div>
  );
}
