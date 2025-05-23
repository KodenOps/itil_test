'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
	id: string;
	question: string;
	options: string[];
	answer: string;
	ShortExplanation: string;
}

interface PractiseProps {
	questionBank: Question[];
	qnumber: number;
	duration?: number; // Duration in seconds (default = 3600)
}

const LOCAL_STORAGE_KEY = 'quizState';

const Practise = ({
	questionBank,
	qnumber,
	duration = 3600,
}: PractiseProps) => {
	const router = useRouter();
	const [timeLeft, setTimeLeft] = useState<number>(duration);
	const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: number]: string;
	}>({});
	const [score, setScore] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const shuffle = (array: Question[]) => {
		let shuffledArray = [...array];
		for (let i = shuffledArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledArray[i], shuffledArray[j]] = [
				shuffledArray[j],
				shuffledArray[i],
			];
		}
		return shuffledArray;
	};

	useEffect(() => {
		const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedState) {
			const parsedState = JSON.parse(savedState);
			setShuffledQuestions(parsedState.shuffledQuestions);
			setCurrentIndex(parsedState.currentIndex);
			setSelectedAnswers(parsedState.selectedAnswers);
			setTimeLeft(parsedState.timeLeft);
			setScore(parsedState.score);
		} else {
			const shuffled = shuffle(questionBank).slice(0, qnumber);
			setShuffledQuestions(shuffled);
			setTimeLeft(duration); // Set time from prop
		}
	}, [questionBank, qnumber, duration]);

	useEffect(() => {
		if (shuffledQuestions.length > 0) {
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify({
					shuffledQuestions,
					currentIndex,
					selectedAnswers,
					timeLeft,
					score,
				})
			);
		}
	}, [shuffledQuestions, currentIndex, selectedAnswers, timeLeft, score]);

	const handleOptionSelect = (option: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[currentIndex]: option,
		}));
	};

	const handleNextQuestion = () => {
		if (!selectedAnswers[currentIndex]) return;
		setIsModalOpen(true);

		const isCorrect =
			selectedAnswers[currentIndex] === shuffledQuestions[currentIndex].answer;
		setScore((prev) => prev + (isCorrect ? 1 : 0));

		localStorage.setItem(
			'finalScore',
			JSON.stringify(score + (isCorrect ? 1 : 0))
		);
		localStorage.setItem(
			'totalQuestions',
			JSON.stringify(shuffledQuestions.length)
		);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setCurrentIndex((prev) => prev + 1);
	};

	const handleFinish = () => {
		localStorage.setItem('finalScore', JSON.stringify(score));
		localStorage.setItem(
			'totalQuestions',
			JSON.stringify(shuffledQuestions.length)
		);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		router.push('/score');
	};

	useEffect(() => {
		if (timeLeft === 0) {
			handleFinish();
			return;
		}
		const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000); // 1-second intervals
		return () => clearInterval(timer);
	}, [timeLeft]);

	const formatTime = (t: number): string =>
		[Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
			.map((v) => (v < 10 ? `0${v}` : v))
			.join(':');

	return (
		<div>
			<div className='topNav md:py-5 py-4 md:px-20 px-6 shadow-md w-full bg-white flex justify-between items-center'>
				<div className='text-2xl text-green-600'>
					Q{currentIndex + 1}/
					<span className='text-lg text-gray-400'>
						{shuffledQuestions.length}
					</span>
				</div>
				<div className='text-2xl font-mono text-gray-400'>
					{formatTime(timeLeft)}
				</div>
			</div>

			<div className='p-5 text-xl'>
				{shuffledQuestions.length > 0 &&
					shuffledQuestions[currentIndex].question}
			</div>

			<div className='p-5'>
				{shuffledQuestions.length > 0 &&
					shuffledQuestions[currentIndex].options.map((option, index) => (
						<div
							key={index}
							className='flex items-center text-xl mb-5 hover:bg-gray-100 p-4 cursor-pointer'>
							<input
								type='radio'
								id={`option-${index}`}
								className='w-6 h-6 accent-green-600 cursor-pointer'
								name={`question-${currentIndex}`}
								value={option}
								checked={selectedAnswers[currentIndex] === option}
								onChange={() => handleOptionSelect(option)}
							/>
							<label
								htmlFor={`option-${index}`}
								className='ml-2 cursor-pointer'>
								{option}
							</label>
						</div>
					))}
			</div>

			<div className='p-5 flex justify-center gap-6'>
				{currentIndex < shuffledQuestions.length - 1 ? (
					<button
						onClick={handleNextQuestion}
						disabled={!selectedAnswers[currentIndex]}
						className={`px-10 py-4 ${
							selectedAnswers[currentIndex]
								? 'bg-green-600'
								: 'bg-gray-400 cursor-not-allowed'
						} text-white rounded-lg`}>
						Next
					</button>
				) : (
					<button
						onClick={handleFinish}
						className='px-10 py-4 bg-red-600 text-white rounded-lg'>
						Finish
					</button>
				)}
			</div>

			{isModalOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-[#0009] bg-opacity-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
						<h2 className='text-xl font-semibold text-green-700 mb-2 text-center'>
							✨ Notification ✨
						</h2>
						<div className='flex items-center justify-center mb-3'>
							{selectedAnswers[currentIndex] ===
							shuffledQuestions[currentIndex].answer ? (
								<p className='text-green-600 font-semibold text-center'>
									✅ You got it right!
								</p>
							) : (
								<p className='text-red-600 font-semibold'>❌ Incorrect</p>
							)}
						</div>
						<p className='text-gray-700'>
							{shuffledQuestions[currentIndex].ShortExplanation}
						</p>
						<button
							onClick={handleCloseModal}
							className='mt-4 px-6 py-2 bg-green-600 text-white rounded-lg'>
							Next Question
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Practise;
