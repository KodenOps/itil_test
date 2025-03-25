import Link from 'next/link';
import React from 'react';

const page = () => {
	return (
		<div className='w-full h-full flex md:mt-[5%] md:items-start mt-[100px] overflow-hidden justify-center'>
			<div className='title items-center flex flex-col'>
				<h3 className='text-green-900 font-bold md:text-4xl text-2xl text-center'>
					Welcome To Your ITIL Test
				</h3>
				<p className='md:text-xl text-center mt-4 px-10'>
					This is a preparatory test for your ITIL V4 exam. You have 1hr to
					complete the test.
				</p>
				<p className='mt-10 text-lg font-medium'>Total Questions: 40</p>
				<div className='flex flex-wrap items-center justify-center w-full mt-6 gap-4'>
					<Link
						href={'/questions'}
						className='left h-[200px] w-[200px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex p-10 text-center justify-center items-center font-bold text-[#696969]'>
						Full Exam Mode
					</Link>
					<Link
						href={'/practise'}
						className='left h-[200px] w-[200px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex p-10 text-center justify-center items-center font-bold text-[#696969]'>
						Partial Exam Mode
					</Link>
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
