import EnrollmentGate from "@/app/components/EnrollmentGate";
import QuestionBankEmpty from "@/app/components/QuestionBankEmpty";
import { checkCourseAccess } from "@/lib/content/courses";
import { listLearningTasks } from "@/lib/content/tasks";
import { redirect } from "next/navigation";
import PracticalAssessmentClient from "./PracticalAssessmentClient";

export const dynamic = "force-dynamic";

const COURSE_SLUG = "excel-fundamentals";
const THIS_PATH = "/page/practical-excel";

export default async function Page() {
  const access = await checkCourseAccess(COURSE_SLUG);

  if (!access.viewer) {
    redirect(`/login?callbackUrl=${encodeURIComponent(THIS_PATH)}`);
  }

  if (!access.course) {
    return <QuestionBankEmpty courseTitle='Excel 101' />;
  }

  if (!access.enrolled) {
    return <EnrollmentGate course={access.course} next={THIS_PATH} />;
  }

  const tasks = await listLearningTasks(COURSE_SLUG);

  if (tasks.length === 0) {
    return (
      <QuestionBankEmpty
        courseTitle={access.course.title}
        backHref={access.course.href}
      />
    );
  }

  const email = access.viewer.email ?? access.viewer.profile.email;
  const name =
    access.viewer.profile.fullName?.trim() ||
    email.split("@")[0] ||
    "Learner";

  return (
    <PracticalAssessmentClient
      tasks={tasks}
      submitterName={name}
      submitterEmail={email}
    />
  );
}
