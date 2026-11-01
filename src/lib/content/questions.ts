import { createClient } from "@/lib/supabase/server";
import type { QuestionRecord } from "@/types/app";

type QuestionRow = {
  external_id: string | null;
  category: string | null;
  prompt: string;
  options: string[];
  answer_index: number | null;
  answer_text: string | null;
  explanation: string;
  image_url: string | null;
};

/**
 * Question banks now live in Postgres (see /admin → Content sync). The
 * assessment routes read them here instead of importing src/data directly.
 */
export async function getQuestions(courseSlug: string): Promise<QuestionRecord[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("questions")
      .select(
        "external_id, category, prompt, options, answer_index, answer_text, explanation, image_url",
      )
      .eq("course_slug", courseSlug)
      .order("position", { ascending: true })
      .limit(2000)
      .returns<QuestionRow[]>();

    if (error) throw error;

    return (data ?? []).map((row) => ({
      externalId: row.external_id,
      category: row.category,
      prompt: row.prompt,
      options: Array.isArray(row.options) ? row.options : [],
      answerIndex: row.answer_index,
      answerText: row.answer_text,
      explanation: row.explanation ?? "",
      imageUrl: row.image_url,
    }));
  } catch (error) {
    console.error(`Could not load questions for ${courseSlug}:`, error);
    return [];
  }
}

/** Shape expected by <Exam /> and <Practice /> (answer compared as text). */
export function toTextQuestions(records: QuestionRecord[]) {
  return records
    .filter((q) => q.options.length > 0 && q.answerText !== null)
    .map((q, index) => ({
      id: q.externalId ?? `${index}`,
      question: q.prompt,
      options: q.options,
      answer: q.answerText as string,
      ShortExplanation: q.explanation,
    }));
}

/** Shape expected by <Exam_index /> and <Practice-index /> (answer index). */
export function toIndexQuestions(records: QuestionRecord[]) {
  return records
    .filter((q) => q.options.length > 0 && q.answerIndex !== null)
    .map((q, index) => ({
      id: q.externalId ?? `${index}`,
      question: q.prompt,
      options: q.options,
      answer: q.answerIndex as number,
      short_explanation: q.explanation,
    }));
}

export type QuizCategoryRecord = {
  id: string;
  title: string;
  description: string;
  accent: string;
  accentHex: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    image?: { src: string };
  }[];
};

/** Excel quiz categories, grouped from the questions table. */
export async function getQuizCategories(
  courseSlug = "excel-fundamentals",
): Promise<QuizCategoryRecord[]> {
  const records = await getQuestions(courseSlug);
  const accents = [
    { accent: "from-[#217346] to-[#33C481]", accentHex: "#217346" },
    { accent: "from-[#247BA0] to-[#1E3A8A]", accentHex: "#247BA0" },
    { accent: "from-[#DD44AF] to-[#0C1642]", accentHex: "#DD44AF" },
    { accent: "from-[#F97316] to-[#B45309]", accentHex: "#F97316" },
    { accent: "from-[#6D2E46] to-[#A24E67]", accentHex: "#6D2E46" },
  ];

  const grouped = new Map<string, QuestionRecord[]>();

  records.forEach((record) => {
    const key = record.category ?? "Excel";
    const bucket = grouped.get(key) ?? [];
    bucket.push(record);
    grouped.set(key, bucket);
  });

  return [...grouped.entries()].map(([category, items], index) => {
    const palette = accents[index % accents.length];

    return {
      id: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: category,
      description: `Practice ${items.length} questions on ${category.toLowerCase()} with instant scoring.`,
      accent: palette.accent,
      accentHex: palette.accentHex,
      questions: items
        .filter((item) => item.answerIndex !== null && item.options.length > 0)
        .map((item, qIndex) => ({
          id: item.externalId ?? `${category}-${qIndex}`,
          question: item.prompt,
          options: item.options,
          correct: item.answerIndex as number,
          explanation: item.explanation,
          ...(item.imageUrl ? { image: { src: item.imageUrl } } : {}),
        })),
    };
  });
}
