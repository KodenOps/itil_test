"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineTimer, MdCheckCircle, MdCancel } from "react-icons/md";
import NavBar from "../NavBar";

// ─── Types (unchanged) ───────────────────────────────────────────────────────

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  ShortExplanation: string;
}

interface PractiseProps {
  questionBank: Question[];
  qnumber: number;
  duration?: number;
  /** Optional theming so this component can be reused across different quiz
   * categories without a code change — defaults match the Excel quiz look. */
  accentHex?: string;
  title?: string;
}

const LOCAL_STORAGE_KEY = "quizState";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (t: number): string =>
  [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
    .map((v) => (v < 10 ? `0${v}` : `${v}`))
    .join(":");

const shuffle = (array: Question[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ─── Component ────────────────────────────────────────────────────────────────

const Practise = ({
  questionBank,
  qnumber,
  duration = 3600,
  accentHex = "#217346",
  title = "Assessment",
}: PractiseProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{
    [key: number]: boolean;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // ── Load / restore ──
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setShuffledQuestions(parsed.shuffledQuestions);
      setCurrentIndex(parsed.currentIndex);
      setSelectedAnswers(parsed.selectedAnswers);
      setSubmittedQuestions(parsed.submittedQuestions || {});
      setIsSubmitted(!!parsed.submittedQuestions?.[parsed.currentIndex]);
      setShowFeedback(!!parsed.submittedQuestions?.[parsed.currentIndex]);
      setTimeLeft(parsed.timeLeft);
      setScore(parsed.score);
    } else {
      const shuffled = shuffle(questionBank).slice(0, qnumber);
      setShuffledQuestions(shuffled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionBank, qnumber]);

  // ── Persist ──
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          shuffledQuestions,
          currentIndex,
          selectedAnswers,
          submittedQuestions,
          score,
          timeLeft,
        }),
      );
    }
  }, [
    shuffledQuestions,
    currentIndex,
    selectedAnswers,
    submittedQuestions,
    score,
    timeLeft,
  ]);

  // ── Countdown ──
  useEffect(() => {
    if (timeLeft === 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentIndex]) return;
    const isCorrect =
      selectedAnswers[currentIndex] === shuffledQuestions[currentIndex].answer;
    setScore((prev) => prev + (isCorrect ? 1 : 0));
    setSubmittedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
    setIsSubmitted(true);
    setShowFeedback(true);
  };

  const handleMove = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < shuffledQuestions.length) {
      setCurrentIndex(newIndex);
      const alreadySubmitted = !!submittedQuestions[newIndex];
      setIsSubmitted(alreadySubmitted);
      setShowFeedback(alreadySubmitted);
    }
  };

  const handleJumpTo = (index: number) => {
    // Only allow jumping to questions already answered, preserving the
    // original linear, lock-as-you-go assessment flow.
    if (!submittedQuestions[index]) return;
    setCurrentIndex(index);
    setIsSubmitted(true);
    setShowFeedback(true);
  };

  const handleFinish = () => {
    localStorage.setItem("finalScore", JSON.stringify(score));
    localStorage.setItem(
      "totalQuestions",
      JSON.stringify(shuffledQuestions.length),
    );
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.push("/score");
  };

  const isLowTime = timeLeft <= 60;
  const currentQuestion = shuffledQuestions[currentIndex];
  const answeredCount = Object.keys(submittedQuestions).length;
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  if (shuffledQuestions.length === 0) {
    return (
      <div className='min-h-screen bg-white'>
        <NavBar />
        <div className='mx-auto flex max-w-3xl items-center justify-center px-4 py-24'>
          <p className='text-sm font-semibold text-slate-400'>
            Loading assessment…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='mx-auto max-w-3xl px-4 md:px-8'>
        {/* Sticky timer + progress bar */}
        <div className='sticky mt-20 top-[57px] z-30 -mx-4 md:-mx-8 mb-8 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-widest text-slate-400'>
                {title}
              </p>
              <p className='text-sm font-bold text-slate-900'>
                Question {currentIndex + 1} of {shuffledQuestions.length}
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
                width: `${(answeredCount / shuffledQuestions.length) * 100}%`,
                backgroundColor: accentHex,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className='rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm mb-6'>
          <div
            className='mb-1 h-1 w-10 rounded-full'
            style={{ backgroundColor: accentHex }}
          />
          <h2 className='text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-snug'>
            {currentQuestion.question}
          </h2>

          <div className='space-y-3'>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              const isCorrectOption = currentQuestion.answer === option;
              const showAsCorrect = isSubmitted && isCorrectOption;
              const showAsWrong = isSubmitted && isSelected && !isCorrectOption;

              let stateClasses =
                "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";
              let badgeClasses = "border-slate-300 text-slate-400";
              let inlineStyle: React.CSSProperties | undefined;

              if (!isSubmitted && isSelected) {
                stateClasses = "border-transparent text-white shadow-sm";
                badgeClasses = "border-white/40 text-white";
                inlineStyle = { backgroundColor: accentHex };
              } else if (showAsCorrect) {
                stateClasses =
                  "border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold";
                badgeClasses = "border-emerald-400 text-emerald-600";
              } else if (showAsWrong) {
                stateClasses =
                  "border-red-200 bg-red-50 text-red-700 font-semibold";
                badgeClasses = "border-red-400 text-red-500";
              } else if (isSubmitted) {
                stateClasses = "border-slate-100 text-slate-400";
              }

              return (
                <button
                  key={index}
                  type='button'
                  disabled={isSubmitted}
                  onClick={() => handleOptionSelect(option)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm md:text-base transition-all duration-150 ${stateClasses} ${
                    isSubmitted ? "cursor-default" : ""
                  }`}
                  style={inlineStyle}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${badgeClasses}`}
                  >
                    {showAsCorrect ? (
                      <MdCheckCircle size={16} />
                    ) : showAsWrong ? (
                      <MdCancel size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {!isSubmitted && (
            <div className='mt-6 flex justify-end'>
              <button
                type='button'
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswers[currentIndex]}
                className={`rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition ${
                  selectedAnswers[currentIndex]
                    ? "hover:brightness-110"
                    : "cursor-not-allowed opacity-40"
                }`}
                style={{ backgroundColor: accentHex }}
              >
                Submit answer
              </button>
            </div>
          )}
        </div>

        {/* Inline feedback panel (replaces the old modal) */}
        {showFeedback && (
          <div
            className={`rounded-2xl border px-5 py-4 mb-6 ${
              selectedAnswers[currentIndex] === currentQuestion.answer
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className='flex items-center gap-2 mb-1.5'>
              {selectedAnswers[currentIndex] === currentQuestion.answer ? (
                <>
                  <MdCheckCircle size={18} className='text-emerald-600' />
                  <p className='text-sm font-bold text-emerald-800'>Correct!</p>
                </>
              ) : (
                <>
                  <MdCancel size={18} className='text-red-600' />
                  <p className='text-sm font-bold text-red-700'>Incorrect</p>
                </>
              )}
            </div>
            <p className='text-sm leading-6 text-slate-600'>
              {currentQuestion.ShortExplanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className='flex items-center justify-between gap-4 pb-24'>
          <button
            type='button'
            disabled={currentIndex === 0}
            onClick={() => handleMove("prev")}
            className='rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent'
          >
            ← Previous
          </button>

          <div className='hidden md:flex flex-wrap items-center justify-center gap-1.5 max-w-md'>
            {shuffledQuestions.map((q, i) => {
              const submitted = submittedQuestions[i];
              const wasCorrect =
                submitted && selectedAnswers[i] === shuffledQuestions[i].answer;
              return (
                <button
                  key={q.id}
                  type='button'
                  disabled={!submitted}
                  onClick={() => handleJumpTo(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    i === currentIndex
                      ? "text-white"
                      : submitted
                        ? wasCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                        : "bg-slate-50 text-slate-300 border border-slate-200 cursor-not-allowed"
                  }`}
                  style={
                    i === currentIndex
                      ? { backgroundColor: accentHex }
                      : undefined
                  }
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {isSubmitted ? (
            isLastQuestion ? (
              <button
                type='button'
                onClick={handleFinish}
                className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 bg-red-600'
              >
                Finish
              </button>
            ) : (
              <button
                type='button'
                onClick={() => handleMove("next")}
                className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110'
                style={{ backgroundColor: accentHex }}
              >
                Next →
              </button>
            )
          ) : (
            <span className='rounded-full px-6 py-2.5 text-sm font-bold text-slate-300'>
              {isLastQuestion ? "Finish" : "Next →"}
            </span>
          )}
        </div>
      </main>
    </div>
  );
};

export default Practise;
