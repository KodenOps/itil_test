"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          callbackUrl,
        )}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4'>
      <div className='w-full max-w-sm rounded-3xl border border-slate-200 p-8 text-center shadow-sm'>
        <h1 className='text-2xl font-black text-slate-900'>Sign in</h1>

        <p className='mt-2 text-sm text-slate-500'>
          Sign in with your Google account to access the course.
        </p>

        {(errorMessage || urlError) && (
          <p className='mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700'>
            {urlError === "access_denied"
              ? "That Google account isn't authorized for this site."
              : errorMessage ||
                "Something went wrong signing in. Please try again."}
          </p>
        )}

        <button
          type='button'
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className='mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60'
        >
          <svg width='18' height='18' viewBox='0 0 48 48' aria-hidden='true'>
            <path
              fill='#FFC107'
              d='M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z'
            />

            <path
              fill='#FF3D00'
              d='m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z'
            />

            <path
              fill='#4CAF50'
              d='M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8H5.4v6.2C9 39.7 15.9 44 24 44z'
            />

            <path
              fill='#1976D2'
              d='M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.6 6.8l6.6 5.6C41.4 36.9 44 31 44 24c0-1.3-.1-2.7-.4-3.5z'
            />
          </svg>

          {isLoading ? "Redirecting to Google…" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
