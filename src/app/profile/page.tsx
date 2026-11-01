import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { requireViewer } from "@/lib/supabase/profile";
import { listEnrollments } from "@/lib/content/courses";
import { ROLE_LABELS, ENROLLMENT_LIMIT } from "@/types/app";
import ProfileNameForm from "./ProfileNameForm";
import ProfileCourseList from "./ProfileCourseList";
import {
  MdOutlineSchool,
  MdOutlineInsights,
  MdOutlineEmojiEvents,
  MdOutlineHistory,
} from "react-icons/md";

export const dynamic = "force-dynamic";

const MODE_LABELS: Record<string, string> = {
  exam: "Timed exam",
  practice: "Practice run",
  "practice-index": "Practice run",
  "exam-index": "Timed exam",
  quiz: "Quiz",
  enrollment: "Enrollment",
  signup: "Account",
};

export default async function ProfilePage() {
  const viewer = await requireViewer();
  const { supabase, userId, profile } = viewer;

  const [enrollments, attemptsResult, eventsResult] = await Promise.all([
    listEnrollments(),
    supabase
      .from("quiz_attempts")
      .select("id, course_slug, mode, question_count, correct_count, score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("activity_events")
      .select("id, event_type, course_slug, summary, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const attempts = attemptsResult.data ?? [];
  const events = eventsResult.data ?? [];

  const activeEnrollments = enrollments.filter((e) => e.status === "active");
  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce((total, attempt) => total + Number(attempt.score), 0) /
          attempts.length,
      )
    : 0;
  const bestScore = attempts.length
    ? Math.round(Math.max(...attempts.map((attempt) => Number(attempt.score))))
    : 0;

  const displayName =
    profile.fullName || profile.email.split("@")[0] || "Learner";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const joined = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden mt-20'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />

        <section className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10 lg:px-12'>
          {/* Identity card */}
          <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/70'>
              <div className='absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-[#2660A4]/10 blur-3xl' />
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2660A4] to-[#26a465] text-2xl font-black text-white shadow-lg shadow-slate-300/60'>
                    {initials}
                  </div>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                      {ROLE_LABELS[profile.role]} profile
                    </p>
                    <h1 className='mt-1 text-3xl font-black text-slate-900'>
                      {displayName}
                    </h1>
                    <p className='text-sm text-slate-500'>{profile.email}</p>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2'>
                  <span className='rounded-full bg-[#2660A4]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#2660A4]'>
                    {ROLE_LABELS[profile.role]}
                  </span>
                  <p className='text-xs text-slate-500'>Joined {joined}</p>
                  {profile.role === "admin" && (
                    <Link
                      href='/admin'
                      className='text-xs font-bold text-slate-900 underline-offset-4 hover:underline'
                    >
                      Open admin dashboard →
                    </Link>
                  )}
                </div>
              </div>

              <div className='mt-7 border-t border-slate-100 pt-5'>
                <ProfileNameForm name={profile.fullName ?? displayName} />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <StatCard
                icon={<MdOutlineSchool size={18} />}
                label='Active courses'
                value={`${activeEnrollments.length}/${ENROLLMENT_LIMIT}`}
                hint={
                  activeEnrollments.length >= ENROLLMENT_LIMIT
                    ? "Seats full"
                    : "Seats available"
                }
              />
              <StatCard
                icon={<MdOutlineHistory size={18} />}
                label='Assessments taken'
                value={`${attempts.length}`}
                hint='Last 30 recorded'
              />
              <StatCard
                icon={<MdOutlineInsights size={18} />}
                label='Average score'
                value={`${averageScore}%`}
                hint='Across recent attempts'
              />
              <StatCard
                icon={<MdOutlineEmojiEvents size={18} />}
                label='Personal best'
                value={`${bestScore}%`}
                hint='Highest single attempt'
              />
            </div>
          </div>

          {/* Courses + activity */}
          <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
            <div id='courses' className='space-y-4'>
              <div className='flex items-end justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                    Your learning seats
                  </p>
                  <h2 className='mt-2 text-2xl font-black text-slate-900'>
                    Enrolled courses
                  </h2>
                </div>
                <Link
                  href='/'
                  className='rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50'
                >
                  Catalogue
                </Link>
              </div>
              <ProfileCourseList enrollments={enrollments} />

              {attempts.length > 0 && (
                <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                    Score history
                  </p>
                  <div className='mt-4 flex items-end gap-1.5'>
                    {attempts
                      .slice(0, 12)
                      .reverse()
                      .map((attempt) => (
                        <div
                          key={attempt.id}
                          className='group relative flex-1'
                          title={`${attempt.score}% · ${attempt.course_slug ?? "general"}`}
                        >
                          <div
                            className='w-full rounded-t-md bg-gradient-to-t from-[#2660A4] to-[#26a465]'
                            style={{
                              height: `${Math.max(6, Number(attempt.score)) * 0.8}px`,
                            }}
                          />
                        </div>
                      ))}
                  </div>
                  <div className='mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                    <span>Oldest</span>
                    <span>Latest</span>
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                  Learning activity
                </p>
                <h2 className='mt-2 text-2xl font-black text-slate-900'>
                  Recent trail
                </h2>
              </div>

              <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
                {events.length === 0 ? (
                  <p className='text-sm text-slate-600'>
                    Nothing here yet. Enroll in a course and take an assessment
                    to start your trail.
                  </p>
                ) : (
                  <ol className='space-y-4'>
                    {events.map((event) => (
                      <li key={event.id} className='flex gap-3'>
                        <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2660A4]' />
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-slate-900'>
                            {event.summary}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {MODE_LABELS[event.event_type] ?? event.event_type}
                            {event.course_slug ? ` · ${event.course_slug}` : ""}
                            {" · "}
                            {new Date(event.created_at).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
      <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600'>
        {icon}
      </span>
      <p className='mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
        {label}
      </p>
      <p className='mt-1 text-3xl font-black text-slate-900'>{value}</p>
      <p className='mt-1 text-xs text-slate-500'>{hint}</p>
    </div>
  );
}
