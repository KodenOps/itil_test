"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDisplayName } from "@/app/actions/profile";
import { useAppStore } from "@/store/app-store";

export default function ProfileNameForm({ name }: { name: string }) {
  const [value, setValue] = useState(name);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setFullName } = useAppStore();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("fullName", value);

    startTransition(async () => {
      const result = await updateDisplayName(formData);

      if (result.ok) {
        setFullName(value.trim());
        setMessage({ tone: "ok", text: "Display name updated." });
        router.refresh();
      } else {
        setMessage({
          tone: "error",
          text: result.message ?? "Could not save your name.",
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className='space-y-3'>
      <label
        htmlFor='fullName'
        className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-500'
      >
        Display name
      </label>
      <div className='flex flex-col gap-2 sm:flex-row'>
        <input
          id='fullName'
          name='fullName'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={80}
          className='w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2660A4] sm:flex-1'
        />
        <button
          type='submit'
          disabled={isPending || value.trim().length === 0}
          className='w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto'
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.tone === "ok" ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
