import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Either no code was present, or the exchange failed (e.g. the
  // before-user-created hook rejected this account). Send them back to
  // login with a visible reason rather than a bare error page.
  return NextResponse.redirect(`${origin}/login?error=access_denied`);
}
