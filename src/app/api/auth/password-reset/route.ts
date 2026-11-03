import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  clientKey,
  isSameOriginRequest,
  rateLimit,
} from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  action?: string;
  email?: string;
  token?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * Password recovery in two steps.
 *
 *   action: "request"  → asks Supabase Auth to generate and email a one-time
 *                        six-digit recovery code (the Reset Password template
 *                        must include {{ .Token }}).
 *   action: "verify"   → verifies that code, then changes the password.
 *
 * The response to "request" is always the same, so this endpoint cannot be
 * used to discover which email addresses have accounts.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return json({ error: "Cross-site request blocked." }, 403);
  }

  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "Send a JSON body." }, 400);
  }

  const action = body.action;
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json({ error: "Enter a valid email address." }, 400);
  }

  if (action === "request") {
    const limit = rateLimit(
      `password-reset:request:${email}:${clientKey(request)}`,
      3,
      15 * 60 * 1000,
    );

    if (!limit.ok) {
      return json(
        {
          error: `Too many reset requests. Try again in ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minute(s).`,
        },
        429,
      );
    }

    try {
      const supabase = await createClient();
      const origin = new URL(request.url).origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/forgot-password?link=1`,
      });

      if (error) {
        console.error("Password reset email failed:", error.message);
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      return json(
        { error: "Password reset is unavailable right now. Try again later." },
        503,
      );
    }

    return json({
      ok: true,
      message:
        "If that email has an account, a six-digit reset code is on its way.",
    });
  }

  if (action === "verify") {
    const limit = rateLimit(
      `password-reset:verify:${email}:${clientKey(request)}`,
      10,
      15 * 60 * 1000,
    );

    if (!limit.ok) {
      return json(
        {
          error: `Too many attempts. Try again in ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minute(s).`,
        },
        429,
      );
    }

    const token = String(body.token ?? "").replace(/\s+/g, "");
    const password = String(body.password ?? "");

    if (!/^\d{6}$/.test(token)) {
      return json({ error: "Enter the six-digit code from your email." }, 400);
    }

    if (password.length < 8 || password.length > 72) {
      return json(
        { error: "Use a password between 8 and 72 characters." },
        400,
      );
    }

    try {
      const supabase = await createClient();

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      });

      if (verifyError) {
        return json(
          {
            error:
              "That code is invalid or has expired. Request a new code and try again.",
          },
          400,
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Could not update password:", updateError.message);
        return json(
          {
            error:
              updateError.message ||
              "Could not save that password. Try a different one.",
          },
          400,
        );
      }

      // The recovery session is no longer needed. The learner signs in with
      // the new password, which also proves it was saved correctly.
      await supabase.auth.signOut({ scope: "local" });

      return json({
        ok: true,
        message: "Password updated. Sign in with your new password.",
      });
    } catch (error) {
      console.error("Password verify failed:", error);
      return json(
        { error: "Could not reset the password right now. Try again." },
        500,
      );
    }
  }

  return json({ error: "Unknown action." }, 400);
}
