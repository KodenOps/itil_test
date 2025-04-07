'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';

export default function CallbackPage() {
	const router = useRouter();

	useEffect(() => {
		const processAuth = async () => {
			const hash = window.location.hash;
			// If the token is in the hash (implicit flow)
			if (hash.includes('access_token')) {
				const params = new URLSearchParams(hash.substring(1));
				const access_token = params.get('access_token');
				const refresh_token = params.get('refresh_token');

				if (!access_token || !refresh_token) {
					console.error('Missing tokens in the URL hash');
					router.replace('/login');
					return;
				}

				// Set the session manually using the tokens extracted from the URL hash.
				const { error } = await supabase.auth.setSession({
					access_token,
					refresh_token,
				});

				if (error) {
					console.error('Set session error:', error.message);
					router.replace('/login');
					return;
				}

				// Now remove the hash from the URL so it’s no longer visible.
				history.replaceState(
					null,
					'',
					window.location.pathname + window.location.search
				);
				// Redirect to the protected page (home)
				router.replace('/');
			} else {
				// If no token in the URL, attempt to get the session
				const { data, error } = await supabase.auth.getSession();
				if (error || !data.session) {
					router.replace('/login');
				} else {
					router.replace('/');
				}
			}
		};

		processAuth();
	}, [router]);

	return (
		<div className='flex h-screen items-center justify-center'>
			<p className='text-gray-500 animate-pulse'>Signing you in...</p>
		</div>
	);
}
