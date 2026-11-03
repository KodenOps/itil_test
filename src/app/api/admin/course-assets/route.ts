import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import {
  clientKey,
  isSameOriginRequest,
  rateLimit,
} from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "course-assets";
const MAX_BYTES = 8 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Admin-only image upload for the course studio. Files land in the public
 * course-assets bucket; only the resulting URL is stored in the page JSON.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Cross-site request blocked." },
      { status: 403 },
    );
  }

  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (viewer.profile.role !== "admin") {
    return NextResponse.json(
      { error: "Only administrators can upload course images." },
      { status: 403 },
    );
  }

  const limit = rateLimit(`course-asset:${viewer.userId}:${clientKey(request)}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many uploads. Wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    const extension = IMAGE_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, GIF or AVIF image." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Images must be 8MB or smaller." },
        { status: 400 },
      );
    }

    const path = `course-images/${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await viewer.supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Course asset upload failed:", error.message);
      return NextResponse.json(
        {
          error:
            "Could not upload that image. Re-run supabase/schema.sql to create the course-assets bucket.",
        },
        { status: 500 },
      );
    }

    const { data } = viewer.supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ ok: true, url: data.publicUrl });
  } catch (error) {
    console.error("Course asset upload error:", error);
    return NextResponse.json({ error: "Could not upload that image." }, { status: 500 });
  }
}
