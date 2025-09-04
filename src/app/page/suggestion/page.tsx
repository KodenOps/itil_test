'use client';
import React from 'react';
import Script from 'next/script';
import NavBar from '@/app/components/NavBar';

const Page = () => {
	return (
		<div className='w-full h-auto  '>
			<NavBar />
			<h3 className='text-xl font-bold text-[#6D2E46] text-center mt-[50px] mb-2'>
				Suggestions & Ideas Submission
			</h3>
			{/* visme form */}
			<div className='w-full iframe  md:px-4 md:mt-[-5%] mt-[-40%] px-2 h-auto flex justify-center items-center'>
				<div
					className='visme_d w-screen h-full bg-red-500'
					data-title='Suggestion Form'
					data-url='dwox7z77-suggestion-form?fullPage=true'
					data-domain='forms'
					data-full-page='false'
					data-min-height='90vh'
					data-form-id='144015'></div>
			</div>

			{/* Load Visme Embed Script */}
			<Script
				src='https://static-bundles.visme.co/forms/vismeforms-embed.js'
				strategy='lazyOnload'
			/>
		</div>
	);
};

export default Page;
