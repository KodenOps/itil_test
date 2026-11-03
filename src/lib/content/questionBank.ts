import { createClient } from "@/lib/supabase/server";
import {
  isTestFormat,
  newQuestionId,
  type BankQuestion,
} from "@/types/questionBank";

type QuestionRow = {
  external_id: string | null;
  category: string | null;
  prompt: string;
  options: unknown;
  answer_index: number | null;
  answer_text: string | null;
  answer_indexes: unknown;
  is_multi: boolean | null;
  format: string | null;
  explanation: string | null;
  image_url: string | null;
};

/** Reads one course's bank for the studio editor. */
export async function listCourseQuestions(
  courseSlug: string,
): Promise<BankQuestion[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("questions")
      .select(
        "external_id, category, prompt, options, answer_index, answer_text, answer_indexes, is_multi, format, explanation, image_url",
      )
      .eq("course_slug", courseSlug)
      .order("position", { ascending: true })
      .limit(2000)
      .returns<QuestionRow[]>();

    if (error) throw error;

    return (data ?? []).map((row, index) => {
      const options = Array.isArray(row.options)
        ? row.options.map((option) => String(option ?? ""))
        : [];

      const stored = Array.isArray(row.answer_indexes)
        ? (row.answer_indexes as unknown[])
            .map((value) => Number(value))
            .filter(
              (value) => Number.isInteger(value) && value >= 0 && value < options.length,
            )
        : [];

      let answers = stored;

      if (answers.length === 0 && row.answer_index !== null) {
        answers = [Number(row.answer_index)];
      }

      if (answers.length === 0 && row.answer_text) {
        const match = options.findIndex(
          (option) => option.toLowerCase() === row.answer_text?.toLowerCase(),
        );
        if (match >= 0) answers = [match];
      }

      return {
        id: newQuestionId(),
        externalId: row.external_id ?? `q-${index + 1}`,
        prompt: row.prompt,
        category: row.category ?? "",
        options,
        answers,
        multiple: Boolean(row.is_multi) || answers.length > 1,
        explanation: row.explanation ?? "",
        imageUrl: row.image_url ?? "",
        format: isTestFormat(row.format) ? row.format : "exam-index",
      };
    });
  } catch (error) {
    console.error(`Could not load the question bank for ${courseSlug}:`, error);
    return [];
  }
}
