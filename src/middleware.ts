import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// NOTE: Next.js 16 renamed the `middleware.ts` file convention to
// `proxy.ts` (export `proxy` instead of `middleware`). This file still
// works on Next.js 16 — you'll just get a deprecation warning. To migrate:
//   npx @next/codemod@canary middleware-to-proxy .
// Check your version with `npx next --version` before deciding.

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
