'use client';
import { useEffect } from 'react';

const PreloadVismeForm = () => {
	useEffect(() => {
		const iframe = document.createElement('iframe');
		iframe.src =
			'https://forms.visme.co/formsPlayer/_embed/dwox7z77-suggestion-form?embedIframeId=preload';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.border = 'none';
		iframe.style.position = 'absolute';
		iframe.style.opacity = '0';
		document.body.appendChild(iframe);

		return () => {
			document.body.removeChild(iframe);
		};
	}, []);

	return null;
};

export default PreloadVismeForm;
