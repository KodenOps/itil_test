/**
 * The course JSON contract, in one place.
 *
 * The admin studio only accepts a course as JSON. This object is the complete
 * sample: every field the `courses` table stores, every content block type the
 * course page renderer understands, and the question shape the question bank
 * importer reads. Admins edit the sample rather than starting from a blank file.
 */

export const sampleCourse = {
  course: {
    slug: "devops-sys-engineer",
    title: "DevOps & Systems Engineering",
    summary:
      "Containers, orchestration, delivery pipelines and observability — taught as one system, then tested the way the exam tests it.",
    track: "Infrastructure",
    level: "Intermediate",
    accentFrom: "#2660A4",
    accentTo: "#1F8A70",
    href: "/courses/devops-sys-engineer",
    icon: "work",
    estimatedHours: 24,
    position: 1,
    isPublished: false,
  },
  sections: [
    {
      title: "Why DevOps exists",
      intro:
        "The shortest possible definition, then the four practices that follow from it.",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "One team, one production",
        },
        {
          type: "paragraph",
          text: "DevOps removes the wall between the people who change software and the people who keep it running. Everything else — containers, pipelines, observability — exists to make that overlap cheap.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Exam angle",
          text: "Questions usually ask you to name the practice behind an outcome, not the tool. Learn the outcome first.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Culture: shared ownership of production.",
            "Automation: anything done twice becomes a pipeline step.",
            "Measurement: you cannot improve what you never observe.",
            "Sharing: runbooks and post-incident notes are deliverables.",
          ],
        },
        {
          type: "quote",
          text: "If it is not in version control, it does not exist.",
          attribution: "Infrastructure as code, in one line",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
          alt: "A terminal running a container build",
          caption: "Optional: any absolute image URL renders here.",
        },
        {
          type: "video_link",
          url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
          title: "Optional video walkthrough",
          description: "YouTube and Vimeo links become embeds.",
        },
        {
          type: "code",
          language: "bash",
          text: "docker build -t registry.example.com/app:1.4.0 .\ndocker push registry.example.com/app:1.4.0",
        },
        {
          type: "link",
          label: "Read the Kubernetes docs",
          url: "https://kubernetes.io/docs/concepts/",
          description: "Optional button-style link.",
        },
        {
          type: "file",
          label: "Download the worksheet",
          url: "https://example.com/devops-worksheet.pdf",
          description: "Optional file download.",
        },
        { type: "divider" },
      ],
    },
    {
      title: "Containers in practice",
      intro: "Images, layers and why build order changes build time.",
      blocks: [
        { type: "heading", level: 2, text: "Images are layered" },
        {
          type: "paragraph",
          text: "Each Dockerfile instruction creates a cached layer. Put what changes least at the top so a code change only rebuilds the tail of the image.",
        },
      ],
    },
  ],
  questions: [
    {
      id: "devops-001",
      category: "Containers",
      prompt:
        "Why does copying the whole source tree before running npm ci slow every rebuild down?",
      options: [
        "It disables the layer cache for dependency installation",
        "It makes the image larger at runtime",
        "It forces Docker to use the host network",
        "It bypasses .dockerignore",
      ],
      answer: 0,
      multiple: false,
      explanation:
        "A COPY of the full source changes the layer hash, so the cached dependency layer is never reused.",
      format: "practice-index",
    },
    {
      id: "devops-002",
      category: "Kubernetes",
      prompt: "Which components reconcile desired state with observed state?",
      options: [
        "The controllers in the control plane",
        "The container runtime on each node",
        "kubectl, when you run apply",
        "The CNI plugin",
      ],
      answer: 0,
      multiple: false,
      explanation:
        "kubectl only writes intent to the API server; controllers loop until reality matches it.",
      format: "practice-index",
    },
  ],
};

export const sampleCourseJson = JSON.stringify(sampleCourse, null, 2);

/** Field-by-field notes shown beside the editor. */
export const courseJsonNotes = [
  "course.slug is the URL and the key everything else hangs from — keep it stable.",
  "course.isPublished false keeps the course hidden from the catalogue until you flip it.",
  "sections[].blocks[].type accepts: heading, paragraph, image, video, video_link, code, callout, quote, list, link, file, divider.",
  "questions[].answer accepts an index, the option text, or a letter — the importer figures it out.",
  "questions[].format accepts exam-index, exam-text, practice-index or practice-text.",
];
