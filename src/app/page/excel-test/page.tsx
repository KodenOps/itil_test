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

// ─── Types ───────────────────────────────────────────────────────────────────

import type { StaticImageData } from "next/image";

type QuizQuestion = {
  id: string;
  question: string;
  image?: StaticImageData;
  options: string[];
  correct: number;
  explanation: string;
};

type QuizCategory = {
  id: string;
  title: string;
  description: string;
  accent: string;
  accentHex: string;
  questions: QuizQuestion[];
};

// ─── Data ────────────────────────────────────────────────────────────────────
// quizCategories is the full 11-category, 20-question-each Excel question bank.
// Import it from wherever you place quiz-data.ts, e.g.:
import { quizCategories } from "@/data/excel-quiz";

const QUIZ_DURATION_SECONDS = 20 * 60; // 20 minutes
const PASS_THRESHOLD = 70; // percentage

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Stage: Category selection ───────────────────────────────────────────────

function CategorySelect({
  onSelect,
}: {
  onSelect: (categoryId: string) => void;
}) {
  return (
    <>
      <div className='relative overflow-hidden rounded-3xl my-8 p-8 md:p-12 border border-slate-200'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#217346] to-[#38BDF8] opacity-10' />
        <div className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20 bg-[#217346]' />
        <div className='relative'>
          <div className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white mb-4 bg-[#217346]'>
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

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pb-24'>
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
                  <p className='mt-2 text-sm leading-6 text-white/85 line-clamp-3'>
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
        className='mb-6 text-sm font-semibold text-slate-500 hover:text-slate-800 transition'
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
            className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white mb-4'
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

          <div className='mt-8 grid gap-4 sm:grid-cols-3 max-w-xl'>
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
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = currentIndex === category.questions.length - 1;
  const isLowTime = timeLeft <= 60;

  return (
    <div className='my-8 pb-24'>
      {/* Timer + progress bar */}
      <div className='sticky top-[57px] z-30 -mx-4 md:-mx-8 mb-8 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8'>
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
                ? "bg-red-50 text-red-600 animate-pulse"
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

      {/* Question card */}
      <div className='rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm'>
        <div
          className='mb-1 h-1 w-10 rounded-full'
          style={{ backgroundColor: category.accentHex }}
        />
        <h2 className='text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-snug'>
          {question.question}
        </h2>
        {question.image && (
          <img
            src={question.image.src as StaticImageData["src"]}
            alt='Question image'
            className='mx-auto my-4 max-w-full rounded-lg border border-slate-200 shadow-sm'
          />
        )}

        <div className='space-y-3'>
          {question.options.map((opt, i) => {
            const isSelected = answers[currentIndex] === i;
            return (
              <button
                key={i}
                type='button'
                onClick={() => onAnswer(i)}
                className={`flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left text-sm md:text-base transition-all duration-150 ${
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

        <div className='hidden md:flex flex-wrap items-center justify-center gap-1.5 max-w-lg'>
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
                    : "bg-slate-50 text-slate-400 border border-slate-200"
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
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );
  const total = category.questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= PASS_THRESHOLD;

  return (
    <div className='my-8 pb-24'>
      <div className='relative overflow-hidden rounded-3xl border border-slate-200 p-8 md:p-12 mb-10'>
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
              Time's up — this quiz was auto-submitted
            </p>
          )}
          <p className='text-xs font-bold uppercase tracking-widest text-slate-400'>
            {category.title}
          </p>
          <p
            className='mt-3 text-6xl md:text-7xl font-black tracking-tight'
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
      <div className='flex items-center gap-2 mb-4'>
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

                  <div className='mt-3 space-y-1.5'>
                    {q.options.map((opt, oi) => {
                      const isTheCorrect = oi === q.correct;
                      const isTheUser = oi === userAnswer;
                      return (
                        <div
                          key={oi}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isTheCorrect
                              ? "bg-emerald-50 text-emerald-800 font-semibold"
                              : isTheUser
                                ? "bg-red-50 text-red-700"
                                : "text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                          {isTheCorrect && " ✓"}
                          {isTheUser && !isTheCorrect && " (your answer)"}
                          {userAnswer === null && isTheCorrect && ""}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

type Stage = "select" | "intro" | "quiz" | "results";

export default function QuizzesPage() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const selectedCategory = quizCategories.find(
    (c) => c.id === selectedCategoryId,
  );

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [stopTimer],
  );

  // Countdown timer — auto-submits the moment it hits 00:00
  useEffect(() => {
    if (stage !== "quiz") return;
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

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStage("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartQuiz = () => {
    const cat = quizCategories.find((c) => c.id === selectedCategoryId);
    if (!cat) return;
    setAnswers(new Array(cat.questions.length).fill(null));
    setCurrentIndex(0);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setAutoSubmitted(false);
    setStage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  const handleRetake = () => {
    handleStartQuiz();
  };

  const handleBackToCategories = () => {
    stopTimer();
    setSelectedCategoryId(null);
    setStage("select");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (path: string) => {
    stopTimer();
    localStorage.clear();
    router.push(path);
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='mx-auto max-w-7xl px-4 md:px-8'>
        {stage === "select" && (
          <CategorySelect onSelect={handleSelectCategory} />
        )}

        {stage === "intro" && selectedCategory && (
          <QuizIntro
            category={selectedCategory}
            onStart={handleStartQuiz}
            onBack={handleBackToCategories}
          />
        )}

        {stage === "quiz" && selectedCategory && (
          <ActiveQuiz
            category={selectedCategory}
            answers={answers}
            currentIndex={currentIndex}
            timeLeft={timeLeft}
            onAnswer={handleAnswer}
            onNavigate={handleNavigate}
            onSubmit={() => handleSubmit(false)}
          />
        )}

        {stage === "results" && selectedCategory && (
          <Results
            category={selectedCategory}
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
