'use client';
import React from 'react';
import { itilQuestions } from '@/data/questionBank';
import Exam from '@/app/components/questions/Exam';
const page = () => {
	localStorage.clear();
	return (
		<div>
			<Exam
				questionBank={itilQuestions}
				qnumber={40}
			/>
		</div>
	);
};

export default page;
