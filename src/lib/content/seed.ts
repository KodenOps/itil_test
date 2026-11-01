// Server-only. Shapes the legacy src/data files into rows for Postgres.
// Imported by the admin "Content sync" route — never by the browser.
import { itilQuestions } from "@/data/questionBank";
import { itilDpiQuestions } from "@/data/itil-dpi-questionbank";
import kcnaQuestions from "@/data/kcna_questions";
import { aws_question_bank } from "@/data/aws_question";
import { quizCategories } from "@/data/excel-quiz";
import { excel_data } from "@/data/excel-task";
import { reviews } from "@/data/reviews";

type RawQuestion = {
  id?: string;
  question?: string;
  options?: unknown;
  answer?: string | number;
  correct?: number;
  ShortExplanation?: string;
  short_explanation?: string;
  explanation?: string;
  category?: string;
  image?: { src?: string } | string;
};

export type SeedQuestion = {
  course_slug: string;
  external_id: string;
  category: string | null;
  prompt: string;
  options: string[];
  answer_index: number | null;
  answer_text: string | null;
  explanation: string;
  image_url: string | null;
  position: number;
};

export type SeedTask = {
  slug: string;
  course_slug: string;
  title: string;
  description: string;
  link: string | null;
  download: string | null;
  status: string;
  accent: string;
  concepts: string[];
  position: number;
};

export type SeedReview = {
  external_id: string;
  name: string;
  role: string | null;
  body: string;
  avatar_url: string | null;
  position: number;
};

function normalizeQuestion(
  raw: RawQuestion,
  courseSlug: string,
  position: number,
  externalId: string,
  fallbackCategory: string | null,
): SeedQuestion | null {
  const prompt = typeof raw.question === "string" ? raw.question.trim() : "";

  if (!prompt) return null;

  const options = Array.isArray(raw.options) ? raw.options.map(String) : [];

  let answerIndex: number | null = null;
  let answerText: string | null = null;

  if (typeof raw.correct === "number" && raw.correct >= 0) {
    answerIndex = raw.correct;
    answerText = options[raw.correct] ?? null;
  } else if (typeof raw.answer === "number" && raw.answer >= 0) {
    answerIndex = raw.answer;
    answerText = options[raw.answer] ?? null;
  } else if (typeof raw.answer === "string" && raw.answer.trim()) {
    const answer = raw.answer.trim();

    if (/^[A-E]$/i.test(answer)) {
      // The AWS bank keys answers by option letter ("A" … "E").
      const index = answer.toUpperCase().charCodeAt(0) - 65;

      if (options[index] !== undefined) {
        answerIndex = index;
        answerText = options[index];
      }
    } else if (/^[A-E](\s*,\s*[A-E])+$/i.test(answer)) {
      // Multiple-answer questions cannot be graded by the single-choice UI.
      answerIndex = null;
      answerText = null;
    } else if (answer.toLowerCase() !== "unknown") {
      answerText = answer;
      const found = options.indexOf(answer);
      answerIndex = found >= 0 ? found : null;
    }
  }

  const image =
    typeof raw.image === "string" ? raw.image : (raw.image?.src ?? null);

  return {
    course_slug: courseSlug,
    external_id: externalId,
    category: raw.category ?? fallbackCategory,
    prompt,
    options,
    answer_index: answerIndex,
    answer_text: answerText,
    explanation:
      raw.ShortExplanation ?? raw.short_explanation ?? raw.explanation ?? "",
    image_url: image,
    position,
  };
}

function buildItilFoundation(): SeedQuestion[] {
  return (itilQuestions as RawQuestion[])
    .map((raw, index) =>
      normalizeQuestion(
        raw,
        "itil-foundation",
        index,
        raw.id ?? `itil-foundation-${index}`,
        "ITIL Foundation",
      ),
    )
    .filter((q): q is SeedQuestion => q !== null);
}

function buildItilStrategist(): SeedQuestion[] {
  return (itilDpiQuestions as RawQuestion[])
    .map((raw, index) =>
      normalizeQuestion(
        raw,
        "itil-strategist",
        index,
        raw.id ?? `itil-strategist-${index}`,
        "ITIL Strategist",
      ),
    )
    .filter((q): q is SeedQuestion => q !== null);
}

function buildKcna(): SeedQuestion[] {
  return (kcnaQuestions as RawQuestion[])
    .map((raw, index) =>
      normalizeQuestion(raw, "kcna", index, `kcna-${index + 1}`, "KCNA"),
    )
    .filter((q): q is SeedQuestion => q !== null);
}

function buildAws(): SeedQuestion[] {
  return (aws_question_bank as RawQuestion[])
    .map((raw, index) =>
      normalizeQuestion(
        raw,
        "aws-cloud-practitioner",
        index,
        raw.id ?? `aws-${index}`,
        "AWS Cloud Practitioner",
      ),
    )
    .filter((q): q is SeedQuestion => q !== null);
}

function buildExcelQuiz(): SeedQuestion[] {
  const rows: SeedQuestion[] = [];
  let position = 0;

  quizCategories.forEach((category) => {
    category.questions.forEach((question) => {
      rows.push({
        course_slug: "excel-fundamentals",
        external_id: `${category.id}-${question.id}`,
        category: category.title,
        prompt: question.question,
        options: question.options,
        answer_index: question.correct,
        answer_text: question.options[question.correct] ?? null,
        explanation: question.explanation ?? "",
        image_url:
          typeof question.image === "object" && question.image
            ? question.image.src
            : null,
        position: position++,
      });
    });
  });

  return rows;
}

function buildTasks(): SeedTask[] {
  return excel_data.map((task, index) => ({
    slug: `excel-task-${index + 1}`,
    course_slug: "excel-fundamentals",
    title: task.title,
    description: task.description,
    link: task.link ?? null,
    download: task.download ?? null,
    status: task.status === "locked" ? "locked" : "open",
    accent: task.bg ?? "#f2f4f3",
    concepts: task.basic_concept ?? [],
    position: index,
  }));
}

function buildReviews(): SeedReview[] {
  return reviews.map((review, index) => ({
    external_id: String(review.id ?? index),
    name: review.name,
    role: review.role ?? null,
    body: review.review,
    avatar_url:
      typeof review.image === "object" && review.image
        ? review.image.src
        : typeof review.image === "string"
          ? review.image
          : null,
    position: index,
  }));
}

export function buildContentSeed() {
  const questions = [
    ...buildItilFoundation(),
    ...buildItilStrategist(),
    ...buildKcna(),
    ...buildAws(),
    ...buildExcelQuiz(),
  ];

  return {
    questions,
    tasks: buildTasks(),
    reviews: buildReviews(),
  };
}
