import React from "react";
import Exam from "@/app/components/questions/Exam";
import ClearQuizState from "@/app/components/ClearQuizState";
import EnrollmentGate from "@/app/components/EnrollmentGate";
import QuestionBankEmpty from "@/app/components/QuestionBankEmpty";
import { checkCourseAccess } from "@/lib/content/courses";
import { getQuestions, toTextQuestions } from "@/lib/content/questions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const COURSE_SLUG = "aws-cloud-practitioner";
const THIS_PATH = "/page/aws-exam";

export default async function Page() {
  const access = await checkCourseAccess(COURSE_SLUG);

  if (!access.viewer) {
    redirect(`/login?callbackUrl=${encodeURIComponent(THIS_PATH)}`);
  }

  if (!access.course) {
    return <QuestionBankEmpty courseTitle='AWS Cloud Practitioner' />;
  }

  if (!access.enrolled) {
    return <EnrollmentGate course={access.course} next={THIS_PATH} />;
  }

  const questions = toTextQuestions(await getQuestions(COURSE_SLUG));

  if (questions.length === 0) {
    return (
      <QuestionBankEmpty
        courseTitle={access.course.title}
        backHref={access.course.href}
      />
    );
  }

  return (
    <>
      <ClearQuizState />
      <Exam
        questionBank={questions}
        qnumber={60}
        courseSlug={COURSE_SLUG}
        mode='exam'
      />
    </>
  );
}
