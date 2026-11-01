import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { listCourses } from "@/lib/content/courses";
import { getViewer } from "@/lib/supabase/profile";
import { listEnrollments } from "@/lib/content/courses";
import CourseCatalog from "./CourseCatalog";
import CourseRequestForm from "./CourseRequestForm";
import { ENROLLMENT_LIMIT } from "@/types/app";

export const dynamic = "force-dynamic";

const Page = async () => {
  const [courses, viewer, enrollments] = await Promise.all([
    listCourses(),
    getViewer(),
    listEnrollments(),
  ]);

  const enrolledIds = new Set(enrollments.map((item) => item.courseId));
  const activeCount = enrollments.filter((item) => item.status === "active").length;

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='relative overflow-hidden mt-20'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />
        <div className='absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-[#2660A4]/10 blur-3xl' />
        <div className='absolute right-[-6rem] top-56 -z-10 h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl' />

        <section className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12'>
          <div className='grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end'>
            <div className='max-w-4xl'>
              <div className='inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/70 backdrop-blur'>
                CertifyHub exam prep portal
              </div>
              <h1 className='mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
                Enroll in a track. Then study like it is yours.
              </h1>
              <p className='mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
                Courses are locked until you enroll — your seat, your pace,
                your activity trail. You can hold{" "}
                <span className='font-semibold text-slate-900'>
                  {ENROLLMENT_LIMIT} active courses
                </span>{" "}
                at a time, so pick the ones that move you forward now.
              </p>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                Your learning seat
              </p>
              <p className='mt-3 text-5xl font-black text-slate-900'>
                {activeCount}
                <span className='text-2xl font-bold text-slate-400'>
                  /{ENROLLMENT_LIMIT}
                </span>
              </p>
              <p className='mt-2 text-sm text-slate-600'>
                {viewer
                  ? activeCount >= ENROLLMENT_LIMIT
                    ? "Both seats taken. Leave a course to switch tracks."
                    : `${ENROLLMENT_LIMIT - activeCount} seat${
                        ENROLLMENT_LIMIT - activeCount === 1 ? "" : "s"
                      } left.`
                  : "Sign in to claim your seats and track progress."}
              </p>
              <div className='mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-[#2660A4] to-[#26a465]'
                  style={{
                    width: `${(activeCount / ENROLLMENT_LIMIT) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <CourseCatalog
            courses={courses}
            enrolledIds={[...enrolledIds]}
            isSignedIn={Boolean(viewer)}
            activeCount={activeCount}
            limit={ENROLLMENT_LIMIT}
            isAdmin={viewer?.profile.role === "admin"}
          />

          <CourseRequestForm
            isSignedIn={Boolean(viewer)}
            defaultName={viewer?.profile.fullName ?? ""}
            defaultEmail={viewer?.email ?? ""}
            suggestions={[
              "ITIL 4 Specialist: Create, Deliver and Support",
              "Power BI advanced DAX",
              "Terraform for cloud engineers",
            ]}
          />

          <div className='grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 md:grid-cols-3'>
            {[
              "Enrollment required before any assessment opens",
              "Live enrollment counts for every course",
              "Activity, scores and progress saved to your profile",
            ].map((item) => (
              <div key={item} className='rounded-2xl bg-slate-50 p-5'>
                <p className='text-sm font-semibold text-slate-900'>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
