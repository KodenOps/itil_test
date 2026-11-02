import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import { ASSESSMENT_BUCKET, storedFileName } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (viewer.profile.role !== "admin" && viewer.profile.role !== "instructor") {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await viewer.supabase
    .from("assessment_submissions")
    .select("file_path")
    .eq("id", id)
    .maybeSingle<{ file_path: string }>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Submission not found." },
      { status: 404 },
    );
  }

  // Older rows only stored the original filename, so there is no object to
  // download for them.
  if (!data.file_path.includes("/")) {
    return NextResponse.json(
      { error: "This submission was created before files were stored." },
      { status: 404 },
    );
  }

  const { data: signed, error: signError } = await viewer.supabase.storage
    .from(ASSESSMENT_BUCKET)
    .createSignedUrl(data.file_path, 60, {
      download: storedFileName(data.file_path),
    });

  if (signError || !signed?.signedUrl) {
    console.error("Could not sign assessment file:", signError?.message);
    return NextResponse.json(
      { error: "Could not open that file." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
