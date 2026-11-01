import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getViewer } from "@/lib/supabase/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MATERIALS_DIR = path.join(process.cwd(), "secure-materials");
const SAFE_ID = /^[a-zA-Z0-9_-]{1,80}$/;

export async function GET(req: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No file ID provided" }, { status: 400 });
  }

  // Reject anything that could escape the materials folder (`../`, slashes,
  // null bytes, absolute paths) before touching the filesystem.
  if (!SAFE_ID.test(id)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  const filePath = path.resolve(MATERIALS_DIR, `${id}.pdf`);

  if (!filePath.startsWith(`${path.resolve(MATERIALS_DIR)}${path.sep}`)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Could not read PDF material:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
