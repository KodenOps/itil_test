'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
	const router = useRouter();

	const handleNavigation = (path: string) => {
		localStorage.clear();
		router.push(path);
	};

	return (
		<div className='w-full h-full flex md:mt-[5%] md:items-start mt-[80px] overflow-hidden justify-center'>
			<div className='title items-center flex flex-col'>
				<h3 className='text-green-900 font-bold md:text-4xl text-2xl text-center'>
					Welcome To Your Practice Test Center
				</h3>
				<p className='md:text-xl text-center mt-4 px-10'>
					This is a preparatory test for your professional exam. You have 1hr to
					complete the test.
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
						// {
						// 	path: '/page/aws-exam',
						// 	label: 'AWS Cloud Practitioner',
						// 	mode: 'Full Exam Mode',
						// },
						// {
						// 	path: '/page/aws-practise',
						// 	label: 'AWS Cloud Practitioner',
						// 	mode: 'Partial Exam Mode',
						// },
					].map(({ path, label, mode }) => (
						<div
							key={path}
							onClick={() => handleNavigation(path)}
							className='cursor-pointer left md:h-[200px] md:w-[200px] w-[150px] h-[150px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex md:p-10 p-2 flex-col text-center justify-center items-center font-bold text-[#696969]'>
							{label} <span className='text-sm text-[#858585]'>({mode})</span>
						</div>
					))}
				</div>
			</div>

			<p className='absolute bottom-0 py-4 text-center bg-[#f4f4f4] w-full'>
				Created by{' '}
				<a
					href='https://www.linkedin.com/in/femi-fadiya-segun-pelumi'
					className='underline text-blue-600'>
					Kodenops
				</a>
				❤
			</p>
		</div>
	);
};

export default page;
