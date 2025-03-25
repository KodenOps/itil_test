'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
	const router = useRouter();
	const [finalScore, setFinalScore] = useState<number | null>(null);
	const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

	useEffect(() => {
		// Retrieve score and total questions from localStorage
		const storedScore = localStorage.getItem('finalScore');
		const storedTotal = localStorage.getItem('totalQuestions');

		if (storedScore && storedTotal) {
			setFinalScore(JSON.parse(storedScore));
			setTotalQuestions(JSON.parse(storedTotal));
		} else {
			// If no data found, redirect to home
			router.push('/');
		}
	}, [router]);

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-3xl font-bold text-green-600'>Exam Completed!</h1>
			{finalScore && (finalScore / 40) * 100 < 65 ? (
				<p className='text-xl mt-6'>Olodo! You fail o! </p>
			) : (
				<p className='text-xl mt-6'>Smart Chap! Keep it up. Keep practicing</p>
			)}
			{finalScore !== null && totalQuestions !== null ? (
				<p className='mt-4 text-xl'>
					Your Score:{' '}
					<span className='font-bold'>
						{((finalScore / totalQuestions!) * 100).toFixed(1)}
						{'% '}
					</span>
				</p>
			) : (
				<p className='mt-4 text-xl'>Loading...</p>
			)}

			<button
				onClick={() => {
					localStorage.clear(); // Clear all data from localStorage
					router.push('/'); // Navigate to home
				}}
				className='mt-6 px-6 py-3 bg-green-600 font-semibold text-white rounded-lg md:w-auto w-[80vw]'>
				Go to Home
			</button>
		</div>
	);
};

export default page;
