import { createClient } from "@/lib/supabase/server";
import type {
  QuestionReport,
  QuestionReportIssue,
  QuestionReportStatus,
} from "@/types/app";

type ReportRow = {
  id: string;
  user_id: string;
  question_id: string;
  question_prompt: string;
  course_slug: string | null;
  issue_type: QuestionReportIssue;
  description: string;
  status: QuestionReportStatus;
  admin_reply: string;
  replied_at: string | null;
  created_at: string;
};

type QuestionRow = {
  course_slug: string;
  external_id: string | null;
  prompt: string;
  options: unknown;
  answer_index: number | null;
  answer_indexes: unknown;
  explanation: string | null;
};

/** Admin view of every report, with the reporter and the question row. */
export async function listQuestionReports(): Promise<QuestionReport[]> {
  try {
    const supabase = await createClient();

    const { data: rows, error } = await supabase
      .from("question_reports")
      .select(
        "id, user_id, question_id, question_prompt, course_slug, issue_type, description, status, admin_reply, replied_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200)
      .returns<ReportRow[]>();

    if (error) throw error;

    const reports = rows ?? [];
    if (reports.length === 0) return [];

    const userIds = [...new Set(reports.map((row) => row.user_id))];
    const slugs = [
      ...new Set(
        reports
          .map((row) => row.course_slug)
          .filter((slug): slug is string => Boolean(slug)),
      ),
    ];

    const [peopleResult, questionsResult, coursesResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds)
        .returns<{ id: string; email: string; full_name: string | null }[]>(),
      slugs.length
        ? supabase
            .from("questions")
            .select(
              "course_slug, external_id, prompt, options, answer_index, answer_indexes, explanation",
            )
            .in("course_slug", slugs)
            .returns<QuestionRow[]>()
        : Promise.resolve({ data: [] as QuestionRow[] }),
      slugs.length
        ? supabase
            .from("courses")
            .select("slug, title")
            .in("slug", slugs)
            .returns<{ slug: string; title: string }[]>()
        : Promise.resolve({ data: [] as { slug: string; title: string }[] }),
    ]);

    const people = new Map(
      (peopleResult.data ?? []).map((person) => [person.id, person]),
    );
    const courseTitles = new Map(
      (coursesResult.data ?? []).map((course) => [course.slug, course.title]),
    );
    const questions = new Map(
      (questionsResult.data ?? []).map((question) => [
        `${question.course_slug}::${question.external_id ?? ""}`,
        question,
      ]),
    );

    return reports.map((row) => {
      const person = people.get(row.user_id);
      const question = questions.get(`${row.course_slug}::${row.question_id}`);

      const options = Array.isArray(question?.options)
        ? (question.options as unknown[]).map((option) => String(option ?? ""))
        : [];

      const answers = Array.isArray(question?.answer_indexes)
        ? (question.answer_indexes as unknown[])
            .map((value) => Number(value))
            .filter((value) => Number.isInteger(value))
        : question?.answer_index !== null && question?.answer_index !== undefined
          ? [Number(question.answer_index)]
          : [];

      return {
        id: row.id,
        userId: row.user_id,
        userName: person?.full_name?.trim() || person?.email || "Member",
        userEmail: person?.email ?? "",
        questionId: row.question_id,
        courseSlug: row.course_slug,
        courseTitle: row.course_slug
          ? courseTitles.get(row.course_slug) ?? row.course_slug
          : null,
        questionPrompt: question?.prompt ?? row.question_prompt,
        issueType: row.issue_type,
        description: row.description,
        status: row.status,
        adminReply: row.admin_reply,
        repliedAt: row.replied_at,
        createdAt: row.created_at,
        question: question
          ? {
              externalId: question.external_id,
              prompt: question.prompt,
              options,
              answers,
              explanation: question.explanation ?? "",
            }
          : null,
      };
    });
  } catch (error) {
    console.error("Could not load question reports:", error);
    return [];
  }
}
