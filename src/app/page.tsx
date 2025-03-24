import Link from 'next/link';
import React from 'react';

const page = () => {
	return (
		<div className='w-full h-screen flex md:mt-[10%] md:items-start items-center justify-center'>
			<div className='title items-center flex flex-col'>
				<h3 className='text-green-900 font-bold md:text-4xl text-2xl text-center'>
					Welcome To Your ITIL Test
				</h3>
				<p className='md:text-xl text-center mt-4'>
					This is a preparatory test for your ITIL V4 exam. You have 1hr to
					complete the test.
				</p>
				<p className='mt-10 text-lg font-medium'>Total Questions: 40</p>
				<p className='md:text-8xl text-4xl font-bold text-center mb-10 text-[#4f4f4f] font-mono mt-5'>
					01:00:00
				</p>
				<Link
					href={'/questions'}
					className='bg-green-900 px-6  rounded-full py-4 text-slate-50 md:text-lg w-[80%] md:mt-[50px] mt-[20px] cursor-pointer hover:bg-green-700 duration-1000 text-center'>
					Click To Start Exam
				</Link>
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
