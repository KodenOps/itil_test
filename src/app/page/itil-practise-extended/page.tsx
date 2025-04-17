'use client';
import Practise from '@/app/components/practise/Practice';
import React, { useEffect } from 'react';
import { itilQuestions } from '@/data/questionBank';
const page = () => {
	let num = itilQuestions.length;
	useEffect(() => {
		// Check if localStorage is available
		if (typeof localStorage === 'undefined') {
			console.warn('localStorage is not available in this environment.');
		} else {
			localStorage.clear();
		}
	}, []);
	return (
		<div>
			<Practise
				questionBank={itilQuestions}
				qnumber={num}
			/>
		</div>
	);
};

export default page;
