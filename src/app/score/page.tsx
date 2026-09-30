"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve score and total questions from localStorage
    const storedScore = localStorage.getItem("finalScore");
    const storedTotal = localStorage.getItem("totalQuestions");

    if (storedScore && storedTotal) {
      setFinalScore(JSON.parse(storedScore));
      setTotalQuestions(JSON.parse(storedTotal));
    } else {
      // If no data found, redirect to home
      router.push("/");
    }
  }, [router]);

  const percentage =
    finalScore !== null && totalQuestions !== null
      ? (finalScore / totalQuestions) * 100
      : null;

  return (
    <div className='min-h-screen bg-white px-6 py-10 text-slate-900 flex flex-col items-center justify-center'>
      <div className='w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70'>
        <div className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700'>
          Results
        </div>

        <h1 className='mt-5 text-3xl font-black text-[#2660A4]'>
          Exam Completed!
        </h1>

        {/* {percentage !== null && (
					<div className='h-[250px] bg-slate-400'>
						<p className='font-bold text-2xl p-4 my-4 bg-green-400'>
							Score: {percentage.toFixed()}%
						</p>
						<p className='mt-4 text-xl'>
							Correct Answer: {finalScore}
							<br />
							Total Questions: {totalQuestions}
						</p>
					</div>
				)} */}

        {percentage !== null ? (
          percentage < 65 ? (
            <p className='mt-4 text-xl italic text-rose-600'>
              Olodo! You fail o!
            </p>
          ) : (
            <p className='mt-4 text-xl italic text-emerald-600'>
              Smart Chap! Keep it up. Keep practicing
            </p>
          )
        ) : (
          <p className='mt-6 text-xl text-slate-600'>Loading...</p>
        )}

        <div className='mt-8 grid w-full gap-4 md:grid-cols-2'>
          <div className='flex flex-col justify-center rounded-[28px] border border-slate-200 bg-[#2660A4] px-4 py-10 text-white shadow-lg shadow-blue-100'>
            <h4 className='text-lg font-semibold w-full text-center text-white/80'>
              Your Score:
            </h4>

            <h2 className='text-4xl font-black w-full text-center text-white'>
              {percentage !== null ? `${percentage.toFixed()}%` : "..."}
            </h2>
          </div>

          <div className='flex flex-col justify-center rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-10'>
            <h4 className='text-lg font-semibold text-slate-500'>
              Performance
            </h4>

            <p className='mt-2 text-xl font-bold text-slate-900'>
              {finalScore ?? 0} / {totalQuestions ?? 0}
            </p>
          </div>
        </div>

        <button
          className='mt-8 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 md:w-auto w-[80vw]'
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
        >
          <div className='flex items-center gap-2'>Go back Home</div>
        </button>
      </div>
    </div>
  );
};

export default Page;
