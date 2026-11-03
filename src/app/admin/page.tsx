import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { requireAdmin } from "@/lib/supabase/profile";
import { listCourses } from "@/lib/content/courses";
import {
  listCourseDraftMap,
  listCoursePageMap,
  listStudioCourses,
} from "@/lib/content/cms";
import { storedFileName } from "@/lib/storage";
import {
  ROLE_LABELS,
  type AppRole,
  type CourseRequestStatus,
  type DailyActivity,
  type PlatformStats,
} from "@/types/app";
import AdminRoleSelect from "./AdminRoleSelect";
import AdminCourseRequestStatus from "./AdminCourseRequestStatus";
import AdminGradeSubmission from "./AdminGradeSubmission";
import { AdminInviteForm, AdminRevokeButton } from "./AdminInvite";
import ContentSyncButton from "./ContentSyncButton";
import CourseStudio from "./studio/CourseStudio";
import {
  MdOutlinePeopleAlt,
  MdOutlineSchool,
  MdOutlineQuiz,
  MdOutlineInsights,
  MdOutlineMailOutline,
  MdOutlineAutoGraph,
  MdOutlineLibraryBooks,
  MdOutlineHistory,
  MdOutlinePlaylistAdd,
  MdOutlineReply,
  MdOutlineGrading,
  MdOutlineFileDownload,
  MdArrowForward,
} from "react-icons/md";

export const dynamic = "force-dynamic";

type View =
  | "overview"
  | "users"
  | "invitations"
  | "requests"
  | "courses"
  | "studio"
  | "grading"
  | "activity";

const VIEWS: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users & roles" },
  { id: "invitations", label: "Invitations" },
  { id: "requests", label: "Course requests" },
  { id: "courses", label: "Courses & content" },
  { id: "studio", label: "Course studio" },
  { id: "grading", label: "Practical grading" },
  { id: "activity", label: "Learning activity" },
];

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
};

type InviteRow = {
  id: string;
  email: string;
  role: AppRole;
  status: string;
  created_at: string;
};

type EventRow = {
  id: string;
  event_type: string;
  course_slug: string | null;
  summary: string;
  created_at: string;
  user_id: string;
};

type AttemptRow = {
  id: string;
  mode: string;
  course_slug: string | null;
  question_count: number;
  correct_count: number;
  score: number;
  created_at: string;
  user_id: string;
};

type PersonRow = { id: string; email: string; full_name: string | null };

type SubmissionRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  file_path: string;
  course_slug: string | null;
  task_name: string | null;
  status: string;
  score: number | null;
  graded_at: string | null;
  created_at: string;
};

