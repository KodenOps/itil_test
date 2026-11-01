import React from "react";
import Practise from "@/app/components/practise/Practice";
import ClearQuizState from "@/app/components/ClearQuizState";
import EnrollmentGate from "@/app/components/EnrollmentGate";
import QuestionBankEmpty from "@/app/components/QuestionBankEmpty";
import { checkCourseAccess } from "@/lib/content/courses";
import { getQuestions, toTextQuestions } from "@/lib/content/questions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const COURSE_SLUG = "itil-foundation";
const THIS_PATH = "/page/itil-practise";

export default async function Page() {
  const access = await checkCourseAccess(COURSE_SLUG);

  if (!access.viewer) {
    redirect(`/login?callbackUrl=${encodeURIComponent(THIS_PATH)}`);
  }

  if (!access.course) {
    return <QuestionBankEmpty courseTitle='ITIL Foundation' />;
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
      <Practise
        questionBank={questions}
        qnumber={40}
        duration={3600}
        courseSlug={COURSE_SLUG}
        mode='practice'
        title='ITIL Foundation practice'
      />
    </>
  );
}
