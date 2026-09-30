"use client";

import Footer from "@/app/components/Footer";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MdOutlineQuiz,
  MdOutlineTimer,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { BiListCheck } from "react-icons/bi";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import type { StaticImageData } from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

import { quizCategories, type QuizCategory } from "@/data/excel-quiz";

// ─── Configuration ───────────────────────────────────────────────────────────

const QUIZ_DURATION_SECONDS = 20 * 60; // 20 minutes
const PASS_THRESHOLD = 70; // percentage

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Fisher-Yates shuffle.
 *
 * Returns a NEW array and does not mutate the original.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Creates a completely randomized quiz attempt.
 *
 * 1. Questions are shuffled.
 * 2. Options inside every question are shuffled.
 * 3. The correct answer index is recalculated.
 *
 * The original quizCategories data is NEVER modified.
 */
function createQuizAttempt(category: QuizCategory): QuizCategory {
  const shuffledQuestions = shuffleArray(category.questions).map((question) => {
    /**
     * Attach the correct-answer information to each option
     * before shuffling.
     */
    const optionsWithCorrectFlag = question.options.map((option, index) => ({
      option,
      isCorrect: index === question.correct,
    }));

    /**
     * Shuffle the options.
     */
    const shuffledOptions = shuffleArray(optionsWithCorrectFlag);

    /**
     * Find where the correct answer moved to.
     */
    const newCorrectIndex = shuffledOptions.findIndex((item) => item.isCorrect);

    return {
      ...question,
      options: shuffledOptions.map((item) => item.option),
      correct: newCorrectIndex,
    };
  });

  return {
    ...category,
    questions: shuffledQuestions,
  };
}

// ─── Stage: Category selection ───────────────────────────────────────────────

