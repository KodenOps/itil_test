import { Suspense } from "react";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden mt-20'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(31,138,112,0.10),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_60%,_#eef2f7_100%)]' />

        <div className='mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>
            <Suspense
              fallback={
                <div className='rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm'>
                  Loading…
                </div>
              }
            >
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
