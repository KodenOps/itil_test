// import React from 'react';

// const page = () => {
// 	let exams = [
// 		{
// 			path: '/page/itil-exam',
// 			label: 'ITIL V4',
// 			mode: 'Full Exam Mode',
// 		},
// 		{
// 			path: '/page/itil-practise',
// 			label: 'ITIL v4',
// 			mode: 'Partial Exam Mode',
// 		},
// 		{
// 			path: '/page/itil-practise-extended',
// 			label: 'ITIL v4',
// 			mode: 'Extended Question Bank',
// 		}
// 	];
// 	return <div>page</div>;
// };

// export default page;
// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const router = useRouter();

	const handleNavigation = (path: string) => {
		localStorage.clear();
		router.push(path);
	};

	return (
		<div className='w-full h-full flex md:mt-[5%] md:items-start mt-[80px] overflow-hidden justify-center'>
			{/* The rest of your protected content */}
			<div className='title items-center flex flex-col'>
				<h3 className='text-green-900 font-bold md:text-4xl text-2xl text-center'>
					Welcome To Your Exam Section
				</h3>
				<p className='md:text-xl text-center mt-4 px-10 w-[70vw] text-[#696969] font-medium'>
					You can practise for your ITIL exam here in three different modes. You
					can choose to do a full exam simulation that mimic the actual exam
					time allocation and exam mode. Also you have partial exam that gives
					you a short summary after selecting your answers. Finally, the
					extended question bank to practise with all the questions in the
					question bank at once.
				</p>

				<div className='flex flex-wrap items-center justify-center w-full mt-6 gap-4'>
					{[
						{
							path: '/page/itil-exam',
							label: 'ITIL V4',
							mode: 'Full Exam Mode',
						},
						{
							path: '/page/itil-practise',
							label: 'ITIL v4',
							mode: 'Partial Exam Mode',
						},
						{
							path: '/page/itil-practise-extended',
							label: 'ITIL v4',
							mode: 'Extended Question Bank',
						},
					].map(({ path, label, mode }) => (
						<div
							key={path}
							onClick={() => handleNavigation(path)}
							className='cursor-pointer left md:h-[200px] md:w-[200px] w-[150px] h-[150px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex md:p-10 p-2 flex-col text-center justify-center items-center font-bold text-[#696969]'>
							{label} <span className='text-sm text-[#858585]'>({mode})</span>
						</div>
					))}
				</div>
				<a
					href='/'
					className='text-lg text-blue-600 underline mt-6 p-4 cursor-pointer'>
					Go back Home
				</a>
			</div>

			<p className='absolute bottom-0 py-4 text-center bg-[#f4f4f4] w-full'>
				Created by{' '}
				<a
					href='https://www.linkedin.com/in/femi-fadiya-segun-pelumi'
					className='underline text-blue-600'>
					Kode-N-Ops
				</a>
				❤
			</p>
		</div>
	);
};

export default Page;
