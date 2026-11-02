import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getViewer } from "@/lib/supabase/profile";
import {
  clientKey,
  isSameOriginRequest,
  rateLimit,
} from "@/lib/security/request";

// ─── Config ──────────────────────────────────────────────────────────────────
// Required env vars (set these in .env.local / your hosting provider):
//   RESEND_API_KEY      — your Resend API key
//   ASSESSMENT_FROM     — a sender address on a domain verified in Resend,
//                          e.g. "Assessments <assessments@yourdomain.com>"
//   ASSESSMENT_TO       — where completed submissions should land,
//                          e.g. "you@yourdomain.com" (comma-separate for multiple)

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_EXTENSIONS = [".xlsx", ".xlsm"];

export const runtime = "nodejs";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    // Route handlers don't get the automatic Origin check that Server
    // Actions do, so a cross-site form post has to be rejected explicitly.
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    }

    // Submissions trigger a real email with an attachment, so require a
    // verified session and cap the rate per client.
    const viewer = await getViewer();

    if (!viewer) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const limit = rateLimit(`assessment:${viewer.userId}:${clientKey(req)}`, 5, 10 * 60 * 1000);

    if (!limit.ok) {
      return NextResponse.json(
        {
          error: `Too many submissions. Try again in ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minute(s).`,
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    // The submitter's identity always comes from the verified session, never
    // from the form, so the name and email shown on the page cannot be
    // swapped out by editing the request.
    const email = (viewer.email ?? viewer.profile.email ?? "").trim();
    const name =
      viewer.profile.fullName?.trim() || email.split("@")[0] || "Learner";

    const formData = await req.formData();
    const taskName = formData.get("taskName");
    const courseSlugValue = formData.get("courseSlug");
    const file = formData.get("file");
    const courseSlug =
      typeof courseSlugValue === "string" && courseSlugValue.trim()
        ? courseSlugValue.trim()
        : "excel-fundamentals";
    const taskLabel = typeof taskName === "string" ? taskName.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Your account email is not valid. Please contact support." },
        { status: 400 },
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A workbook file is required." },
        { status: 400 },
      );
    }

    const lowerName = file.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext),
    );
    if (!hasValidExt) {
      return NextResponse.json(
        { error: `File must be one of: ${ACCEPTED_EXTENSIONS.join(", ")}` },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
        { status: 400 },
      );
    }

    // A seat on the track is required, and the submission is stored first so
    // the admin dashboard can grade it even if the notification email fails.
    const { data: enrollment } = await viewer.supabase
      .from("course_enrollments")
      .select("id, courses!inner(slug)")
      .eq("user_id", viewer.userId)
      .eq("courses.slug", courseSlug)
      .maybeSingle<{ id: string }>();

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course." },
        { status: 403 },
      );
    }

    const { data: submission, error: insertError } = await viewer.supabase
      .from("assessment_submissions")
      .insert({
        user_id: viewer.userId,
        full_name: name,
        email,
        file_path: file.name,
        course_slug: courseSlug,
        task_name: taskLabel || null,
        status: "pending",
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (insertError || !submission) {
      console.error("Could not store assessment submission:", insertError?.message);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.ASSESSMENT_FROM;
    const toAddress = process.env.ASSESSMENT_TO;

    if (apiKey && fromAddress && toAddress) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from: fromAddress,
        to: toAddress.split(",").map((a) => a.trim()),
        replyTo: email,
        subject: `New assessment submission — ${name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Task:</strong> ${escapeHtml(taskLabel)}</p>
          <p><strong>File:</strong> ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)</p>
          <p>Grading status: <strong>Pending Grading</strong> — add the score in the admin dashboard.</p>
        `,
        attachments: [
          {
            filename: file.name,
            content: buffer,
          },
        ],
      });

      if (error) {
        // The row is stored, so grading can still happen from the dashboard.
        console.error("Resend error:", error);
      }
    } else {
      console.warn(
        "Assessment email is not configured; the submission is stored for dashboard grading.",
      );
    }

    return NextResponse.json({
      ok: true,
      submissionId: submission.id,
      status: "pending",
    });
  } catch (err) {
    console.error("Assessment submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