type CourseRequestRow = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  course_title: string;
  level: string;
  message: string | null;
  source: string;
  status: CourseRequestStatus;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function personLabel(profile: PersonRow | undefined, fallback = "Member") {
  if (!profile) return fallback;
  return profile.full_name?.trim() || profile.email;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const viewer = await requireAdmin();
  const { supabase, profile } = viewer;

  const params = await searchParams;
  const view: View = VIEWS.some((item) => item.id === params.view)
    ? (params.view as View)
    : "overview";

  const [
    statsResult,
    usersResult,
    invitesResult,
    eventsResult,
    attemptsResult,
    dailyResult,
    courses,
    courseRequestsResult,
    submissionsResult,
  ] = await Promise.all([
    supabase.rpc("platform_stats"),
    supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(300)
      .returns<ProfileRow[]>(),
    supabase
      .from("role_invites")
      .select("id, email, role, status, created_at")
      .order("created_at", { ascending: false })
      .limit(60)
      .returns<InviteRow[]>(),
    supabase
      .from("activity_events")
      .select(
        "id, event_type, course_slug, summary, created_at, user_id",
      )
      .order("created_at", { ascending: false })
      .limit(40)
      .returns<EventRow[]>(),
    supabase
      .from("quiz_attempts")
      .select(
        "id, mode, course_slug, question_count, correct_count, score, created_at, user_id",
      )
      .order("created_at", { ascending: false })
      .limit(40)
      .returns<AttemptRow[]>(),
    supabase.rpc("activity_daily", { days: 14 }).returns<DailyActivity[]>(),
    listCourses(),
    supabase
      .from("course_requests")
      .select(
        "id, user_id, full_name, email, course_title, level, message, source, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(150)
      .returns<CourseRequestRow[]>(),
    supabase
      .from("assessment_submissions")
      .select(
        "id, user_id, full_name, email, file_path, course_slug, task_name, status, score, graded_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(150)
      .returns<SubmissionRow[]>(),
  ]);

  const stats = (statsResult.data ?? {}) as Partial<PlatformStats>;
  const users = (usersResult.data ?? []) as ProfileRow[];
  const invites = (invitesResult.data ?? []) as InviteRow[];
  const events = (eventsResult.data ?? []) as EventRow[];
  const attempts = (attemptsResult.data ?? []) as AttemptRow[];
  const courseRequests = (courseRequestsResult.data ?? []) as CourseRequestRow[];
  const submissions = (submissionsResult.data ?? []) as SubmissionRow[];
  const pendingSubmissions = submissions.filter(
    (submission) => submission.status === "pending",
  );
  const openCourseRequests = courseRequests.filter(
    (request) => request.status === "new",
  ).length;
  const daily = ((dailyResult.data ?? []) as DailyActivity[]).map((row) => ({
    day: row.day,
    signups: Number(row.signups ?? 0),
    enrollments: Number(row.enrollments ?? 0),
    attempts: Number(row.attempts ?? 0),
  }));

  const maxDaily = Math.max(
    1,
    ...daily.map((row) => row.signups + row.enrollments + row.attempts),
  );
  const hasDailyActivity = daily.some(
    (row) => row.signups + row.enrollments + row.attempts > 0,
  );

  const personIds = [
    ...new Set([
      ...events.map((event) => event.user_id),
      ...attempts.map((attempt) => attempt.user_id),
    ]),
  ];

  const peopleResult = personIds.length
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", personIds)
        .returns<PersonRow[]>()
    : { data: [] as PersonRow[] };

  const people = new Map(
    (peopleResult.data ?? []).map((person) => [person.id, person]),
  );

  const studioData =
    view === "studio"
      ? {
          courses: await listStudioCourses(),
          pages: await listCoursePageMap(),
          drafts: await listCourseDraftMap(),
        }
      : null;

  const topCourses = [...courses].sort((a, b) => b.enrolled - a.enrolled);
  const maxEnrolled = Math.max(1, ...courses.map((course) => course.enrolled));
  const totalEnrollments = courses.reduce(
    (total, course) => total + course.enrolled,
    0,
  );

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden mt-20'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.08),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_60%,_#eef2f7_100%)]' />

        <section className='mx-auto w-full max-w-7xl px-6 pt-10 md:px-10 lg:px-12'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white'>
                Admin only
              </div>
              <h1 className='mt-4 text-4xl font-black tracking-tight sm:text-5xl'>
                Platform control room
              </h1>
              <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base'>
                Signed in as {profile.fullName || profile.email} ·{" "}
                {ROLE_LABELS[profile.role]}. Users, invitations, enrolment load
                and learning activity all live here.
              </p>
            </div>

            <Link
              href='/'
              className='flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300'
            >
              Back to catalogue
              <MdArrowForward size={16} />
            </Link>
          </div>

          <nav className='mt-8 flex flex-wrap gap-2'>
            {VIEWS.map((item) => {
              const isActive = item.id === view;
              return (
                <Link
                  key={item.id}
                  href={`/admin?view=${item.id}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>

        <section className='mx-auto w-full max-w-7xl px-6 py-8 md:px-10 lg:px-12'>
          {view === "overview" && (
            <div className='space-y-8'>
              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                <HeroCard
                  icon={<MdOutlinePeopleAlt size={20} />}
                  label='Total members'
                  value={stats.total_users ?? users.length}
                  hint={`${stats.new_users_7d ?? 0} joined this week`}
                  gradient='from-[#0E2F5E] to-[#2660A4]'
                />
                <HeroCard
                  icon={<MdOutlineInsights size={20} />}
                  label='Active learners (7d)'
                  value={stats.active_learners_7d ?? 0}
                  hint='Took at least one assessment'
                  gradient='from-[#1F8A70] to-[#39c682]'
                />
                <HeroCard
                  icon={<MdOutlineSchool size={20} />}
                  label='Enrollments'
                  value={stats.total_enrollments ?? totalEnrollments}
                  hint={`${stats.active_enrollments ?? 0} active seats`}
                  gradient='from-[#6D2E46] to-[#A24E67]'
                />
                <HeroCard
                  icon={<MdOutlineQuiz size={20} />}
                  label='Questions in bank'
                  value={stats.total_questions ?? courses.reduce((t, c) => t + c.questions, 0)}
                  hint={`${stats.total_attempts ?? 0} attempts recorded`}
                  gradient='from-[#B45309] to-[#F97316]'
                />
              </div>

              <div className='grid gap-4 lg:grid-cols-[1.55fr_0.95fr]'>
                <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                  <div className='flex flex-wrap items-end justify-between gap-3'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                        Last 14 days
                      </p>
                      <h2 className='mt-2 text-xl font-black text-slate-900'>
                        Platform pulse
                      </h2>
                    </div>
                    <div className='flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
                      <Legend colour='#2660A4' label='Signups' />
                      <Legend colour='#26a465' label='Enrollments' />
                      <Legend colour='#F97316' label='Attempts' />
                    </div>
                  </div>

                  <div className='mt-6 flex h-48 items-stretch gap-1.5'>
                    {daily.map((row) => {
                      const total = row.signups + row.enrollments + row.attempts;
                      const height = Math.max(4, (total / maxDaily) * 100);
                      return (
                        <div
                          key={row.day}
                          className='group relative flex flex-1 flex-col items-center gap-1'
                          title={`${row.day}: ${row.signups} signups · ${row.enrollments} enrollments · ${row.attempts} attempts`}
                        >
                          {/* The track has to be a definite height for the bar's
                              percentage to resolve; a plain percentage inside an
                              auto-height column collapses to 0px. */}
                          <div className='flex w-full flex-1 flex-col justify-end'>
                            <div
                              className='flex w-full flex-col justify-end overflow-hidden rounded-t-md'
                              style={{ height: `${height}%` }}
                            >
                              <div className='w-full bg-[#2660A4]' style={{ flex: row.signups || 0 }} />
                              <div className='w-full bg-[#26a465]' style={{ flex: row.enrollments || 0 }} />
                              <div className='w-full bg-[#F97316]' style={{ flex: row.attempts || 0 }} />
                            </div>
                          </div>
                          <span className='text-[9px] font-semibold text-slate-400'>
                            {new Date(row.day).getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {daily.length === 0 && (
                    <p className='mt-3 text-sm text-slate-500'>
                      No activity recorded yet.
                    </p>
                  )}
                  {daily.length > 0 && !hasDailyActivity && (
                    <p className='mt-3 text-sm text-slate-500'>
                      No signups, enrollments or attempts in the last 14 days.
                    </p>
                  )}
                  {dailyResult.error && (
                    <p className='mt-3 text-sm font-semibold text-red-600'>
                      Activity could not be loaded: {dailyResult.error.message}
                    </p>
                  )}
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <MiniStat label='Learners' value={stats.learners ?? 0} tone='#2660A4' />
                  <MiniStat label='Instructors' value={stats.instructors ?? 0} tone='#1F8A70' />
                  <MiniStat label='Admins' value={stats.admins ?? 0} tone='#6D2E46' />
                  <MiniStat
                    label='Average score'
                    value={`${Number(stats.avg_score ?? 0)}%`}
                    tone='#F97316'
                  />
                  <MiniStat label='Courses' value={stats.total_courses ?? courses.length} tone='#0E2F5E' />
                  <MiniStat
                    label='Pending invites'
                    value={stats.pending_invites ?? 0}
                    tone='#B45309'
                  />
                  <MiniStat
                    label='New course requests'
                    value={stats.pending_course_requests ?? openCourseRequests}
                    tone='#2660A4'
                  />
                </div>
              </div>

              <div className='grid gap-4 lg:grid-cols-2'>
                <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-black text-slate-900'>
                      Enrollment by course
                    </h2>
                    <span className='text-xs font-semibold uppercase tracking-wide text-slate-400'>
                      {totalEnrollments} total
                    </span>
                  </div>
                  <div className='mt-5 space-y-4'>
                    {topCourses.map((course) => (
                      <div key={course.id}>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-semibold text-slate-900'>
                            {course.title}
                          </span>
                          <span className='text-slate-500'>
                            {course.enrolled} enrolled
                          </span>
                        </div>
                        <div className='mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100'>
                          <div
                            className='h-full rounded-full'
                            style={{
                              width: `${(course.enrolled / maxEnrolled) * 100}%`,
                              backgroundImage: `linear-gradient(90deg, ${course.accentFrom}, ${course.accentTo})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {topCourses.length === 0 && (
                      <p className='text-sm text-slate-500'>No courses yet.</p>
                    )}
                  </div>
                </div>

                <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-black text-slate-900'>
                      Latest activity
                    </h2>
                    <Link
                      href='/admin?view=activity'
                      className='text-xs font-bold text-[#2660A4] underline-offset-4 hover:underline'
                    >
                      View all
                    </Link>
                  </div>
                  <ul className='mt-5 space-y-4'>
                    {events.slice(0, 6).map((event) => (
                      <li key={event.id} className='flex gap-3'>
                        <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2660A4]' />
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-slate-900'>
                            {event.summary}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {personLabel(people.get(event.user_id))} ·{" "}
                            {formatDateTime(event.created_at)}
                          </p>
                        </div>
                      </li>
                    ))}
                    {events.length === 0 && (
                      <li className='text-sm text-slate-500'>
                        No activity yet.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {view === "users" && (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-end justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                    Members
                  </p>
                  <h2 className='mt-2 text-2xl font-black text-slate-900'>
                    {users.length} accounts
                  </h2>
                </div>
                <div className='flex gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                  <span className='rounded-full bg-[#2660A4]/10 px-3 py-1.5 text-[#2660A4]'>
                    {stats.learners ?? 0} learners
                  </span>
                  <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700'>
                    {stats.instructors ?? 0} instructors
                  </span>
                  <span className='rounded-full bg-slate-900 px-3 py-1.5 text-white'>
                    {stats.admins ?? 0} admins
                  </span>
                </div>
              </div>

              <div className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60'>
                <div className='overflow-x-auto'>
                  <table className='min-w-full text-left text-sm'>
                    <thead className='bg-slate-50 text-xs uppercase tracking-wider text-slate-500'>
                      <tr>
                        <th className='px-5 py-3 font-semibold'>Member</th>
                        <th className='px-5 py-3 font-semibold'>Joined</th>
                        <th className='px-5 py-3 font-semibold'>Role</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {users.map((user) => (
                        <tr key={user.id} className='hover:bg-slate-50/70'>
                          <td className='px-5 py-4'>
                            <p className='font-semibold text-slate-900'>
                              {user.full_name || user.email.split("@")[0]}
                              {user.id === profile.id && (
                                <span className='ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white'>
                                  you
                                </span>
                              )}
                            </p>
                            <p className='text-xs text-slate-500'>{user.email}</p>
                          </td>
                          <td className='px-5 py-4 text-slate-600'>
                            {formatDate(user.created_at)}
                          </td>
                          <td className='px-5 py-4'>
                            <AdminRoleSelect
                              userId={user.id}
                              role={user.role}
                              disabled={user.id === profile.id}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === "invitations" && (
            <div className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
              <AdminInviteForm />

              <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-black text-slate-900'>
                    Invitation history
                  </h3>
                  <span className='text-xs font-semibold uppercase tracking-wide text-slate-400'>
                    {invites.length} records
                  </span>
                </div>

                <div className='mt-4 space-y-3'>
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'
                    >
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-slate-900'>
                          {invite.email}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {ROLE_LABELS[invite.role]} · {formatDate(invite.created_at)}
                        </p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                            invite.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : invite.status === "accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {invite.status}
                        </span>
                        {invite.status === "pending" && (
                          <AdminRevokeButton id={invite.id} />
                        )}
                      </div>
                    </div>
                  ))}
                  {invites.length === 0 && (
                    <p className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>
                      No invitations yet. Invite an instructor or another admin
                      to share the load.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "requests" && (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-end justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                    Requested courses
                  </p>
                  <h2 className='mt-2 text-2xl font-black text-slate-900'>
                    {courseRequests.length} requests · {openCourseRequests} new
                  </h2>
                  <p className='mt-1 text-sm text-slate-600'>
                    Everything submitted through the homepage form. Signed-in
                    learners are linked to their account; guests show as
                    “guest”.
                  </p>
                </div>
                <span className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600'>
                  <MdOutlinePlaylistAdd size={16} />
                  {openCourseRequests} awaiting triage
                </span>
              </div>

              {courseRequests.length === 0 ? (
                <p className='rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500'>
                  No course requests yet. They will appear here as soon as
                  someone uses the form on the homepage.
                </p>
              ) : (
                <div className='space-y-3'>
                  {courseRequests.map((request) => (
                    <article
                      key={request.id}
                      className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'
                    >
                      <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <p className='text-base font-black text-slate-900'>
                              {request.course_title}
                            </p>
                            <span className='rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600'>
                              {request.level}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                                request.status === "new"
                                  ? "bg-[#2660A4]/10 text-[#2660A4]"
                                  : request.status === "reviewing"
                                    ? "bg-amber-100 text-amber-800"
                                    : request.status === "planned"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <p className='mt-2 text-sm font-semibold text-slate-800'>
                            {request.full_name}{" "}
                            <span className='font-normal text-slate-500'>
                              · {request.email}
                            </span>
                          </p>

                          <p className='mt-1 text-xs text-slate-500'>
                            {request.user_id
                              ? "Linked to a member account"
                              : "Guest submission"}{" "}
                            · {request.source} ·{" "}
                            {formatDateTime(request.created_at)}
                          </p>

                          {request.message && (
                            <p className='mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700'>
                              {request.message}
                            </p>
                          )}
                        </div>

                        <div className='flex flex-col items-end gap-2'>
                          <AdminCourseRequestStatus
                            requestId={request.id}
                            status={request.status}
                          />
                          <a
                            href={`mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(
                              `Re: your course request for ${request.course_title}`,
                            )}`}
                            className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50'
                          >
                            <MdOutlineReply size={13} /> Reply by email
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "courses" && (
            <div className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-[1.4fr_0.6fr]'>
                <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                  <div className='flex items-center gap-2 text-slate-500'>
                    <MdOutlineLibraryBooks size={18} />
                    <p className='text-xs font-semibold uppercase tracking-[0.3em]'>
                      Catalogue & load
                    </p>
                  </div>
                  <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className='rounded-2xl border border-slate-100 p-4'
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${course.accentFrom}12, ${course.accentTo}18)`,
                        }}
                      >
                        <div className='flex items-start justify-between gap-2'>
                          <div>
                            <p className='text-sm font-black text-slate-900'>
                              {course.title}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {course.level} · {course.estimatedHours}h
                            </p>
                          </div>
                          <span className='rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-slate-700'>
                            {course.enrolled} enrolled
                          </span>
                        </div>
                        <div className='mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-600'>
                          <div className='rounded-lg bg-white/80 py-1.5'>
                            <p className='text-sm font-black text-slate-900'>
                              {course.active}
                            </p>
                            active
                          </div>
                          <div className='rounded-lg bg-white/80 py-1.5'>
                            <p className='text-sm font-black text-slate-900'>
                              {course.completed}
                            </p>
                            done
                          </div>
                          <div className='rounded-lg bg-white/80 py-1.5'>
                            <p className='text-sm font-black text-slate-900'>
                              {course.questions}
                            </p>
                            questions
                          </div>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className='text-sm text-slate-500'>
                        No courses in the database yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col justify-between rounded-[28px] border border-slate-900 bg-slate-900 p-6 text-white shadow-lg'>
                  <div>
                    <div className='flex items-center gap-2 text-white/70'>
                      <MdOutlineAutoGraph size={18} />
                      <p className='text-xs font-semibold uppercase tracking-[0.3em]'>
                        Content pipeline
                      </p>
                    </div>
                    <h3 className='mt-3 text-2xl font-black'>
                      {stats.total_questions ?? 0} questions in Supabase
                    </h3>
                    <p className='mt-2 text-sm leading-6 text-white/70'>
                      One click migrates every question bank, practical task and
                      review from the legacy files in{" "}
                      <code className='rounded bg-white/10 px-1'>src/data</code>{" "}
                      into Postgres. Safe to run again — it upserts.
                    </p>
                  </div>
                  <div className='mt-6'>
                    <ContentSyncButton />
                    <Link
                      href='/admin?view=studio'
                      className='mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/80 underline-offset-4 transition hover:text-white hover:underline'
                    >
                      Build a course page in the studio →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "studio" && (
            <div className='space-y-6'>
              <div className='flex flex-wrap items-end justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                    Course studio
                  </p>
                  <h2 className='mt-2 text-2xl font-black text-slate-900'>
                    Write a page the way you would a blog post
                  </h2>
                  <p className='mt-1 max-w-2xl text-sm text-slate-600'>
                    Create a course, add sections, then drag headings, body
                    text, images, videos, code samples and links into place.
                    Question banks still come from{" "}
                    <Link
                      href='/admin?view=courses'
                      className='font-semibold text-[#2660A4] underline-offset-4 hover:underline'
                    >
                      Content sync
                    </Link>
                    .
                  </p>
                </div>
                <span className='rounded-full bg-[#2660A4]/10 px-4 py-2 text-sm font-bold text-[#2660A4]'>
                  {studioData?.courses.length ?? 0} courses
                </span>
              </div>

              {studioData && (
                <CourseStudio
                  courses={studioData.courses}
                  pages={studioData.pages}
                  drafts={studioData.drafts}
                />
              )}
            </div>
          )}

          {view === "grading" && (
            <div className='space-y-6'>
              <div className='flex flex-wrap items-end justify-between gap-3 rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                <div className='flex items-center gap-2 text-slate-500'>
                  <MdOutlineGrading size={18} />
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.3em]'>
                      Practical assessments
                    </p>
                    <h2 className='mt-2 text-2xl font-black text-slate-900'>
                      Add the score that unlocks 10% of a track
                    </h2>
                    <p className='mt-1 max-w-2xl text-sm text-slate-600'>
                      A practical only counts once it is graded at 70% or
                      higher. Until then the learner sees{" "}
                      <strong>Pending Grading</strong>.
                    </p>
                  </div>
                </div>
                <span className='rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800'>
                  {pendingSubmissions.length} pending
                </span>
              </div>

              <div className='grid gap-4 lg:grid-cols-2'>
                {submissions.map((submission) => {
                  const isGraded = submission.status === "graded";
                  const hasStoredFile = submission.file_path.includes("/");
                  const trackTitle =
                    courses.find((course) => course.slug === submission.course_slug)
                      ?.title ??
                    submission.course_slug ??
                    "Practical assessment";

                  return (
                    <article
                      key={submission.id}
                      className='rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm'
                    >
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                            {trackTitle}
                          </p>
                          <h3 className='mt-1 text-lg font-black text-slate-900'>
                            {submission.full_name}
                          </h3>
                          <p className='text-xs text-slate-500'>
                            {submission.email}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isGraded
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isGraded
                            ? `Graded · ${Math.round(Number(submission.score))}%`
                            : "Pending Grading"}
                        </span>
                      </div>

                      <div className='mt-4 grid gap-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-2'>
                        <p>
                          <span className='font-semibold text-slate-800'>
                            Track:
                          </span>{" "}
                          {trackTitle}
                        </p>
                        <p>
                          <span className='font-semibold text-slate-800'>
                            Task:
                          </span>{" "}
                          {submission.task_name ?? "Not specified"}
                        </p>
                        <p className='min-w-0 truncate'>
                          <span className='font-semibold text-slate-800'>
                            File:
                          </span>{" "}
                          {storedFileName(submission.file_path)}
                        </p>
                        <p>
                          <span className='font-semibold text-slate-800'>
                            Submitted:
                          </span>{" "}
                          {formatDateTime(submission.created_at)}
                        </p>
                        <p>
                          <span className='font-semibold text-slate-800'>
                            Graded:
                          </span>{" "}
                          {submission.graded_at
                            ? formatDateTime(submission.graded_at)
                            : "Waiting"}
                        </p>
                      </div>

                      <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                        <div className='flex flex-wrap items-center gap-2'>
                          {hasStoredFile ? (
                            <a
                              href={`/api/admin/submissions/${submission.id}/download`}
                              className='inline-flex items-center gap-1.5 rounded-full border border-[#2660A4]/30 bg-[#2660A4]/5 px-3 py-1.5 text-xs font-semibold text-[#2660A4] transition hover:bg-[#2660A4]/10'
                            >
                              <MdOutlineFileDownload size={14} /> Download file
                            </a>
                          ) : (
                            <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-400'>
                              <MdOutlineFileDownload size={14} /> File unavailable
                            </span>
                          )}
                          <a
                            href={`mailto:${encodeURIComponent(submission.email)}?subject=${encodeURIComponent(
                              "Your practical assessment",
                            )}`}
                            className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50'
                          >
                            <MdOutlineReply size={13} /> Contact learner
                          </a>
                        </div>
                        <AdminGradeSubmission
                          submissionId={submission.id}
                          score={
                            submission.score === null
                              ? null
                              : Number(submission.score)
                          }
                          graded={isGraded}
                        />
                      </div>
                    </article>
                  );
                })}

                {submissions.length === 0 && (
                  <p className='rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600'>
                    No practical submissions yet. They appear here as soon as a
                    learner uploads a workbook.
                  </p>
                )}
              </div>
            </div>
          )}

          {view === "activity" && (
            <div className='grid gap-6 lg:grid-cols-2'>
              <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                <div className='flex items-center gap-2 text-slate-500'>
                  <MdOutlineHistory size={18} />
                  <p className='text-xs font-semibold uppercase tracking-[0.3em]'>
                    Recent events
                  </p>
                </div>
                <ul className='mt-5 space-y-4'>
                  {events.map((event) => (
                    <li key={event.id} className='flex gap-3'>
                      <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2660A4]' />
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-slate-900'>
                          {event.summary}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {personLabel(people.get(event.user_id))} ·{" "}
                          {event.event_type.replace(/_/g, " ")} ·{" "}
                          {formatDateTime(event.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                  {events.length === 0 && (
                    <li className='text-sm text-slate-500'>No events yet.</li>
                  )}
                </ul>
              </div>

              <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60'>
                <div className='flex items-center gap-2 text-slate-500'>
                  <MdOutlineQuiz size={18} />
                  <p className='text-xs font-semibold uppercase tracking-[0.3em]'>
                    Latest assessments
                  </p>
                </div>
                <div className='mt-4 overflow-x-auto'>
                  <table className='min-w-full text-left text-sm'>
                    <thead className='text-xs uppercase tracking-wider text-slate-400'>
                      <tr>
                        <th className='py-2 font-semibold'>Member</th>
                        <th className='py-2 font-semibold'>Score</th>
                        <th className='py-2 font-semibold'>When</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {attempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td className='py-3'>
                            <p className='font-semibold text-slate-900'>
                              {personLabel(people.get(attempt.user_id))}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {attempt.course_slug ?? "general"} · {attempt.mode}
                            </p>
                          </td>
                          <td className='py-3'>
                            <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700'>
                              {Math.round(Number(attempt.score))}%
                            </span>
                            <p className='mt-1 text-[11px] text-slate-400'>
                              {attempt.correct_count}/{attempt.question_count}
                            </p>
                          </td>
                          <td className='py-3 text-xs text-slate-500'>
                            {formatDateTime(attempt.created_at)}
                          </td>
                        </tr>
                      ))}
                      {attempts.length === 0 && (
                        <tr>
                          <td colSpan={3} className='py-6 text-sm text-slate-500'>
                            No assessments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className='mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-6 pb-16 md:px-10 lg:px-12'>
          <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm'>
            <MdOutlineMailOutline size={16} />
            Pending submissions: {stats.pending_submissions ?? 0}
          </div>
          <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm'>
            <MdOutlineInsights size={16} />
            Attempts in the last 7 days: {stats.attempts_7d ?? 0}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroCard({
  icon,
  label,
  value,
  hint,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] bg-gradient-to-br ${gradient} p-6 text-white shadow-lg shadow-slate-300/50`}
    >
      <div className='absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-white/10 blur-2xl' />
      <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/15'>
        {icon}
      </span>
      <p className='mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/75'>
        {label}
      </p>
      <p className='mt-1 text-4xl font-black'>{value}</p>
      <p className='mt-1 text-xs text-white/75'>{hint}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <span
        className='block h-1.5 w-8 rounded-full'
        style={{ backgroundColor: tone }}
      />
      <p className='mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
        {label}
      </p>
      <p className='mt-1 text-2xl font-black text-slate-900'>{value}</p>
    </div>
  );
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <span className='flex items-center gap-1.5'>
      <span
        className='h-2 w-2 rounded-full'
        style={{ backgroundColor: colour }}
      />
      {label}
    </span>
  );
}
