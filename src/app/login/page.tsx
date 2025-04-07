'use client';
import { BsGithub } from 'react-icons/bs';
import { supabase } from '@/app/utils/supabase'; // Adjust path if necessary
import { useState } from 'react';

type OAuthProvider = 'github';

export default function Page() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [email, setEmail] = useState<string>('');

	const handleLogin = async (provider: OAuthProvider | 'email') => {
		setErrorMessage(null);
		try {
			if (provider === 'email') {
				// Email magic link authentication
				const { error } = await supabase.auth.signInWithOtp({
					email: email, // Use the email entered by the user
				});
				if (error) {
					setErrorMessage(error.message);
				}
			} else {
				// GitHub OAuth authentication
				const { error } = await supabase.auth.signInWithOAuth({
					provider: 'github',
					options: {
						redirectTo:
							'https://tetoyldltdxylaszrdpz.supabase.co/auth/v1/callback',
					},
				});
				if (error) {
					setErrorMessage(error.message);
				}
			}
		} catch (error) {
			setErrorMessage('An error occurred during login.');
		}
	};

	return (
		<div className='w-full h-screen flex items-center justify-center bg-slate-300'>
			<form
				className='p-4 bg-white shadow-lg md:min-h-[300px] md:min-w-[300px]'
				onSubmit={(e) => e.preventDefault()}>
				<h4 className='text-lg font-semibold text-center text-[#515151]'>
					Hello Stranger
				</h4>
				<p className='mb-4 text-[#878787]'>
					You need to be authenticated to use this app
				</p>
				<label htmlFor='email'>Email:</label>
				<br />
				<input
					id='email'
					name='email'
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)} // Update email state
					className='border-1 border-[#c4c4c4] w-full mb-2 py-2'
					required
				/>
				<br />
				<label htmlFor='password'>Password:</label>
				<br />
				<input
					id='password'
					name='password'
					type='password'
					className='border-1 border-[#c4c4c4] w-full mb-2 py-2'
					required
				/>
				<br />
				<button
					type='submit'
					className='button bg-black text-white font-semibold w-full py-2 rounded-md'
					onClick={() => handleLogin('email')}>
					Log in
				</button>
				<hr className='border-1 border-[#c4c4c4] mt-4' />
				<button
					type='button'
					onClick={() => handleLogin('github')}
					className='mt-4 border-1 border-black w-full py-2 rounded-md font-semibold flex items-center justify-center gap-4'>
					<BsGithub size={20} />
					Login With GitHub
				</button>
			</form>
		</div>
	);
}
