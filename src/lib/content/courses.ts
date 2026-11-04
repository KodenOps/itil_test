import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/supabase/profile";
import { isStaff } from "@/lib/supabase/profile";
import type { Course, Enrollment } from "@/types/app";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  accent_from: string;
  accent_to: string;
  href: string;
  icon: string;
  estimated_hours: number;
  position: number;
};

type CourseStatRow = {
  course_id: string;
  enrolled: number;
  active: number;
  completed: number;
  questions: number;
};

export type EnrollmentRow = {
  id: string;
  course_id: string;
  status: Enrollment["status"];
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    slug: string;
    title: string;
    summary: string;
    href: string;
    accent_from: string;
    accent_to: string;
  } | null;
};

/**
 * Tracks that are no longer sold as catalogue courses. The DevOps & Systems
 * Engineering overview now lives in the blog at `/blog/devops-sys-engineer`,
 * so it is kept out of every catalogue listing; the row itself stays so old
 * enrolments and progress still resolve.
 */
const RETIRED_COURSE_SLUGS = ["devops-sys-engineer"];

/**
 * Course catalogue + enrolment counts. Counts come from a SECURITY DEFINER
 * aggregate so a learner can see how popular a course is without being able
 * to read anybody else's enrolment rows.
 *
 * `course_stats` is `grant execute ... to anon, authenticated`, so its export
 * is public; the catalogue is public too, so that call is fine there. The
 * *admin dashboard* only ever calls the aggregate from an admin context.
 */
export async function listCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient();

    const [{ data: rows, error }, { data: statData }] = await Promise.all([
      supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .not("slug", "in", `(${RETIRED_COURSE_SLUGS.join(",")})`)
        .order("position", { ascending: true })
        .returns<CourseRow[]>(),
      supabase.rpc("course_stats"),
    ]);

    if (error) throw error;

    const statRows = (statData ?? []) as CourseStatRow[];
    const stats = new Map<string, CourseStatRow>(
      statRows.map((stat) => [stat.course_id, stat]),
    );

    return (rows ?? []).map((row) => {
      const stat = stats.get(row.id) as CourseStatRow | undefined;

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        track: row.track,
        level: row.level,
        accentFrom: row.accent_from,
        accentTo: row.accent_to,
        href: row.href,
        icon: row.icon,
        estimatedHours: row.estimated_hours,
        position: row.position,
        enrolled: Number(stat?.enrolled ?? 0),
        active: Number(stat?.active ?? 0),
        completed: Number(stat?.completed ?? 0),
        questions: Number(stat?.questions ?? 0),
      };
    });
  } catch (error) {
    console.error("Could not load courses:", error);
    return [];
  }
}

export function mapEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    courseId: row.course_id,
    courseSlug: row.courses?.slug ?? "",
    courseTitle: row.courses?.title ?? "Course",
    courseHref: row.courses?.href ?? "/",
    courseSummary: row.courses?.summary ?? "",
    accentFrom: row.courses?.accent_from ?? "#2660A4",
    accentTo: row.courses?.accent_to ?? "#4F8FCA",
    status: row.status,
    progress: row.progress,
    enrolledAt: row.enrolled_at,
    completedAt: row.completed_at ?? null,
  };
}

export async function listEnrollments(): Promise<Enrollment[]> {
  const viewer = await getViewer();

  if (!viewer) return [];

  const { data, error } = await viewer.supabase
    .from("course_enrollments")
    .select(
      "id, course_id, status, progress, enrolled_at, completed_at, courses(slug, title, summary, href, accent_from, accent_to)",
    )
    .eq("user_id", viewer.userId)
    .order("enrolled_at", { ascending: false })
    .returns<EnrollmentRow[]>();

  if (error) {
    console.error("Could not load enrollments:", error.message);
    return [];
  }

  return (data ?? []).map(mapEnrollment);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await listCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

/**
 * Gate used by every assessment route: the user must be signed in AND
 * actively enrolled in the course that owns the questions.
 */
export async function checkCourseAccess(slug: string) {
  const viewer = await getViewer();

  if (!viewer) {
    return { viewer: null, course: null, enrolled: false };
  }

  const { data: courseRow } = await viewer.supabase
    .from("courses")
    .select(
      "id, slug, title, summary, track, level, href, accent_from, accent_to, estimated_hours",
    )
    .eq("slug", slug)
    .maybeSingle<{
      id: string;
      slug: string;
      title: string;
      summary: string;
      track: string;
      level: string;
      href: string;
      accent_from: string;
      accent_to: string;
      estimated_hours: number;
    }>();

  if (!courseRow) {
    return { viewer, course: null, enrolled: false };
  }

  const { data: enrollment } = await viewer.supabase
    .from("course_enrollments")
    .select("id, status")
    .eq("user_id", viewer.userId)
    .eq("course_id", courseRow.id)
    .maybeSingle<{ id: string; status: string }>();

  return {
    viewer,
    course: {
      id: courseRow.id,
      slug: courseRow.slug,
      title: courseRow.title,
      summary: courseRow.summary,
      track: courseRow.track,
      level: courseRow.level,
      href: courseRow.href,
      accentFrom: courseRow.accent_from,
      accentTo: courseRow.accent_to,
      estimatedHours: Number(courseRow.estimated_hours ?? 12),
    },
    enrolled: enrollment?.status === "active" || enrollment?.status === "completed",
  };
}
