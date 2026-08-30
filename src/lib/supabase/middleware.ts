import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type SupabaseCookie = {
  name: string;
  value: string;
  options?: {
    path?: string;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    domain?: string;
  };
};

function ensureEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

const PUBLIC_PATHS = ["/", "/login", "/auth/callback"] as const;

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  // Start with a default response; we'll recreate it if cookies change.
  let response = NextResponse.next();

  const supabase = createServerClient(
    ensureEnv("NEXT_PUBLIC_SUPABASE_URL"),
    ensureEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll(): SupabaseCookie[] {
          // Normalize Next.js cookie objects to the shape Supabase expects.
          return request.cookies
            .getAll()
            .map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet: SupabaseCookie[]): void {
          // Write refreshed cookies to the incoming request (so Server
          // Components downstream see the new token) and the outgoing
          // response (so the browser gets it too).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Recreate the response with the possibly-updated request
          // so that downstream code sees the new cookies.
          response = NextResponse.next({ request } as unknown as ResponseInit);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any),
          );
        },
      },
    },
  );

  // getClaims() cryptographically verifies the JWT on every request.
  // Never substitute getSession() here — it reads from cookies without
  // re-validating them, which a spoofed cookie could satisfy.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
