import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join } from "path";

// This points to your folder outside /public
const MATERIALS_DIR = join(process.cwd(), "secured_files");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  // Map IDs to actual file names
  const files: Record<string, string> = {
    "exam-guidelines": "exam_guideline.pdf",
    "itil-textbook": "itil-textbook.pdf",
    "itil-exam-study": "itil-study.pdf",
    "itil-slides": "itil-slides.pdf",
    "module-one-key-concept": "Module1.pdf",
    "module-two-key-concept": "Module2.pdf",
    "module-three-itil-vs": "Module3.pdf",
    "module-four-governance": "Module4.pdf",
    "module-five-guiding-principles": "Module5.pdf",
    "module-six-value-chain": "Module6.pdf",
    "module-six-one-operating-models": "Module6_6.1.pdf",
    "module-six-two-managment-practice": "Module6_6.2.pdf",
    "module-six-three-discover-activity": "Module6_6.3.pdf",
    "module-six-four-design-activity": "Module6_6.4.pdf",
    "module-six-five-acquire-activity": "Module6_6.5.pdf",
    "module-six-six-build-activity": "Module6_6.6.pdf",
    "module-six-seven-transition-activity": "Module6_6.7.pdf",
    "module-six-eight-operate-activity": "Module6_6.8.pdf",
    "module-six-nine-deliver-activity": "Module6_6.9.pdf",
    "module-six-ten-support-activity": "Module6_6.10.pdf",
    "module-seven-value-stream": "Module7.pdf",
    "module-eight-continual-improvement": "Module8.pdf",
    "module-nine-four-dimension": "Module9.pdf",
    "module-ten-itil-and-other-frameworks-integration": "Module10.pdf",
  };

  const fileName = files[id];
  if (!fileName) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const filePath = join(MATERIALS_DIR, fileName);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "File missing on server" },
      { status: 404 },
    );
  }

  // Stream the file back to the client
  const stream = createReadStream(filePath);
  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": fileName.endsWith(".pdf")
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
