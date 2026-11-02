export type AppRole = "learner" | "instructor" | "admin";

export const ENROLLMENT_LIMIT = 2;

export const ROLE_LABELS: Record<AppRole, string> = {
  learner: "Learner",
  instructor: "Instructor",
  admin: "Admin",
};

export type Profile = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: AppRole;
  createdAt: string;
  lastActiveAt: string | null;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  accentFrom: string;
  accentTo: string;
  href: string;
  icon: string;
  estimatedHours: number;
  position: number;
  enrolled: number;
  active: number;
  completed: number;
  questions: number;
};

export type Enrollment = {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseHref: string;
  courseSummary: string;
  accentFrom: string;
  accentTo: string;
  status: "active" | "completed" | "withdrawn";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
};

export type QuestionRecord = {
  externalId: string | null;
  category: string | null;
  prompt: string;
  options: string[];
  answerIndex: number | null;
  answerText: string | null;
  explanation: string;
  imageUrl: string | null;
};

export type QuizAttempt = {
  id: string;
  courseSlug: string | null;
  mode: string;
  questionCount: number;
  correctCount: number;
  score: number;
  createdAt: string;
};

export type ActivityEvent = {
  id: string;
  eventType: string;
  courseSlug: string | null;
  summary: string;
  createdAt: string;
};

export const COURSE_REQUEST_STATUSES = [
  "new",
  "reviewing",
  "planned",
  "declined",
] as const;

export type CourseRequestStatus = (typeof COURSE_REQUEST_STATUSES)[number];

export const COURSE_REQUEST_STATUS_LABELS: Record<CourseRequestStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  planned: "Planned",
  declined: "Declined",
};

export type CourseRequest = {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  courseTitle: string;
  level: string;
  message: string | null;
  source: string;
  status: CourseRequestStatus;
  createdAt: string;
};

export type PlatformStats = {
  total_users: number;
  learners: number;
  instructors: number;
  admins: number;
  new_users_7d: number;
  active_learners_7d: number;
  total_enrollments: number;
  active_enrollments: number;
  total_courses: number;
  total_questions: number;
  total_attempts: number;
  attempts_7d: number;
  avg_score: number;
  pending_invites: number;
  pending_submissions: number;
  pending_course_requests: number;
};

export type DailyActivity = {
  day: string;
  signups: number;
  enrollments: number;
  attempts: number;
};
