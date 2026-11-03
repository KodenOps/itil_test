import { notFound, redirect } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import EnrollmentGate from "@/app/components/EnrollmentGate";
import CourseSections from "@/app/components/CourseSections";
import { checkCourseAccess } from "@/lib/content/courses";
import { getCourseSections } from "@/lib/content/cms";
import {
  MdArrowBack,
  MdOutlineMenuBook,
  MdOutlineSchedule,
  MdOutlineSignalCellularAlt,
} from "react-icons/md";

export const dynamic = "force-dynamic";

export default async function CourseContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const access = await checkCourseAccess(slug);
  const next = `/courses/${slug}`;

  if (!access.viewer) {
    redirect(`/login?callbackUrl=${encodeURIComponent(next)}`);
  }

  if (!access.course) {
    notFound();
  }

  const { data: publication } = await access.viewer.supabase
    .from("courses")
    .select("is_published")
    .eq("slug", slug)
    .maybeSingle<{ is_published: boolean }>();

  if (!publication?.is_published && access.viewer.profile.role !== "admin") {
    notFound();
  }

  if (!access.enrolled && access.viewer.profile.role !== "admin") {
    return <EnrollmentGate course={access.course} next={next} />;
  }

  const sections = await getCourseSections(slug);
  const course = access.course;

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden mt-20'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_60%,_#eef2f7_100%)]' />

        <div className='mx-auto w-full max-w-6xl px-6 py-10 md:px-8'>
          <a
            href='/'
            className='inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2660A4]'
          >
            <MdArrowBack size={16} /> Back to the catalogue
          </a>

          <header
            className='relative mt-5 overflow-hidden rounded-[32px] px-7 py-9 text-white shadow-xl shadow-slate-300/50 sm:px-10 sm:py-12'
            style={{
              backgroundImage: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
            }}
          >
            <span className='pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl' />
            <span className='pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-black/10 blur-3xl' />

            <div className='relative'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]'>
                  {course.track}
                </span>
                <span className='rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85'>
                  {course.level}
                </span>
              </div>

              <h1 className='mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl'>
                {course.title}
              </h1>
              <p className='mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base'>
                {course.summary}
              </p>

              <div className='mt-6 flex flex-wrap gap-3 text-xs font-semibold text-white/85'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5'>
                  <MdOutlineMenuBook size={14} />
                  {sections.length} section{sections.length === 1 ? "" : "s"}
                </span>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5'>
                  <MdOutlineSchedule size={14} />
                  {course.estimatedHours ?? 12}h path
                </span>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5'>
                  <MdOutlineSignalCellularAlt size={14} />
                  {course.level}
                </span>
              </div>
            </div>
          </header>

          <div className='mt-8 grid gap-8 lg:grid-cols-[240px_1fr]'>
            <aside className='hidden lg:block'>
              <div className='sticky top-28 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'>
                <p className='px-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400'>
                  On this page
                </p>
                <nav className='mt-3 space-y-1'>
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#section-${section.id}`}
                      className='flex items-start gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0E2F5E]'
                    >
                      <span className='mt-0.5 text-[10px] font-black text-slate-400'>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className='leading-5'>{section.title}</span>
                    </a>
                  ))}
                  {sections.length === 0 && (
                    <p className='px-2 py-2 text-xs text-slate-400'>
                      Content is being prepared.
                    </p>
                  )}
                </nav>
              </div>
            </aside>

            <div className='min-w-0'>
              {sections.length > 0 ? (
                <CourseSections sections={sections} />
              ) : (
                <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center'>
                  <p className='text-lg font-black text-slate-900'>
                    This track is being written
                  </p>
                  <p className='mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600'>
                    An administrator has published the course but has not added
                    its sections yet. Check back soon — the catalogue page and
                    any assessment bank for this track are already available.
                  </p>
                  <a
                    href='/'
                    className='mt-5 inline-flex rounded-full bg-[#0E2F5E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173f73]'
                  >
                    Explore other tracks
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
