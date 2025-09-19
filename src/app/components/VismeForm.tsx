'use client';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const VismeForm = () => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		// Listen for when the visme script initializes the form
		const interval = setInterval(() => {
			const form = document.querySelector('.visme_d iframe');
			if (form) {
				setLoaded(true);
				clearInterval(interval);
			}
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='relative w-screen h-full min-h-[90vh]'>
			{/* {!loaded && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
					<p className='animate-pulse text-gray-600'>Loading form…</p>
				</div>
			)} */}

			<div
				className='visme_d w-full h-full'
				data-title='Suggestion Form'
				data-url='dwox7z77-suggestion-form?fullPage=true'
				data-domain='forms'
				data-full-page='false'
				data-min-height='90vh'
				data-form-id='144015'></div>
			<Script
				src='https://static-bundles.visme.co/forms/vismeforms-embed.js'
				strategy='afterInteractive'
			/>
		</div>
	);
};

export default VismeForm;
