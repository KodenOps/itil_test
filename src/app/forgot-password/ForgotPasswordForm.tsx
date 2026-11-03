"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MdArrowBack,
  MdCheckCircle,
  MdErrorOutline,
  MdLockReset,
  MdOutlineMarkEmailRead,
} from "react-icons/md";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "code" | "link" | "done";

const INPUT =
  "w-full! rounded-xl! border! border-slate-200! bg-white! px-4! py-3! text-sm! text-slate-900! mb-0! outline-none transition focus:border-[#2660A4]!";
const LABEL = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const linkFlow = searchParams.get("link") === "1";
  const linkCode = searchParams.get("code");

  // The reset email may contain either the six-digit code or the default
  // confirmation link. When the link is used, Supabase puts a recovery
  // session in the URL fragment and the user only needs a new password.
  useEffect(() => {
    if (!linkFlow) return;

    let cancelled = false;

    const check = async () => {
      try {
        const supabase = createClient();

        if (linkCode) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(linkCode);

          if (cancelled) return;

          if (exchangeError) {
            setStep("email");
            setError(
              "That reset link has expired. Request a new six-digit code below.",
            );
            return;
          }
        }

        const { data } = await supabase.auth.getSession();

        if (cancelled) return;

        if (data.session) {
          setStep("link");
        } else {
          setStep("email");
          setError(
            "That reset link has expired. Request a new six-digit code below.",
          );
        }
      } catch {
        if (!cancelled) {
          setStep("email");
          setError("Open the reset link from your email again, or request a code.");
        }
      }
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, [linkFlow, linkCode]);

  const sendCode = async () => {
    setPending(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Could not send the reset code.");
        return;
      }

      setStep("code");
      setNotice(
        data.message ??
          "If that email has an account, a six-digit reset code is on its way.",
      );
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  const requestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendCode();
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email,
          token: code,
          password,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Could not reset the password.");
        return;
      }

      setStep("done");
      setPassword("");
      setConfirm("");
      setCode("");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  const saveFromLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut({ scope: "local" });
      setStep("done");
      setPassword("");
      setConfirm("");
    } catch {
      setError("Could not update the password. Request a new reset email.");
    } finally {
      setPending(false);
    }
  };

  if (step === "done") {
    return (
      <div className='rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center'>
        <MdCheckCircle size={44} className='mx-auto text-emerald-600' />
        <h1 className='mt-3 text-2xl font-black text-emerald-950'>
          Password updated
        </h1>
        <p className='mx-auto mt-2 max-w-sm text-sm leading-7 text-emerald-800'>
          Your new password is ready. Sign in to pick up where you left off.
        </p>
        <Link
          href='/login'
          className='mt-6 inline-flex rounded-full bg-[#0E2F5E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#173f73]'
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8'>
      <div className='flex items-center gap-3'>
        <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2660A4]/10 text-[#2660A4]'>
          <MdLockReset size={23} />
        </span>
        <div>
          <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400'>
            Account recovery
          </p>
          <h1 className='text-xl font-black text-slate-900'>
            {step === "email"
              ? "Reset your password"
              : step === "code"
                ? "Enter your reset code"
                : "Choose a new password"}
          </h1>
        </div>
      </div>

      <p className='mt-4 text-sm leading-7 text-slate-600'>
        {step === "email"
          ? "We will email a six-digit code. It can only be used once and expires quickly."
          : step === "code"
            ? `Enter the code sent to ${email}, then choose a new password.`
            : "Your reset link is verified. Set a new password below."}
      </p>

      {notice && step === "code" && (
        <p className='mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800'>
          <MdOutlineMarkEmailRead size={16} className='mt-0.5 shrink-0' />
          {notice}
        </p>
      )}

      {error && (
        <p className='mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700'>
          <MdErrorOutline size={16} className='mt-0.5 shrink-0' />
          {error}
        </p>
      )}

      {step === "email" && (
        <form onSubmit={requestCode} className='mt-6'>
          <label className={LABEL} htmlFor='reset-email'>
            Email address
          </label>
          <input
            id='reset-email'
            type='email'
            autoComplete='email'
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='you@example.com'
            className={INPUT}
          />

          <button
            type='submit'
            disabled={pending}
            className='w-full! rounded-full! bg-[#2660A4]! px-5! py-3! text-sm! font-bold! text-white! transition hover:bg-[#1f4f8d]! disabled:opacity-60'
          >
            {pending ? "Sending code…" : "Send six-digit code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className='mt-6'>
          <label className={LABEL} htmlFor='reset-code'>
            Six-digit code
          </label>
          <input
            id='reset-code'
            inputMode='numeric'
            autoComplete='one-time-code'
            pattern='[0-9]{6}'
            maxLength={6}
            required
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder='000000'
            className={`${INPUT} text-center! text-2xl! font-black! tracking-[0.5em]!`}
          />

          <label className={LABEL} htmlFor='reset-password'>
            New password
          </label>
          <input
            id='reset-password'
            type='password'
            autoComplete='new-password'
            minLength={8}
            maxLength={72}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='At least 8 characters'
            className={INPUT}
          />

          <label className={LABEL} htmlFor='reset-confirm'>
            Confirm password
          </label>
          <input
            id='reset-confirm'
            type='password'
            autoComplete='new-password'
            minLength={8}
            maxLength={72}
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder='Repeat the new password'
            className={INPUT}
          />

          <button
            type='submit'
            disabled={pending}
            className='w-full! rounded-full! bg-[#0E2F5E]! px-5! py-3! text-sm! font-bold! text-white! transition hover:bg-[#173f73]! disabled:opacity-60'
          >
            {pending ? "Updating password…" : "Update password"}
          </button>

          <div className='mt-4 flex items-center justify-between gap-3 text-xs'>
            <button
              type='button'
              onClick={() => {
                setStep("email");
                setCode("");
                setPassword("");
                setConfirm("");
                setNotice(null);
                setError(null);
              }}
              className='font-bold text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline'
            >
              Use a different email
            </button>
            <button
              type='button'
              onClick={() => {
                setError(null);
                setNotice(null);
                void sendCode();
              }}
              className='font-bold text-[#2660A4] underline-offset-4 hover:underline'
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      {step === "link" && (
        <form onSubmit={saveFromLink} className='mt-6'>
          <label className={LABEL} htmlFor='link-password'>
            New password
          </label>
          <input
            id='link-password'
            type='password'
            autoComplete='new-password'
            minLength={8}
            maxLength={72}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='At least 8 characters'
            className={INPUT}
          />

          <label className={LABEL} htmlFor='link-confirm'>
            Confirm password
          </label>
          <input
            id='link-confirm'
            type='password'
            autoComplete='new-password'
            minLength={8}
            maxLength={72}
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder='Repeat the new password'
            className={INPUT}
          />

          <button
            type='submit'
            disabled={pending}
            className='w-full! rounded-full! bg-[#0E2F5E]! px-5! py-3! text-sm! font-bold! text-white! transition hover:bg-[#173f73]! disabled:opacity-60'
          >
            {pending ? "Updating password…" : "Update password"}
          </button>
        </form>
      )}

      <Link
        href='/login'
        className='mt-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-[#2660A4]'
      >
        <MdArrowBack size={14} /> Back to sign in
      </Link>
    </div>
  );
}
