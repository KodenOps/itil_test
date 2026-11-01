import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/security/redirect";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only same-site paths are accepted, so the emailed link cannot be turned
  // into an open redirect.
  const next = safeRedirectPath(searchParams.get("next"), "/");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Either no code was present, or the exchange failed (e.g. an expired or
  // already-used link). Send them back to login with a visible reason rather
  // than a bare error page.
  return NextResponse.redirect(`${origin}/login?error=access_denied`);
}
