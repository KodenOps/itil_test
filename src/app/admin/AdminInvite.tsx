"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { inviteUser, revokeInvite } from "./actions";
import { ROLE_LABELS, type AppRole } from "@/types/app";

const ROLES: AppRole[] = ["instructor", "admin"];

export function AdminInviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("instructor");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await inviteUser({ email, role });

      if (!result.ok) {
        setMessage({ tone: "error", text: result.message ?? "Failed." });
        return;
      }

      setMessage({
        tone: "ok",
        text: `${email.trim().toLowerCase()} can register as ${ROLE_LABELS[role]}.`,
      });
      setEmail("");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className='space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
    >
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
          Invite a member
        </p>
        <h3 className='mt-2 text-xl font-black text-slate-900'>
          Grant instructor or admin access
        </h3>
        <p className='mt-1 text-sm text-slate-600'>
          The role is applied automatically when that address registers.
        </p>
      </div>

      <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
        <input
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='person@example.com'
          required
          className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2660A4]'
          style={{ padding: "12px 16px" }}
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as AppRole)}
          className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#2660A4]'
        >
          {ROLES.map((option) => (
            <option key={option} value={option}>
              {ROLE_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-2.5 text-sm ${
            message.tone === "ok"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending || !email.trim()}
        className='w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50'
      >
        {isPending ? "Sending invitation…" : "Create invitation"}
      </button>
    </form>
  );
}

export function AdminRevokeButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className='flex flex-col items-end gap-1'>
      <button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await revokeInvite(id);

            if (!result.ok) {
              setError(result.message ?? "Failed.");
              return;
            }

            router.refresh();
          })
        }
        className='rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50'
      >
        {isPending ? "Revoking…" : "Revoke"}
      </button>
      {error && <span className='text-[11px] text-red-600'>{error}</span>}
    </div>
  );
}
