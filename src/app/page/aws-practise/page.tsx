'use client';
import React from 'react';
import { aws_question_bank } from '@/data/aws_question';
import Exam from '@/app/components/questions/Exam';
import Practise from '@/app/components/practise/Practice';
const page = () => {
	localStorage.clear();
	return (
		<div>
			<Practise
				questionBank={aws_question_bank}
				qnumber={60}
			/>
		</div>
	);
};

export default page;
