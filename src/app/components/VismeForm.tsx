import React from 'react';
import Script from 'next/script';

const VismeForm = () => {
	return (
		<div
			className='visme_d w-screen h-full bg-red-500'
			data-title='Suggestion Form'
			data-url='dwox7z77-suggestion-form?fullPage=true'
			data-domain='forms'
			data-full-page='false'
			data-min-height='90vh'
			data-form-id='144015'>
			<Script
				src='https://static-bundles.visme.co/forms/vismeforms-embed.js'
				strategy='lazyOnload'
			/>
		</div>
	);
};

export default VismeForm;
