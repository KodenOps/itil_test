import React from "react";
import Exam from "@/app/components/questions/Exam_index";
import ClearQuizState from "@/app/components/ClearQuizState";
import EnrollmentGate from "@/app/components/EnrollmentGate";
import QuestionBankEmpty from "@/app/components/QuestionBankEmpty";
import { checkCourseAccess } from "@/lib/content/courses";
import { getQuestions, toIndexQuestions } from "@/lib/content/questions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const COURSE_SLUG = "kcna";
const THIS_PATH = "/page/kcna-exam";

export default async function Page() {
  const access = await checkCourseAccess(COURSE_SLUG);

  if (!access.viewer) {
    redirect(`/login?callbackUrl=${encodeURIComponent(THIS_PATH)}`);
  }

  if (!access.course) {
    return <QuestionBankEmpty courseTitle='KCNA' />;
  }

  if (!access.enrolled) {
    return <EnrollmentGate course={access.course} next={THIS_PATH} />;
  }

  const questions = toIndexQuestions(await getQuestions(COURSE_SLUG));

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
        timeTotal={5400}
        courseSlug={COURSE_SLUG}
        mode='exam'
      />
    </>
  );
}
