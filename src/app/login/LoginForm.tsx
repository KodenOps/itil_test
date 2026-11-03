"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { safeRedirectPath } from "@/lib/security/redirect";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { refresh } = useAppStore();

  // Never hand a raw query value to window.location: `javascript:` and
  // protocol-relative URLs would execute or redirect off-site.
  const callbackUrl = safeRedirectPath(searchParams.get("callbackUrl"), "/");
  const urlError = searchParams.get("error");
  const resetDone = searchParams.get("reset") === "1";

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrorMessage(null);
    setNotice(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setNotice(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      setIsLoading(false);
      return;
    }

    if (mode === "signup" && password.length < 8) {
      setErrorMessage("Use at least 8 characters for your password.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || email.split("@")[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            callbackUrl,
          )}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // With "Confirm email" enabled Supabase returns a user but no session.
      if (!data.session) {
        setNotice(
          "Account created. Check your inbox to confirm your email, then sign in to start preparing. You begin as a Learner.",
        );
        form.reset();
        setMode("signin");
        setIsLoading(false);
        return;
      }

      await refresh();
      window.location.assign(callbackUrl);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        error.message.toLowerCase().includes("invalid login")
          ? "That email and password combination does not match an account."
          : error.message,
      );
      setIsLoading(false);
      return;
    }

    await refresh();
    window.location.assign(callbackUrl);
  };

  return (
    <div className='right md:flex-3 flex-1 md:pt-14 pt-0 md:px-20 px-6 overflow-y-auto h-full'>
      <div className='mb-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/70'>
        <button
          type='button'
          onClick={() => switchMode("signin")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            mode === "signin"
              ? "bg-[#0E2F5E] text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sign In
        </button>
        <button
          type='button'
          onClick={() => switchMode("signup")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-[#0E2F5E] text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Create Account
        </button>
      </div>

      <h3 className='text-3xl text-[#0E2F5E] text-center md:text-left font-bold'>
        {mode === "signin" ? "Sign in" : "Create your account"}
      </h3>
      <p className='pt-2 pb-4 text-xl text-center md:text-left text-[#5A5C78]'>
        {mode === "signin"
          ? "Pick up where you left off — recaps, key-concept videos and exam-format practice."
          : "One account keeps your recaps, videos and exam attempts together. Every new account starts as a Learner."}
      </p>

      <form className='w-full' onSubmit={handleSubmit}>
        {mode === "signup" && (
          <>
            <label
              htmlFor='fullName'
              className='text-sm font-medium text-[#0E2F5E] md:block hidden'
            >
              Full Name
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              autoComplete='name'
              placeholder='Full name'
              className='w-full mt-2'
            />
          </>
        )}

        <label
          htmlFor='email'
          className='text-sm font-medium text-[#0E2F5E] md:block hidden'
        >
          Email Address
        </label>
        <input
          type='email'
          id='email'
          name='email'
          autoComplete='email'
          placeholder='Email Address'
          className='w-full mt-2'
          required
        />

        <label
          htmlFor='password'
          className='text-sm font-medium text-[#0E2F5E] md:block hidden'
        >
          Password
        </label>
        <input
          type='password'
          id='password'
          name='password'
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder='Password'
          className='w-full mt-2'
          minLength={mode === "signup" ? 8 : undefined}
          required
        />

        {mode === "signin" && (
          <div className='-mt-2 mb-4 flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm font-semibold text-[#2660A4] underline-offset-4 hover:underline'
            >
              Forgot password?
            </Link>
          </div>
        )}

        {resetDone && (
          <p className='mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800'>
            Password updated. Sign in with your new password.
          </p>
        )}

        {urlError && (
          <p className='mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700'>
            {urlError === "access_denied"
              ? "That sign-in link is no longer valid. Please sign in again."
              : "Something went wrong signing in. Please try again."}
          </p>
        )}

        {errorMessage && (
          <p className='mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700'>
            {errorMessage}
          </p>
        )}

        {notice && (
          <p className='mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800'>
            {notice}
          </p>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full mt-2 py-4 bg-[#0E2F5E] text-white rounded-md disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoading
            ? "Working…"
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      <h3 className='text-center mt-8 pb-10 text-slate-700'>
        {mode === "signin" ? "New to CertifyHub?" : "Already registered?"}{" "}
        <button
          type='button'
          onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
          className='font-bold text-[#0D2C5D] underline-offset-4 hover:underline'
        >
          {mode === "signin" ? "Create an account" : "Sign in instead"}
        </button>
      </h3>
    </div>
  );
}
