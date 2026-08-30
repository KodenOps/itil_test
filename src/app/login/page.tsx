import { Suspense } from "react";
import LoginForm from "@/app/login/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-white px-4'>
          <div className='w-full max-w-sm rounded-3xl border border-slate-200 p-8 text-center shadow-sm'>
            <h1 className='text-2xl font-black text-slate-900'>Sign in</h1>

            <p className='mt-2 text-sm text-slate-500'>Loading…</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
