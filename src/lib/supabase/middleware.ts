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

/** Routes that need a verified session. Everything else is public. */
const PROTECTED_PREFIXES = ["/admin", "/profile", "/page", "/score"];

/** Public even though they live under a protected prefix. */
const PUBLIC_EXCEPTIONS = ["/page/suggestion"];

function isProtected(pathname: string) {
  if (
    PUBLIC_EXCEPTIONS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return false;
  }

  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let response = NextResponse.next();

  let supabase: ReturnType<typeof createServerClient>;

  try {
    supabase = createServerClient(
      ensureEnv("NEXT_PUBLIC_SUPABASE_URL"),
      ensureEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
      {
        cookies: {
          getAll() {
            return request.cookies
              .getAll()
              .map((c) => ({ name: c.name, value: c.value }));
          },
          setAll(cookiesToSet: SupabaseCookie[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as never),
            );
          },
        },
      },
    );
  } catch (error) {
    // Without Supabase env vars the app can still render the login screen.
    console.error("Supabase middleware is not configured:", error);
    return response;
  }

  // getClaims() verifies the JWT signature on every request. Never swap this
  // for getSession(), which trusts the cookie without re-validating it.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname, searchParams } = request.nextUrl;

  if (!user && isProtected(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    const callbackUrl = searchParams.get("callbackUrl");
    const target =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}
