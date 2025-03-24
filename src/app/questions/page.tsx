'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { itilQuestions } from '@/data/questionBank';

interface Question {
	id: string;
	question: string;
	options: string[];
	answer: string;
}

const LOCAL_STORAGE_KEY = 'quizState';

const Page = () => {
	const router = useRouter();

	// State Management
	const [timeLeft, setTimeLeft] = useState<number>(3600);
	const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: number]: string;
	}>({});
	const [score, setScore] = useState<number>(0);

	// Shuffle function (Fisher-Yates Algorithm)
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

	// Load quiz state from LocalStorage
	useEffect(() => {
		const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedState) {
			const parsedState = JSON.parse(savedState);
			setShuffledQuestions(parsedState.shuffledQuestions);
			setCurrentIndex(parsedState.currentIndex);
			setSelectedAnswers(parsedState.selectedAnswers);
			setScore(parsedState.score);
			setTimeLeft(parsedState.timeLeft);
		} else {
			// Shuffle questions once and store in localStorage
			const shuffled = shuffle(itilQuestions).slice(0, 40);
			setShuffledQuestions(shuffled);
		}
	}, []);

	// Auto-save to LocalStorage on state changes
	useEffect(() => {
		if (shuffledQuestions.length > 0) {
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify({
					shuffledQuestions,
					currentIndex,
					selectedAnswers,
					score,
					timeLeft,
				})
			);
		}
	}, [shuffledQuestions, currentIndex, selectedAnswers, score, timeLeft]);

	// Timer Effect
	useEffect(() => {
		if (timeLeft <= 0) return;
		const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
		return () => clearInterval(timer);
	}, [timeLeft]);

	// Format Timer Display
	const formatTime = (t: number): string =>
		[Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
			.map((v) => (v < 10 ? `0${v}` : v))
			.join(':');

	// Handle selecting an option
	const handleOptionSelect = (option: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[currentIndex]: option,
		}));
	};

	// Move to the next question
	const handleNextQuestion = () => {
		if (!selectedAnswers[currentIndex]) return; // Ensure answer is selected

		setCurrentIndex((prev) => prev + 1);
	};

	// Move to the previous question
	const handlePreviousQuestion = () => {
		setCurrentIndex((prev) => prev - 1);
	};

	// Handle finish: Calculate score, save, navigate
	const handleFinish = () => {
		// Calculate total score
		const totalScore = Object.keys(selectedAnswers).reduce((acc, key) => {
			const questionIndex = parseInt(key);
			return selectedAnswers[questionIndex] ===
				shuffledQuestions[questionIndex].answer
				? acc + 1
				: acc;
		}, 0);

		// Save to LocalStorage
		localStorage.setItem('finalScore', JSON.stringify(totalScore));
		localStorage.setItem(
			'totalQuestions',
			JSON.stringify(shuffledQuestions.length)
		);
		localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear state

		// Navigate to score page
		router.push('/score');

		// Reset quiz state in the background
		setTimeout(() => {
			const shuffled = shuffle(itilQuestions).slice(0, 50);
			setShuffledQuestions(shuffled);
			setCurrentIndex(0);
			setSelectedAnswers({});
			setScore(0);
			setTimeLeft(3600);
		}, 500);
	};

	return (
		<div>
			{/* Top Navigation */}
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

			{/* Display Current Question */}
			<div className='p-5 text-xl'>
				{shuffledQuestions.length > 0 &&
					shuffledQuestions[currentIndex].question}
			</div>

			{/* Display Options as Radio Buttons */}
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

			{/* Navigation Buttons */}
			<div className='p-5 flex justify-center gap-6'>
				<button
					onClick={handlePreviousQuestion}
					disabled={currentIndex === 0}
					className='px-10 py-4 bg-green-600 text-white rounded-lg disabled:bg-gray-400'>
					Previous
				</button>

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
		</div>
	);
};

export default Page;
