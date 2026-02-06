'use client';
import React, { useState } from 'react';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';

const Page = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [category, setCategory] = useState(''); // <-- state for toggling

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!category) return alert('Please select a category!');
		setLoading(true);
		setSuccess(false);

		const form = e.currentTarget;
		const nickname = form.nickname.value;
		const message = form.message.value;

		const data = new FormData();
		data.append('entry.365554737', nickname);
		data.append('entry.1431201800', category);
		data.append('entry.1015083103', message);

		await fetch(
			'https://docs.google.com/forms/d/e/1FAIpQLSdH0mps98HT0sjwj13YfInLSb5heGpiZxMkl_DlN-2Kw57MBw/formResponse',
			{ method: 'POST', body: data, mode: 'no-cors' },
		);

		setLoading(false);
		setSuccess(true);
		form.reset();
		setCategory(''); // reset toggle
	}

	return (
		<div className='w-full h-auto min-h-screen'>
			<NavBar />
			<div className='mainbody pb-20'>
				<h3 className='md:text-4xl text-xl font-bold text-[#2660A4] text-center mt-[50px] mb-2 px-8'>
					Suggestions & Ideas Submission
				</h3>
				<p className='md:text-2xl text-xl text-center md:w-[70%] w-full mx-auto mb-8 px-4'>
					Kindly fill the form below to suggest new ideas or features you will
					like to see on this platform.
				</p>

				<div className='formsectiion flex justify-center bg-slate-50 md:w-[50%] md:mx-[25%] md:mt-16 mt-8 w-full h-auto py-10 px-6 rounded-lg gap-10'>
					<form
						onSubmit={handleSubmit}
						className='border-2 border-[#2660A4] rounded-lg p-6 w-full md:w-[90%] h-auto flex flex-col gap-4'>
						<input
							type='text'
							name='nickname'
							placeholder='Your Nickname *'
							required
						/>

						{/* Category toggle divs */}
						<div className='flex gap-4 mb-4 items-center'>
							<h3 className='text-lg font-mono text-[#2660A4]'>
								Category (select one):{' '}
							</h3>
							{['Suggestion', 'Report Bug'].map((option) => (
								<div
									key={option}
									onClick={() => setCategory(option)}
									className={`cursor-pointer px-4 py-2 rounded-lg border 
                    ${category === option ? 'bg-[#2660A4] text-white border-[#2660A4]' : 'bg-[#707070] text-black hover:text-white border-gray-300'}
                    hover:bg-[#1a4a80] hover:text-slate-100 text-white transition-colors duration-200`}>
									{option}
								</div>
							))}
						</div>

						<textarea
							name='message'
							placeholder='Your Suggestion or Idea *'
							rows={5}
							required
						/>

						<button
							disabled={loading}
							className='bg-[#2660A4] text-white p-[15px] md:w-[40%] w-full rounded-lg hover:bg-[#1a4a80] transition-colors duration-300 disabled:opacity-60'>
							{loading ? 'Submitting...' : 'Submit'}
						</button>

						{success && (
							<p className='text-green-600 text-center'>
								Submitted successfully 🎉
							</p>
						)}
					</form>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default Page;
