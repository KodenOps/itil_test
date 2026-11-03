"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { recordAttempt } from "@/lib/activity/record";
import NavBar from "../NavBar";

interface Question {
  id?: string;
  question: string;
  options: string[];
  answer: number; // now using index instead of string
  answerIndexes?: number[];
  multiple?: boolean;
  image?: { src: string };
  short_explanation?: string;
}

/** Every correct option position for one question. */
function correctIndexes(question: Question): number[] {
  if (question.answerIndexes && question.answerIndexes.length > 0) {
    return question.answerIndexes;
  }

  return typeof question.answer === "number" ? [question.answer] : [];
}

function sameSelection(given: number[] = [], expected: number[]): boolean {
  return (
    given.length === expected.length &&
    expected.every((value) => given.includes(value))
  );
}

const LOCAL_STORAGE_KEY = "quizState";

const Exam = ({
  questionBank,
  qnumber,
  timeTotal = 3600,
  courseSlug,
  mode = "exam-index",
}: any) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState<number>(timeTotal);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number[];
  }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{
    [key: number]: boolean;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Shuffle questions
  const shuffle = (array: Question[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Load saved state or init
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setShuffledQuestions(parsed.shuffledQuestions);
      setCurrentIndex(parsed.currentIndex);
      // Older saved sessions stored a single index per question.
      setSelectedAnswers(
        Object.fromEntries(
          Object.entries(parsed.selectedAnswers ?? {}).map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.map((item) => Number(item))
              : typeof value === "number"
                ? [value]
                : [],
          ]),
        ),
      );
      setSubmittedQuestions(parsed.submittedQuestions || {});
      setScore(parsed.score);
      setTimeLeft(parsed.timeLeft);
      setIsSubmitted(!!parsed.submittedQuestions?.[parsed.currentIndex]);
    } else {
      const shuffled = shuffle(questionBank).slice(0, qnumber);
      setShuffledQuestions(shuffled);
    }
  }, []);

  // Auto-save
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

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (t: number): string =>
    [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(":");

  // Handle selecting an option (store index)
  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;

    const multiple = Boolean(shuffledQuestions[currentIndex]?.multiple);

    setSelectedAnswers((prev) => {
      const current = prev[currentIndex] ?? [];
      const next = multiple
        ? current.includes(optionIndex)
          ? current.filter((value) => value !== optionIndex)
          : [...current, optionIndex].sort((a, b) => a - b)
        : [optionIndex];

      return { ...prev, [currentIndex]: next };
    });
  };

  // Submit current answer
  const handleSubmitAnswer = () => {
    if ((selectedAnswers[currentIndex] ?? []).length === 0) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
    setIsSubmitted(true);
  };

  // Navigation
  const handleNextQuestion = () => {
    if (!isSubmitted) return;
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsSubmitted(!!submittedQuestions[nextIndex]);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setIsSubmitted(!!submittedQuestions[prevIndex]);
  };

  // Finish and score
  const handleFinish = () => {
    const totalScore = Object.keys(selectedAnswers).reduce((acc, key) => {
      const i = parseInt(key);
      const question = shuffledQuestions[i];

      if (!question) return acc;

      return sameSelection(selectedAnswers[i], correctIndexes(question))
        ? acc + 1
        : acc;
    }, 0);

    localStorage.setItem("finalScore", JSON.stringify(totalScore));
    localStorage.setItem(
      "totalQuestions",
      JSON.stringify(shuffledQuestions.length),
    );
    recordAttempt({
      courseSlug,
      mode,
      total: shuffledQuestions.length,
      correct: totalScore,
      durationSeconds: timeTotal - timeLeft,
    });

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.push("/score");

    setTimeout(() => {
      const shuffled = shuffle(questionBank).slice(0, qnumber ?? 40);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSubmittedQuestions({});
      setIsSubmitted(false);
      setScore(0);
      setTimeLeft(timeTotal);
    }, 500);
  };

  return (
    <div>
      <NavBar />
      {/* Top Navigation */}
      <div className='topNav md:py-5 py-4 md:px-20 px-6 shadow-md w-full bg-white flex justify-between items-center'>
        <div className='text-2xl text-green-600'>
          Q{currentIndex + 1}/
          <span className='text-lg text-gray-400'>
            {shuffledQuestions.length}
          </span>
        </div>
        <div className='text-2xl font-mono text-gray-400'>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className='p-5 text-xl'>
        {shuffledQuestions.length > 0 &&
          shuffledQuestions[currentIndex].question}
        {shuffledQuestions.length > 0 &&
          shuffledQuestions[currentIndex].image?.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shuffledQuestions[currentIndex].image?.src}
              alt=''
              className='mt-4 max-h-72 rounded-xl border border-slate-200 object-contain'
            />
          )}
      </div>

      {/* Options */}
      <div className='p-5'>
        {shuffledQuestions.length > 0 &&
          shuffledQuestions[currentIndex].options.map((option, index) => {
            const multiple = Boolean(shuffledQuestions[currentIndex].multiple);
            const selectedAnswersNow = selectedAnswers[currentIndex] ?? [];
            const selected = selectedAnswersNow.includes(index);
            const correct = correctIndexes(
              shuffledQuestions[currentIndex],
            ).includes(index);
            const isCorrect = isSubmitted && correct;
            const isWrong = isSubmitted && selected && !correct;

            return (
              <div
                key={index}
                className={`flex items-center text-xl mb-5 p-4 cursor-pointer border 
									${isCorrect ? "border-green-500" : ""} 
									${isWrong ? "border-red-500" : ""} 
									${!isCorrect && !isWrong ? "border-transparent" : ""} 
									hover:bg-slate-50 rounded-md`}
                onClick={() => handleOptionSelect(index)}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  id={`option-${index}`}
                  className='w-6 h-6 accent-green-600 cursor-pointer'
                  name={`question-${currentIndex}`}
                  value={index}
                  checked={selected}
                  disabled={isSubmitted}
                  readOnly
                />
                <label
                  htmlFor={`option-${index}`}
                  className='ml-2 cursor-pointer'
                >
                  {option}
                </label>
              </div>
            );
          })}
      </div>

      {/* Navigation Buttons */}
      <div className='p-5 flex justify-center gap-6'>
        {/* Previous */}
        <button
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0}
          className='px-10 py-4 bg-green-600 text-white rounded-lg disabled:bg-gray-400'
        >
          Previous
        </button>

        {/* Submit or Next */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={(selectedAnswers[currentIndex] ?? []).length === 0}
            className={`px-10 py-4 ${
              (selectedAnswers[currentIndex] ?? []).length > 0
                ? "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white rounded-lg`}
          >
            Submit
          </button>
        ) : currentIndex < shuffledQuestions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            className='px-10 py-4 bg-green-600 text-white rounded-lg'
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className='px-10 py-4 bg-red-600 text-white rounded-lg'
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default Exam;
