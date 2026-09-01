"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { itilQuestions } from "@/data/questionBank";
import NavBar from "../NavBar";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

const LOCAL_STORAGE_KEY = "quizState";

const Exam = ({ questionBank, qnumber }: any) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState<number>(3600);
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

  const shuffle = (array: Question[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setShuffledQuestions(parsed.shuffledQuestions);
      setCurrentIndex(parsed.currentIndex);
      setSelectedAnswers(parsed.selectedAnswers);
      setSubmittedQuestions(parsed.submittedQuestions || {});
      setScore(parsed.score);
      setTimeLeft(parsed.timeLeft);
      setIsSubmitted(!!parsed.submittedQuestions?.[parsed.currentIndex]);
    } else {
      const shuffled = shuffle(questionBank).slice(0, qnumber);
      setShuffledQuestions(shuffled);
    }
  }, []);

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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (t: number): string =>
    [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(":");

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentIndex]) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
    setIsSubmitted(true);
  };

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

  const handleFinish = () => {
    const totalScore = Object.keys(selectedAnswers).reduce((acc, key) => {
      const i = parseInt(key);
      return selectedAnswers[i] === shuffledQuestions[i].answer ? acc + 1 : acc;
    }, 0);

    localStorage.setItem("finalScore", JSON.stringify(totalScore));
    localStorage.setItem(
      "totalQuestions",
      JSON.stringify(shuffledQuestions.length),
    );
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.push("/score");

    setTimeout(() => {
      const shuffled = shuffle(itilQuestions).slice(0, 40);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSubmittedQuestions({});
      setIsSubmitted(false);
      setScore(0);
      setTimeLeft(3600);
    }, 500);
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />

        <section className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6 lg:px-8'>
          <div className='mb-6 mt-20  rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70 md:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                  Exam session
                </p>
                <h1 className='mt-2 text-2xl font-black text-slate-900 md:text-3xl'>
                  Question {currentIndex + 1}
                </h1>
              </div>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700'>
                  {shuffledQuestions.length} questions
                </div>
                <div className='rounded-full bg-[#2660A4] px-4 py-2 text-sm font-semibold text-white'>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <div className='mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-[#2660A4] via-[#26a465] to-[#7A4DFF] transition-all duration-300'
                style={{
                  width: `${shuffledQuestions.length ? ((currentIndex + 1) / shuffledQuestions.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
            <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 md:p-8'>
              <p className='text-lg leading-8 text-slate-800 md:text-xl'>
                {shuffledQuestions.length > 0 &&
                  shuffledQuestions[currentIndex].question}
              </p>

              <div className='mt-6 space-y-3'>
                {shuffledQuestions.length > 0 &&
                  shuffledQuestions[currentIndex].options.map(
                    (option, index) => {
                      const selected = selectedAnswers[currentIndex] === option;
                      const correct =
                        shuffledQuestions[currentIndex].answer === option;
                      const isCorrect = isSubmitted && correct;
                      const isWrong = isSubmitted && selected && !correct;

                      return (
                        <div
                          key={index}
                          className={`flex items-center border rounded-2xl bg-slate-50/70 p-4 text-lg transition hover:bg-slate-100 md:text-xl ${isCorrect ? "border-green-500" : ""} ${isWrong ? "border-red-500" : ""} ${!isCorrect && !isWrong ? "border-transparent" : ""}`}
                        >
                          <input
                            type='radio'
                            id={`option-${index}`}
                            className='h-6 w-6 cursor-pointer accent-green-600'
                            name={`question-${currentIndex}`}
                            value={option}
                            checked={selected}
                            disabled={isSubmitted}
                            onChange={() => handleOptionSelect(option)}
                          />
                          <label
                            htmlFor={`option-${index}`}
                            className='ml-3 cursor-pointer text-slate-800'
                          >
                            {option}
                          </label>
                        </div>
                      );
                    },
                  )}
              </div>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70'>
              <div className='flex flex-col gap-3'>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                  Session controls
                </p>
                <p className='text-sm leading-6 text-slate-600'>
                  Move through the set with deliberate pacing. Submit when you
                  are ready to lock in an answer.
                </p>
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentIndex === 0}
                  className='rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Previous
                </button>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswers[currentIndex]}
                    className={`rounded-full px-6 py-3 font-semibold text-white transition ${selectedAnswers[currentIndex] ? "bg-[#2660A4] hover:bg-[#1f4f8d]" : "cursor-not-allowed bg-slate-300"}`}
                  >
                    Submit
                  </button>
                ) : currentIndex < shuffledQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className='rounded-full bg-[#26a465] px-6 py-3 font-semibold text-white transition hover:bg-[#208a56]'
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className='rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800'
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Exam;
