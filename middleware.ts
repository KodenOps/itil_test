// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
	// Create a Supabase client for the request
	const res = NextResponse.next();
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return req.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						req.cookies.set(name, value)
					);
					cookiesToSet.forEach(({ name, value, options }) =>
						res.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// Check for a session using Supabase's SSR method
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const { pathname } = req.nextUrl;

	// If the user is authenticated and is trying to access the login page...
	if (pathname === '/login' && session) {
		// Redirect to the home page
		return NextResponse.redirect(new URL('/', req.url));
	}

	return res;
}

// Only run this middleware on the /login route
export const config = {
	matcher: ['/login'],
};
