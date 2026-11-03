/**
 * Question-bank shapes shared by the studio editor, the JSON importer and the
 * server validator. Pure functions only, so the browser can preview exactly
 * what the server will store.
 */

export const TEST_FORMATS = [
  "exam-index",
  "exam-text",
  "practice-index",
  "practice-text",
] as const;

export type TestFormat = (typeof TEST_FORMATS)[number];

export const TEST_FORMAT_LABELS: Record<TestFormat, string> = {
  "exam-index": "Exam · answer by option letter (index)",
  "exam-text": "Exam · answer by option text",
  "practice-index": "Practice · answer by option letter (index)",
  "practice-text": "Practice · answer by option text",
};

export const TEST_FORMAT_HINTS: Record<TestFormat, string> = {
  "exam-index":
    "Matches the KCNA-style exam: the stored answer is the option position.",
  "exam-text":
    "Matches the ITIL / AWS-style exam: the stored answer is the option text.",
  "practice-index":
    "Matches the KCNA-style practice runner: instant feedback, index answer.",
  "practice-text":
    "Matches the ITIL / AWS-style practice runner: instant feedback, text answer.",
};

export type BankQuestion = {
  /** Editor-only id so cards stay stable while dragging. */
  id: string;
  /** Stable stored id; used by quiz attempts and re-imports. */
  externalId: string;
  prompt: string;
  category: string;
  options: string[];
  /** Positions of the correct options. Always at least one for a valid item. */
  answers: number[];
  multiple: boolean;
  explanation: string;
  imageUrl: string;
  format: TestFormat;
};

export type ParsedBank = {
  questions: BankQuestion[];
  errors: string[];
};

const MAX_QUESTIONS = 1000;
const MAX_OPTIONS = 12;

function text(value: unknown, max = 4000): string {
  if (typeof value !== "string") {
    if (typeof value === "number") return String(value).slice(0, max);
    return "";
  }

  return value.trim().slice(0, max);
}

export function newQuestionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isTestFormat(value: unknown): value is TestFormat {
  return typeof value === "string" && (TEST_FORMATS as readonly string[]).includes(value);
}

/** A blank question, ready for the interactive builder. */
export function emptyQuestion(format: TestFormat): BankQuestion {
  return {
    id: newQuestionId(),
    externalId: "",
    prompt: "",
    category: "",
    options: ["", "", "", ""],
    answers: [],
    multiple: false,
    explanation: "",
    imageUrl: "",
    format,
  };
}

function optionsFrom(raw: unknown): { options: string[]; correct: number[] } {
  if (!Array.isArray(raw)) return { options: [], correct: [] };

  const correct: number[] = [];

  const options = raw
    .slice(0, MAX_OPTIONS)
    .map((option, index) => {
      if (typeof option === "string") return text(option, 600);

      if (option && typeof option === "object") {
        const record = option as Record<string, unknown>;
        const flag = record.correct ?? record.isCorrect ?? record.is_correct;

        if (flag === true) correct.push(index);

        return text(
          record.text ?? record.label ?? record.value ?? record.option,
          600,
        );
      }

      return "";
    });

  return { options, correct };
}

function imageFrom(raw: unknown): string {
  if (typeof raw === "string") return raw.trim().slice(0, 2048);

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const value = record.src ?? record.url ?? record.imageUrl;
    if (typeof value === "string") return value.trim().slice(0, 2048);
  }

  return "";
}

/**
 * Accepts the answer in any of the shapes people paste: an index, a list of
 * indices, the option text, a letter ("B"), or an array of any of those.
 */
function answersFrom(raw: unknown, options: string[]): number[] {
  const values = Array.isArray(raw) ? raw : raw === undefined || raw === null ? [] : [raw];
  const found = new Set<number>();

  for (const value of values) {
    if (typeof value === "number" && Number.isInteger(value)) {
      if (value >= 0 && value < options.length) found.add(value);
      continue;
    }

    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      const nested = answersFrom(
        record.index ?? record.position ?? record.value ?? record.text,
        options,
      );
      nested.forEach((index) => found.add(index));
      continue;
    }

    if (typeof value !== "string") continue;

    const needle = value.trim();
    if (!needle) continue;

    const byText = options.findIndex(
      (option) => option.toLowerCase() === needle.toLowerCase(),
    );

    if (byText >= 0) {
      found.add(byText);
      continue;
    }

    // "B" or "b" — the option letter.
    if (/^[a-z]$/i.test(needle)) {
      const index = needle.toUpperCase().charCodeAt(0) - 65;
      if (index >= 0 && index < options.length) found.add(index);
      continue;
    }

    if (/^\d+$/.test(needle)) {
      const index = Number(needle);
      if (index >= 0 && index < options.length) found.add(index);
      continue;
    }

    const partial = options.findIndex((option) =>
      option.toLowerCase().includes(needle.toLowerCase()),
    );

    if (partial >= 0) found.add(partial);
  }

  return [...found].sort((a, b) => a - b);
}

