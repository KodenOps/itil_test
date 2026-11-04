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
  /** Every correct option, for questions that accept more than one. */
  answerIndexes: number[];
  isMulti: boolean;
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

/* ────────────────────────────── Blog ──────────────────────────────────── */

export const BLOG_SOURCES = [
  "studio",
  "hashnode",
  "medium",
  "dev",
  "external",
] as const;

/** `studio` posts are written in the admin blog studio; the rest are links. */
export type BlogSource = (typeof BLOG_SOURCES)[number];

export const BLOG_SOURCE_LABELS: Record<BlogSource, string> = {
  studio: "CertifyHub studio",
  hashnode: "Hashnode",
  medium: "Medium",
  dev: "Dev.to",
  external: "External blog",
};

/** One renderable piece of a studio blog post. */
export type BlogContentBlock =
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "quote"; text: string; attribution: string }
  | { type: "callout"; title: string; text: string }
  | { type: "code"; text: string; language: string }
  | { type: "image"; url: string; alt: string; caption: string }
  | { type: "divider" };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string | null;
  author: string;
  published: boolean;
  source: BlogSource;
  externalUrl: string | null;
  coverImage: string | null;
  content: BlogContentBlock[];
  createdAt: string;
  updatedAt: string;
};

/* ───────────────────────── Question reports ───────────────────────────── */

export const QUESTION_REPORT_ISSUES = [
  "wrong-answer",
  "ambiguous",
  "missing-option",
  "typo",
  "other",
] as const;

export type QuestionReportIssue = (typeof QUESTION_REPORT_ISSUES)[number];

export const QUESTION_REPORT_ISSUE_LABELS: Record<QuestionReportIssue, string> = {
  "wrong-answer": "The marked answer is wrong",
  ambiguous: "The question is ambiguous",
  "missing-option": "An option is missing",
  typo: "Typo or broken formatting",
  other: "Something else",
};

export const QUESTION_REPORT_STATUSES = [
  "open",
  "reviewing",
  "resolved",
  "declined",
] as const;

export type QuestionReportStatus = (typeof QUESTION_REPORT_STATUSES)[number];

export const QUESTION_REPORT_STATUS_LABELS: Record<
  QuestionReportStatus,
  string
> = {
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
  declined: "Declined",
};

export type QuestionReport = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  questionId: string;
  courseSlug: string | null;
  courseTitle: string | null;
  questionPrompt: string;
  issueType: QuestionReportIssue;
  description: string;
  status: QuestionReportStatus;
  adminReply: string;
  repliedAt: string | null;
  createdAt: string;
  /** The question row, so admins can edit it straight from the report. */
  question: {
    externalId: string | null;
    prompt: string;
    options: string[];
    answers: number[];
    explanation: string;
  } | null;
};

/* ─────────────────────────── Notifications ────────────────────────────── */

export const NOTIFICATION_TYPES = [
  "report_replied",
  "report_acknowledged",
  "question_updated",
  "blog_published",
  "announcement",
  // Admin-facing: raised by the database whenever work needs an admin.
  "report_created",
  "submission_created",
  "request_created",
  "signup_created",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type Notification = {
  id: string;
  userId: string;
  actorId: string | null;
  actorName: string | null;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
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
