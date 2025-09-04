// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from './components/NavBar';

const Page = () => {
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const router = useRouter();

	const handleNavigation = (path: string) => {
		localStorage.clear();
		router.push(path);
	};

	return (
		<div>
			<NavBar />
			<div className='w-full h-full flex md:mt-[2%] md:items-start mt-[80px] overflow-hidden justify-center'>
				{/* The rest of your protected content */}

				<div className='title items-center flex flex-col'>
					<h3 className='text-[#6D2E46] font-bold md:text-4xl text-2xl md:px-10 px-6 text-center'>
						Welcome To Your CertifyHub - Exam Prep Portal
					</h3>
					<p className='md:text-xl text-center mt-4 md:px-10 px-6 md:w-[70vw] w-full text-[#696969] font-medium'>
						This is an Exam preparatory platform to fully equip you with all the
						necessary information you need to clear your professional exam in
						one-sitting. This preparatory platform contains exam simulations,
						study materials and also exam guidelines.
					</p>

					<div className='flex flex-wrap items-center justify-center w-full mt-6 gap-4'>
						{[
							{
								path: '/page/itil-v4',
								label: 'ITIL-V4',
							},
							{
								path: '/page/kcna',
								label: 'CNCF KCNA',
							},
						].map(({ path, label }) => (
							<div
								key={path}
								onClick={() => handleNavigation(path)}
								className='cursor-pointer left md:h-[200px] md:w-[200px] w-[150px] h-[150px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex md:p-10 p-2 flex-col text-center justify-center items-center font-bold text-[#696969]'>
								{label}
							</div>
						))}
					</div>
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
		</div>
	);
};

export default Page;