function isMultiple(raw: Record<string, unknown>, answers: number[]): boolean {
  const flag = raw.multiple ?? raw.isMulti ?? raw.multi ?? raw.multiSelect;
  const type = typeof raw.type === "string" ? raw.type.toLowerCase() : "";

  if (typeof flag === "boolean") return flag;
  if (type.includes("multi") || type.includes("multiple")) return true;

  return answers.length > 1;
}

/**
 * Parses a pasted JSON bank. Accepts an array, `{ questions: [...] }` or
 * `{ bank: [...] }`, and reports per-item problems instead of failing whole.
 */
export function parseQuestionBank(
  input: unknown,
  defaultFormat: TestFormat,
): ParsedBank {
  const errors: string[] = [];
  const questions: BankQuestion[] = [];

  let list: unknown[] = [];

  if (Array.isArray(input)) {
    list = input;
  } else if (input && typeof input === "object") {
    const record = input as Record<string, unknown>;
    const candidate = record.questions ?? record.bank ?? record.items ?? record.data;

    if (Array.isArray(candidate)) {
      list = candidate;
    } else {
      return {
        questions,
        errors: [
          "Expected an array of questions, or an object with a `questions` array.",
        ],
      };
    }
  } else {
    return {
      questions,
      errors: ["That JSON is not an array of questions."],
    };
  }

  list.slice(0, MAX_QUESTIONS).forEach((raw, index) => {
    const label = `Question ${index + 1}`;

    if (!raw || typeof raw !== "object") {
      errors.push(`${label}: not an object.`);
      return;
    }

    const record = raw as Record<string, unknown>;
    const prompt = text(
      record.prompt ?? record.question ?? record.text ?? record.title,
      4000,
    );
    const { options, correct: flagged } = optionsFrom(
      record.options ?? record.choices ?? record.answersList,
    );

    if (!prompt) {
      errors.push(`${label}: missing a prompt/question.`);
      return;
    }

    if (options.length < 2 || options.some((option) => !option)) {
      errors.push(`${label}: needs at least two non-empty options.`);
      return;
    }

    // A question-level `correct` is an answer unless it is a boolean flag
    // belonging to option objects.
    const correctCandidate =
      typeof record.correct === "boolean" ? undefined : record.correct;

    const explicit = answersFrom(
      record.answer ??
        record.answers ??
        correctCandidate ??
        record.correctAnswer ??
        record.correct_answer ??
        record.answerIndex ??
        record.answer_index ??
        record.answerText ??
        record.answer_text ??
        record.solution,
      options,
    );

    const answers = explicit.length > 0 ? explicit : flagged;

    if (answers.length === 0) {
      errors.push(`${label}: no option matches the given answer.`);
      return;
    }

    const format = isTestFormat(record.format)
      ? record.format
      : record.testType && isTestFormat(record.testType)
        ? record.testType
        : defaultFormat;

    const externalId = text(
      record.id ?? record.externalId ?? record.external_id ?? record.slug,
      120,
    );

    questions.push({
      id: newQuestionId(),
      externalId: externalId || `q-${index + 1}-${Date.now().toString(36)}`,
      prompt,
      category: text(record.category ?? record.topic ?? record.section, 120),
      options,
      answers,
      multiple: isMultiple(record, answers),
      explanation: text(
        record.explanation ?? record.reason ?? record.rationale,
        4000,
      ),
      imageUrl: imageFrom(record.imageUrl ?? record.image_url ?? record.image),
      format,
    });
  });

  return { questions, errors };
}

/** Drops editor-only ids before the list goes to the server. */
export function toStoredQuestions(questions: BankQuestion[]) {
  return questions.map((question) => ({
    id: question.externalId,
    prompt: question.prompt,
    category: question.category,
    options: question.options,
    answers: question.answers,
    multiple: question.multiple,
    explanation: question.explanation,
    imageUrl: question.imageUrl,
    format: question.format,
  }));
}

/** A question is only worth saving when it is answerable. */
export function questionProblems(question: BankQuestion): string[] {
  const problems: string[] = [];

  if (!question.prompt.trim()) problems.push("Add the question text.");
  if (question.options.filter((option) => option.trim()).length < 2) {
    problems.push("Add at least two options.");
  }
  if (question.answers.length === 0) problems.push("Pick the correct option.");
  if (!question.multiple && question.answers.length > 1) {
    problems.push("A single-answer question can only have one correct option.");
  }

  return problems;
}
