import { NextResponse } from "next/server";
import { Resend } from "resend";

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
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.ASSESSMENT_FROM;
    const toAddress = process.env.ASSESSMENT_TO;

    if (!apiKey || !fromAddress || !toAddress) {
      console.error(
        "Missing RESEND_API_KEY, ASSESSMENT_FROM, or ASSESSMENT_TO env vars.",
      );
      return NextResponse.json(
        {
          error:
            "Submission is not configured yet. Please contact the site owner.",
        },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const taskName = formData.get("taskName");
    const file = formData.get("file");

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress.split(",").map((a) => a.trim()),
      replyTo: email,
      subject: `New assessment submission — ${name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
        <p><strong>Task:</strong> ${escapeHtml(typeof taskName === "string" ? taskName : "")}</p>
        <p><strong>File:</strong> ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)</p>
        <p>Submitted via the Excel Practical Assessment page.</p>
      `,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send submission. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
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
