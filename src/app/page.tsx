// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';

const Page = () => {
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				router.replace('/');
			} else {
				setAuthenticated(true);
				setLoading(false);
			}
		};

		checkSession();
	}, [router]);

	// useEffect(() => {
	// 	const { data: authListener } = supabase.auth.onAuthStateChange(
	// 		async (event, session) => {
	// 			if (event === 'SIGNED_IN') {
	// 				if (window.location.hash) {
	// 					history.replaceState(null, '', window.location.pathname);
	// 				}
	// 			}
	// 		}
	// 	);

	// 	if (window.location.hash.includes('access_token')) {
	// 		supabase.auth.getSession().then(() => {
	// 			history.replaceState(null, '', window.location.pathname);
	// 		});
	// 	}

	// 	return () => {
	// 		authListener.subscription.unsubscribe();
	// 	};
	// }, []);

	const handleNavigation = (path: string) => {
		localStorage.clear();
		router.push(path);
	};

	// const handleLogout = async () => {
	// 	const { error } = await supabase.auth.signOut();
	// 	if (error) {
	// 		console.error('Error signing out:', error.message);
	// 	} else {
	// 		window.location.href = '/login';
	// 	}
	// };

	// // 👇 Prevent flashing
	// if (loading || !authenticated) {
	// 	return (
	// 		<div className='w-full h-screen flex items-center justify-center'>
	// 			<div className='animate-pulse space-y-4 w-[80%] max-w-xl text-center'>
	// 				<div className='h-6 bg-gray-300 rounded w-3/4 mx-auto' />
	// 				<div className='h-4 bg-gray-200 rounded w-5/6 mx-auto' />
	// 				<div className='flex justify-center gap-4 mt-6 flex-wrap'>
	// 					{Array(2)
	// 						.fill(0)
	// 						.map((_, i) => (
	// 							<div
	// 								key={i}
	// 								className='h-[150px] w-[150px] md:h-[200px] md:w-[200px] bg-gray-200 rounded-md'
	// 							/>
	// 						))}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className='w-full h-full flex md:mt-[5%] md:items-start mt-[80px] overflow-hidden justify-center'>
			{/* The rest of your protected content */}
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
				{/* <button
					className='mt-20 border-2 border-red-500 py-2 w-[100px] rounded-sm'
					onClick={handleLogout}>
					Logout
				</button> */}
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

export default Page;
