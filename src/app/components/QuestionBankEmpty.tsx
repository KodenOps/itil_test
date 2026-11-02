import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function QuestionBankEmpty({
  courseTitle,
  backHref = "/",
}: {
  courseTitle: string;
  backHref?: string;
}) {
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='mx-auto mt-24 w-full max-w-3xl px-6 py-16'>
        <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
            {courseTitle}
          </p>
          <h1 className='mt-3 text-2xl font-black text-slate-900'>
            No exam questions for this track yet.
          </h1>
          <p className='mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600'>
            Maybe the recap and key-concept videos are enough for now. Sample
            questions live in Supabase, and an administrator can push every
            bank from the legacy data files with the{" "}
            <span className='font-semibold text-slate-900'>
              Sync content
            </span>{" "}
            button in the admin dashboard. If the source file never shipped an
            answer key, its questions stay out of assessments until answers are
            added.
          </p>
          <a
            href={backHref}
            className='mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800'
          >
            Back to the recap
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
