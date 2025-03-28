'use client';
import Practise from '@/app/components/practise/Practice';
import React from 'react';
import { itilQuestions } from '@/data/questionBank';
const page = () => {
	localStorage.clear();
	return (
		<div>
			<Practise
				questionBank={itilQuestions}
				qnumber={40}
			/>
		</div>
	);
};

export default page;
