"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/supabase/profile";
import { rateLimit } from "@/lib/security/request";

export type CourseRequestResult = {
  ok: boolean;
  message: string;
};

/**
 * Where every course request lands. Overridable from the environment so the
 * inbox can change without a deploy, but the default is the owner's address.
 */
const REQUEST_INBOX =
  process.env.COURSE_REQUEST_TO?.trim() || "femifadiya.segun@outlook.com";

const LEVELS = ["Not sure yet", "Beginner", "Intermediate", "Advanced"] as const;

const MAX = {
  fullName: 80,
  email: 254,
  courseTitle: 120,
  message: 1000,
} as const;

function text(value: FormDataEntryValue | null, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidEmail(value: string): boolean {
  return value.length <= MAX.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function requestCourse(
  formData: FormData,
): Promise<CourseRequestResult> {
  // Honeypot: real people never fill a hidden field. Answer as if it worked
  // so bots do not learn the field is being screened.
  if (text(formData.get("website"), 200)) {
    return { ok: true, message: "Thanks — your request is with us." };
  }

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";

  const limit = rateLimit(`course-request:${ip}`, 5, 60 * 60 * 1000);

  if (!limit.ok) {
    return {
      ok: false,
      message: `You have sent several requests already. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60,
      )} minute(s).`,
    };
  }

  const viewer = await getViewer();

  // Signed-in requests are locked to the account in the form. Fall back to the
  // profile anyway so a request can never arrive unattributed.
  const fullName =
    text(formData.get("fullName"), MAX.fullName) ||
    (viewer?.profile.fullName ?? "").trim().slice(0, MAX.fullName) ||
    viewer?.email?.split("@")[0]?.slice(0, MAX.fullName) ||
    "";
  const submittedEmail = (
    text(formData.get("email"), MAX.email) ||
    viewer?.email ||
    ""
  ).toLowerCase();
  const courseTitle = text(formData.get("courseTitle"), MAX.courseTitle);
  const levelInput = text(formData.get("level"), 40);
  const message = text(formData.get("message"), MAX.message);

  if (fullName.length < 2) {
    return { ok: false, message: "Please tell us your name." };
  }

  if (!isValidEmail(submittedEmail)) {
    return { ok: false, message: "Enter a valid email address so we can reply." };
  }

  if (courseTitle.length < 3) {
    return { ok: false, message: "Tell us which course you would like." };
  }

  const level = (LEVELS as readonly string[]).includes(levelInput)
    ? levelInput
    : "Not sure yet";

  let supabase: Awaited<ReturnType<typeof createClient>> | null =
    viewer?.supabase ?? null;

  if (!supabase) {
    try {
      supabase = await createClient();
    } catch (error) {
      console.error("Supabase client unavailable for course request:", error);
    }
  }

  // Signed-in visitors are attributed to their account; guests are still
  // accepted because the catalogue is public.
  const email = viewer?.email?.toLowerCase() || submittedEmail;

  let saveError: { message: string } | null = null;

  if (supabase) {
    const { error } = await supabase.from("course_requests").insert({
      user_id: viewer?.userId ?? null,
      full_name: fullName,
      email,
      course_title: courseTitle,
      level,
      message: message || null,
      status: "new",
      source: "homepage",
    });

    saveError = error;
  } else {
    saveError = { message: "Supabase is not configured." };
  }

  if (saveError) {
    console.error("Could not save course request:", saveError.message);
  }

  let emailed = false;
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.COURSE_REQUEST_FROM?.trim() || process.env.ASSESSMENT_FROM?.trim();

  if (apiKey && fromAddress) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: [REQUEST_INBOX],
        replyTo: email,
        subject: `Course request — ${courseTitle} — ${fullName}`,
        html: `
          <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#0f172a">
            <h2 style="margin:0 0 12px">New course request</h2>
            <p style="margin:0 0 16px">Someone asked for a course on CertifyHub.</p>
            <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
              <tr><td style="font-weight:700;padding-right:16px">Name</td><td>${escapeHtml(fullName)}</td></tr>
              <tr><td style="font-weight:700;padding-right:16px">Email</td><td>${escapeHtml(email)}</td></tr>
              <tr><td style="font-weight:700;padding-right:16px">Course requested</td><td>${escapeHtml(courseTitle)}</td></tr>
              <tr><td style="font-weight:700;padding-right:16px">Level</td><td>${escapeHtml(level)}</td></tr>
              <tr><td style="font-weight:700;padding-right:16px">Account</td><td>${viewer ? "Signed in" : "Guest submission"}</td></tr>
              <tr><td style="font-weight:700;padding-right:16px">Received</td><td>${escapeHtml(new Date().toUTCString())}</td></tr>
            </table>
            <p style="margin:16px 0 4px;font-weight:700">Details</p>
            <p style="margin:0;white-space:pre-wrap">${escapeHtml(message || "—")}</p>
            <p style="margin:20px 0 0;font-size:12px;color:#64748b">Also saved in the admin dashboard under “Course requests”.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Course request email failed:", error);
      } else {
        emailed = true;
      }
    } catch (error) {
      console.error("Course request email threw:", error);
    }
  }

  if (saveError && !emailed) {
    return {
      ok: false,
      message:
        "We could not submit your request right now. Please try again in a moment.",
    };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    message: emailed
      ? "Request received — it is in the admin dashboard and on its way by email. We will get back to you."
      : "Request received and saved for the admin team. We will get back to you.",
  };
}
