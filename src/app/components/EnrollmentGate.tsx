import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { enrollFromGate } from "@/app/actions/enroll";

type GateCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  href: string;
  accentFrom: string;
  accentTo: string;
};

/**
 * Rendered instead of an assessment when the learner has not enrolled in
 * the course that owns it. Access is decided on the server, so pasting the
 * URL directly cannot skip enrolment.
 */
export default function EnrollmentGate({
  course,
  next,
}: {
  course: GateCourse;
  next: string;
}) {
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='mx-auto mt-24 w-full max-w-4xl px-6 py-12'>
        <div className='overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70'>
          <div
            className='px-8 py-10 text-white'
            style={{
              backgroundImage: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
            }}
          >
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>
              Enrollment required
            </p>
            <h1 className='mt-3 text-3xl font-black sm:text-4xl'>
              {course.title}
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-white/90'>
              {course.summary}
            </p>
          </div>

          <div className='space-y-6 px-8 py-8'>
            <div className='rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900'>
              This assessment is only available to enrolled learners. Enroll
              now and you will be taken straight into it. You can hold two
              active courses at a time.
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <form action={enrollFromGate}>
                <input type='hidden' name='courseId' value={course.id} />
                <input type='hidden' name='next' value={next} />
                <button
                  type='submit'
                  className='rounded-full bg-[#2660A4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f4f8d]'
                >
                  Enroll and continue →
                </button>
              </form>

              <a
                href='/'
                className='rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50'
              >
                Back to catalogue
              </a>

              <a
                href='/profile'
                className='text-sm font-semibold text-[#2660A4] underline-offset-4 hover:underline'
              >
                See my courses
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
