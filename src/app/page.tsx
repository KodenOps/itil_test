// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from './components/NavBar';
import Image from 'next/image';
import { FaManatSign } from 'react-icons/fa6';
import { GrKubernetes } from 'react-icons/gr';
import { SiKubernetes } from 'react-icons/si';
import { TbBrandAzure } from 'react-icons/tb';
import { MdOutlineWorkOutline } from 'react-icons/md';

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
			<div className='w-full h-full flex  md:items-start md:mt-[40px] mt-[20px] overflow-auto justify-center'>
				{/* The rest of your protected content */}

				<div className='title items-center flex flex-col'>
					<h3 className='text-[#2660A4] font-bold md:text-4xl text-2xl md:px-10 px-6 text-center'>
						Welcome To Your CertifyHub - Exam Prep Portal
					</h3>
					<p className='md:text-xl text-center mt-4 md:px-10 px-6 md:w-[70vw] w-full text-[#696969] font-medium'>
						Kindly select the exam you want to prepare for below.
					</p>

					<div className='flex flex-wrap items-center justify-center w-full mt-6 gap-4'>
						{[
							{
								path: '/page/itil-v4',
								label: 'ITIL V4',
								IconName: MdOutlineWorkOutline,
								colour: '#2660A4',
							},
							{
								path: '/page/kcna',
								label: 'KCNA',
								IconName: SiKubernetes,
								colour: '#26a465',
							},
							// {
							// 	path: '/page/kcna',
							// 	label: 'AZ-900',
							// 	IconName: TbBrandAzure,
							// 	colour: '#2660A4',
							// },
						].map(({ path, label, IconName, colour }) => (
							<div
								key={label}
								onClick={() => handleNavigation(path)}
								style={{ backgroundColor: colour }}
								className='cursor-pointer h-[280px] md:w-[200px] w-[180px]  rounded-sm   font-bold text-[#696969]  relative'>
								<div className=' h-full px-4 w-full'>
									<IconName
										size={60}
										color='#fff'
										className='mt-8'
									/>
								</div>
								<h3 className='text-[#ffffff] text-5xl absolute w-full bottom-8 text-center'>
									{label}
								</h3>
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