function CategorySelect({
  onSelect,
}: {
  onSelect: (categoryId: string) => void;
}) {
  return (
    <>
      <div className='relative my-8 overflow-hidden rounded-3xl border border-slate-200 p-8 md:p-12'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#217346] to-[#38BDF8] opacity-10' />

        <div className='absolute right-0 top-0 h-64 w-64 rounded-full bg-[#217346] blur-3xl opacity-20' />

        <div className='relative'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-[#217346] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white'>
            <MdOutlineQuiz size={14} />
            Excel Quiz Center
          </div>

          <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
            Test what you know
          </h1>

          <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
            Pick a category below. Each quiz has 20 questions, a 20-minute
            timer, and an instant score out of 100%.
          </p>

          <p className='mt-4 text-sm text-slate-500'>
            {quizCategories.length} categories · 20 questions each
          </p>
        </div>
      </div>

      <div className='grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3'>
        {quizCategories.map((cat) => (
          <button
            key={cat.id}
            type='button'
            onClick={() => onSelect(cat.id)}
            className='group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'
          >
            <div
              className={`rounded-[22px] bg-gradient-to-br ${cat.accent} p-6 text-white`}
            >
              <div className='flex h-full min-h-[220px] flex-col justify-between gap-6 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                <div className='flex items-start justify-between gap-3'>
                  <p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
                    Quiz
                  </p>

                  <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white'>
                    20 Qs
                  </span>
                </div>

                <div>
                  <h2 className='text-xl font-black leading-snug'>
                    {cat.title}
                  </h2>

                  <p className='mt-2 line-clamp-3 text-sm leading-6 text-white/85'>
                    {cat.description}
                  </p>
                </div>

                <div className='flex items-center justify-between gap-3 text-sm font-semibold text-white/90'>
                  <span className='inline-flex items-center gap-1.5'>
                    <MdOutlineTimer size={16} />
                    20 min
                  </span>

                  <span className='rounded-full border border-white/20 bg-white/10 px-4 py-2 transition group-hover:bg-white/20'>
                    Start →
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Stage: Quiz intro ───────────────────────────────────────────────────────

function QuizIntro({
  category,
  onStart,
  onBack,
}: {
  category: QuizCategory;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className='my-8 pb-24'>
      <button
        type='button'
        onClick={onBack}
        className='mb-6 text-sm font-semibold text-slate-500 transition hover:text-slate-800'
      >
        ← Back to categories
      </button>

      <div className='relative overflow-hidden rounded-3xl border border-slate-200 p-8 md:p-12'>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-10`}
        />

        <div
          className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20'
          style={{ backgroundColor: category.accentHex }}
        />

        <div className='relative'>
          <div
            className='mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white'
            style={{ backgroundColor: category.accentHex }}
          >
            Quiz
          </div>

          <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl'>
            {category.title}
          </h1>

          <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600'>
            {category.description}
          </p>

          <div className='mt-8 grid max-w-xl gap-4 sm:grid-cols-3'>
            <div className='rounded-2xl border border-slate-200 bg-white/70 p-4'>
              <p className='text-2xl font-black text-slate-900'>20</p>

              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Questions
              </p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white/70 p-4'>
              <p className='text-2xl font-black text-slate-900'>20:00</p>

              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Time limit
              </p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white/70 p-4'>
              <p className='text-2xl font-black text-slate-900'>100%</p>

              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Graded scale
              </p>
            </div>
          </div>

          <p className='mt-6 max-w-xl text-sm text-slate-500'>
            The timer starts as soon as you begin and auto-submits your quiz the
            moment it reaches 00:00, so answer at your own pace but keep an eye
            on the clock.
          </p>

          <button
            type='button'
            onClick={onStart}
            className='mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
            style={{ backgroundColor: category.accentHex }}
          >
            Start quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stage: Active quiz ──────────────────────────────────────────────────────

function ActiveQuiz({
  category,
  answers,
  currentIndex,
  timeLeft,
  onAnswer,
  onNavigate,
  onSubmit,
}: {
  category: QuizCategory;
  answers: (number | null)[];
  currentIndex: number;
  timeLeft: number;
  onAnswer: (optionIndex: number) => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}) {
  const question = category.questions[currentIndex];

  const answeredCount = answers.filter((answer) => answer !== null).length;

  const isLast = currentIndex === category.questions.length - 1;

  const isLowTime = timeLeft <= 60;

  return (
    <div className='my-8 pb-24'>
      {/* Timer + progress */}
      <div className='sticky top-[57px] z-30 -mx-4 mb-8 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400'>
              {category.title}
            </p>

            <p className='text-sm font-bold text-slate-900'>
              Question {currentIndex + 1} of {category.questions.length}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tabular-nums ${
              isLowTime
                ? "animate-pulse bg-red-50 text-red-600"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <MdOutlineTimer size={18} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100'>
          <div
            className='h-full rounded-full transition-all duration-300'
            style={{
              width: `${(answeredCount / category.questions.length) * 100}%`,
              backgroundColor: category.accentHex,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10'>
        <div
          className='mb-1 h-1 w-10 rounded-full'
          style={{ backgroundColor: category.accentHex }}
        />

        <h2 className='mb-6 text-xl font-bold leading-snug text-slate-900 md:text-2xl'>
          {question.question}
        </h2>

        {/* Question image */}
        {question.image && (
          <div className='mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2'>
            <img
              src={question.image.src}
              alt='Question image'
              className='mx-auto max-h-[600px] max-w-full rounded-xl object-contain'
            />
          </div>
        )}

        {/* Options */}
        <div className='space-y-3'>
          {question.options.map((opt, i) => {
            const isSelected = answers[currentIndex] === i;

            return (
              <button
                key={`${question.id}-${i}`}
                type='button'
                onClick={() => onAnswer(i)}
                className={`flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left text-sm transition-all duration-150 md:text-base ${
                  isSelected
                    ? "border-transparent text-white shadow-sm"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: category.accentHex }
                    : undefined
                }
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isSelected
                      ? "border-white/40 text-white"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>

                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className='mt-6 flex items-center justify-between gap-4'>
        <button
          type='button'
          disabled={currentIndex === 0}
          onClick={() => onNavigate(currentIndex - 1)}
          className='rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent'
        >
          ← Previous
        </button>

        {/* Question navigator */}
        <div className='hidden max-w-lg flex-wrap items-center justify-center gap-1.5 md:flex'>
          {category.questions.map((q, i) => (
            <button
              key={q.id}
              type='button'
              onClick={() => onNavigate(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                i === currentIndex
                  ? "text-white"
                  : answers[i] !== null
                    ? "bg-slate-200 text-slate-700"
                    : "border border-slate-200 bg-slate-50 text-slate-400"
              }`}
              style={
                i === currentIndex
                  ? { backgroundColor: category.accentHex }
                  : undefined
              }
            >
              {i + 1}
            </button>
          ))}
        </div>

        {isLast ? (
          <button
            type='button'
            onClick={onSubmit}
            className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
            style={{ backgroundColor: category.accentHex }}
          >
            Submit quiz
          </button>
        ) : (
          <button
            type='button'
            onClick={() => onNavigate(currentIndex + 1)}
            className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
            style={{ backgroundColor: category.accentHex }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Stage: Results ──────────────────────────────────────────────────────────

function Results({
  category,
  answers,
  autoSubmitted,
  onRetake,
  onBack,
}: {
  category: QuizCategory;
  answers: (number | null)[];
  autoSubmitted: boolean;
  onRetake: () => void;
  onBack: () => void;
}) {
  const correctCount = category.questions.reduce(
    (acc, question, index) =>
      acc + (answers[index] === question.correct ? 1 : 0),
    0,
  );

  const total = category.questions.length;

  const percentage = Math.round((correctCount / total) * 100);

  const passed = percentage >= PASS_THRESHOLD;

  return (
    <div className='my-8 pb-24'>
      {/* Score header */}
      <div className='relative mb-10 overflow-hidden rounded-3xl border border-slate-200 p-8 md:p-12'>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-10`}
        />

        <div
          className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20'
          style={{ backgroundColor: category.accentHex }}
        />

        <div className='relative text-center'>
          {autoSubmitted && (
            <p className='mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>
              <MdOutlineTimer size={14} />
              Time&apos;s up — this quiz was auto-submitted
            </p>
          )}

          <p className='text-xs font-bold uppercase tracking-widest text-slate-400'>
            {category.title}
          </p>

          <p
            className='mt-3 text-6xl font-black tracking-tight md:text-7xl'
            style={{ color: category.accentHex }}
          >
            {percentage}%
          </p>

          <p className='mt-2 text-base font-semibold text-slate-700'>
            {correctCount} out of {total} correct
          </p>

          <p
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
              passed
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {passed ? <MdCheckCircle size={16} /> : <MdCancel size={16} />}
            {passed ? "Passed" : "Below passing score"} · {PASS_THRESHOLD}% to
            pass
          </p>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <button
              type='button'
              onClick={onRetake}
              className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
              style={{ backgroundColor: category.accentHex }}
            >
              Retake quiz
            </button>

            <button
              type='button'
              onClick={onBack}
              className='rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50'
            >
              Choose another category
            </button>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className='mb-4 flex items-center gap-2'>
        <BiListCheck size={20} className='text-slate-400' />

        <h3 className='text-lg font-bold text-slate-900'>
          Review your answers
        </h3>
      </div>

      <div className='space-y-4'>
        {category.questions.map((q, i) => {
          const userAnswer = answers[i];

          const isCorrect = userAnswer === q.correct;

          return (
            <div
              key={q.id}
              className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'
            >
              <div className='flex items-start gap-3'>
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    isCorrect
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isCorrect ? (
                    <MdCheckCircle size={16} />
                  ) : (
                    <MdCancel size={16} />
                  )}
                </span>

                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-bold text-slate-900'>
                    {i + 1}. {q.question}
                  </p>

                  {/* Review image */}
                  {q.image && (
                    <div className='mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2'>
                      <img
                        src={q.image.src}
                        alt='Question image'
                        className='mx-auto max-h-[400px] max-w-full rounded-lg object-contain'
                      />
                    </div>
                  )}

                  <div className='mt-3 space-y-1.5'>
                    {q.options.map((opt, oi) => {
                      const isTheCorrect = oi === q.correct;
                      const isTheUser = oi === userAnswer;

                      return (
                        <div
                          key={`${q.id}-review-${oi}`}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isTheCorrect
                              ? "bg-emerald-50 font-semibold text-emerald-800"
                              : isTheUser
                                ? "bg-red-50 text-red-700"
                                : "text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                          {isTheCorrect && " ✓"}
                          {isTheUser && !isTheCorrect && " (your answer)"}
                        </div>
                      );
                    })}

                    {userAnswer === null && (
                      <p className='px-3 pt-1 text-xs font-semibold text-amber-600'>
                        Not answered
                      </p>
                    )}
                  </div>

                  <p className='mt-3 text-xs leading-5 text-slate-500'>
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

type Stage = "select" | "intro" | "quiz" | "results";

export default function QuizzesPage() {
  const [stage, setStage] = useState<Stage>("select");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  /**
   * This is the randomized quiz for the CURRENT attempt.
   *
   * Do not use quizCategories directly for the active quiz.
   */
  const [activeQuiz, setActiveQuiz] = useState<QuizCategory | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);

  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();

  /**
   * Original category.
   *
   * Used for the intro screen.
   */
  const selectedCategory = quizCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  // ─── Timer ────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSubmit = useCallback(
    (auto: boolean) => {
      stopTimer();

      setAutoSubmitted(auto);

      setStage("results");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [stopTimer],
  );

  useEffect(() => {
    if (stage !== "quiz") {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [stage, handleSubmit, stopTimer]);

  // ─── Category selection ──────────────────────────────────────────────────

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);

    setActiveQuiz(null);

    setStage("intro");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ─── Start quiz ──────────────────────────────────────────────────────────

  const handleStartQuiz = () => {
    const category = quizCategories.find(
      (cat) => cat.id === selectedCategoryId,
    );

    if (!category) {
      return;
    }

    /**
     * THIS is where the magic happens.
     *
     * Every time Start Quiz is clicked:
     *
     * - Questions get shuffled
     * - Options get shuffled
     * - Correct indexes get recalculated
     */
    const randomizedQuiz = createQuizAttempt(category);

    setActiveQuiz(randomizedQuiz);

    setAnswers(new Array(randomizedQuiz.questions.length).fill(null));

    setCurrentIndex(0);

    setTimeLeft(QUIZ_DURATION_SECONDS);

    setAutoSubmitted(false);

    setStage("quiz");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ─── Answer ──────────────────────────────────────────────────────────────

  const handleAnswer = (optionIndex: number) => {
    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];

      nextAnswers[currentIndex] = optionIndex;

      return nextAnswers;
    });
  };

  // ─── Navigation ──────────────────────────────────────────────────────────

  const handleNavigate = (index: number) => {
    if (!activeQuiz) {
      return;
    }

    if (index < 0 || index >= activeQuiz.questions.length) {
      return;
    }

    setCurrentIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ─── Retake ──────────────────────────────────────────────────────────────

  const handleRetake = () => {
    /**
     * This calls createQuizAttempt() again,
     * therefore generating a completely new order.
     */
    handleStartQuiz();
  };

  // ─── Back to categories ──────────────────────────────────────────────────

  const handleBackToCategories = () => {
    stopTimer();

    setSelectedCategoryId(null);

    setActiveQuiz(null);

    setAnswers([]);

    setCurrentIndex(0);

    setTimeLeft(QUIZ_DURATION_SECONDS);

    setAutoSubmitted(false);

    setStage("select");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ─── Navigation ──────────────────────────────────────────────────────────

  const handleNavigation = (path: string) => {
    stopTimer();

    localStorage.clear();

    router.push(path);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='mx-auto max-w-7xl px-4 md:px-8'>
        {/* Category selection */}
        {stage === "select" && (
          <CategorySelect onSelect={handleSelectCategory} />
        )}

        {/* Quiz intro */}
        {stage === "intro" && selectedCategory && (
          <QuizIntro
            category={selectedCategory}
            onStart={handleStartQuiz}
            onBack={handleBackToCategories}
          />
        )}

        {/* Active quiz */}
        {stage === "quiz" && activeQuiz && (
          <ActiveQuiz
            category={activeQuiz}
            answers={answers}
            currentIndex={currentIndex}
            timeLeft={timeLeft}
            onAnswer={handleAnswer}
            onNavigate={handleNavigate}
            onSubmit={() => handleSubmit(false)}
          />
        )}

        {/* Results */}
        {stage === "results" && activeQuiz && (
          <Results
            category={activeQuiz}
            answers={answers}
            autoSubmitted={autoSubmitted}
            onRetake={handleRetake}
            onBack={handleBackToCategories}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
