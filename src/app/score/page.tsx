// import React from 'react';

// const page = () => {
// 	return (
//         <div className='flex items-center justify-center h-screen w-full'>
//             <div className='score_page '>
//                 <h2>Exam Completed!</h2>
//                 <h3>You Score { }</h3>
//             </div>
//         </div>
// 	);
// };

// export default page;
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
				<p className='text-xl mt-4'>Olodo! You fail o! </p>
			) : (
				<p>Smart Chap! Keep it up. Keep practicing</p>
			)}
			{finalScore !== null && totalQuestions !== null ? (
				<p className='mt-4 text-xl'>
					Your Score:{' '}
					<span className='font-bold'>
						{((finalScore / 40) * 100).toFixed(1)}
					</span>{' '}
					/ 100
				</p>
			) : (
				<p className='mt-4 text-xl'>Loading...</p>
			)}

			<button
				onClick={() => router.push('/')}
				className='mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg'>
				Go to Home
			</button>
		</div>
	);
};

export default page;
