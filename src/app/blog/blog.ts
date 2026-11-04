import docker2 from "../../../public/images/docker1.webp";
import github from "../../../public/images/github.webp";
import dockerImage from "../../../public/images/docker.webp";
import kuber from "../../../public/images/kuber1.webp";
import kuber2 from "../../../public/images/kuber2.webp";
import mq from "../../../public/images/mq.webp";
import cdn from "../../../public/images/cdn.webp";
import caching from "../../../public/images/80615804-8025-4b66-a072-7d5a323dff14.gif";
import code_works from "../../../public/images/code_works.webp";
import data_viz from "../../../public/images/data_viz.webp";
import type { BlogContentBlock, BlogSource } from "@/types/app";

/**
 * A post that lives in the repository rather than the database. The studio
 * post below is the DevOps & Systems Engineering track moved off the course
 * catalogue and onto the blog; the rest mirror the Kodenops Hashnode
 * publication and link out to the original.
 */
export type StaticBlogPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  category: string;
  source: BlogSource;
  externalUrl: string | null;
  coverImage: string | null;
  /** Only studio posts carry an article body. */
  content?: BlogContentBlock[];
  readMinutes?: number;
};

const image = (value: unknown) => value as unknown as string;

export const studioPost: StaticBlogPost = {
  title: "DevOps and Systems Engineering: The Practical Recap",
  slug: "devops-sys-engineer",
  summary:
    "Everything the DevOps & Systems Engineering track covered — containers, orchestration, delivery pipelines, caching, queues and observability — rewritten as one read you can finish before the paper.",
  publishedAt: "2026-05-01",
  category: "DevOps & Sys Eng",
  source: "studio",
  externalUrl: null,
  coverImage: image(dockerImage),
  readMinutes: 14,
  content: [
    {
      type: "paragraph",
      text: "This is the recap track for DevOps and Systems Engineering. Instead of working through a catalogue of lessons, read it top to bottom once, then come back to the sections you cannot explain out loud. Every idea here maps to a question type you will meet in the exam: define the tool, diagnose the failure, choose the trade-off.",
    },
    {
      type: "callout",
      title: "How to use this post",
      text: "Read a section, close the page, and say the idea back in your own words. If you stall, that section is the one to revise — not the whole track.",
    },
    { type: "heading", level: 2, text: "1. What DevOps is actually for" },
    {
      type: "paragraph",
      text: "DevOps is not a job title or a toolchain. It is the practice of removing the wall between the people who change software and the people who keep it running, so that changes reach users sooner and break less often. Everything else — containers, pipelines, observability — exists to make that overlap cheap.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Culture: shared ownership of production, blameless reviews after failures.",
        "Automation: anything done twice by a human becomes a script, then a pipeline step.",
        "Measurement: you cannot improve a delivery process you never observe.",
        "Sharing: runbooks, ADRs and post-incident notes are part of the deliverable.",
      ],
    },
    { type: "heading", level: 2, text: "2. Containers and images" },
    {
      type: "paragraph",
      text: "A container is a process with its own filesystem, network namespace and resource limits, sharing the host kernel. An image is that filesystem frozen into layers. This is why a container starts in milliseconds while a virtual machine boots an operating system.",
    },
    {
      type: "paragraph",
      text: "An image is built from a Dockerfile, one instruction per layer. Layers are cached and immutable, so put the things that change least at the top: base image, then system packages, then dependency manifests, then application code.",
    },
    {
      type: "code",
      language: "dockerfile",
      text: "FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-alpine\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=build /app/.next ./.next\nCOPY --from=build /app/node_modules ./node_modules\nEXPOSE 3000\nCMD [\"npm\", \"start\"]",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Multi-stage builds keep compilers and dev dependencies out of the shipped image.",
        "A .dockerignore file is as important as .gitignore — context size is build time.",
        "Pin base image tags. `latest` makes a rebuild non-reproducible.",
        "Run as a non-root user so a container escape is not a root shell on the host.",
      ],
    },
    {
      type: "callout",
      title: "Exam angle",
      text: "If a question asks why a rebuild ignored a code change, suspect cache invalidation order: copying the whole source tree before installing dependencies busts the dependency layer every time.",
    },
    { type: "heading", level: 2, text: "3. Kubernetes: the control loop" },
    {
      type: "paragraph",
      text: "Kubernetes is a set of controllers that compare desired state (what you declared) with observed state (what is running) and act on the difference. You never tell it to create a pod; you declare a Deployment and the controllers reconcile until pods exist.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "kube-apiserver — the only component that talks to etcd; everything else goes through it.",
        "etcd — the consistent key-value store holding the whole cluster state.",
        "scheduler — places pods on nodes based on requests, affinity and taints.",
        "kubelet — runs and reports pods on its node.",
        "kube-proxy — programs the networking rules that let Services route traffic.",
      ],
    },
    {
      type: "paragraph",
      text: "The objects that matter for the exam are Pod (smallest unit, one or more containers), Deployment (replica management and rolling updates), Service (a stable virtual IP over a shifting pod set), ConfigMap and Secret (configuration), and Ingress (HTTP routing into the cluster).",
    },
    {
      type: "quote",
      text: "Declarative configuration means the cluster converges on your file. Imperative commands are for debugging, not for delivery.",
      attribution: "Kubernetes in one sentence",
    },
    { type: "heading", level: 2, text: "4. Delivery pipelines" },
    {
      type: "paragraph",
      text: "A pipeline turns a commit into a deployed change through repeatable stages: build, test, package, scan, deploy, verify. Continuous integration keeps the main branch releasable; continuous delivery keeps every build deployable; continuous deployment removes the human click entirely.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Build once, promote the same artifact through environments — never rebuild per environment.",
        "Fail fast: lint and unit tests before expensive integration suites.",
        "Gate the deploy on health checks, not on the pipeline finishing.",
        "Keep a tested rollback path; a blue-green or canary rollout buys you time.",
      ],
    },
    {
      type: "code",
      language: "yaml",
      text: "deploy:\n  stage: deploy\n  script:\n    - kubectl set image deployment/web web=$IMAGE_TAG\n    - kubectl rollout status deployment/web --timeout=120s\n  only:\n    - main",
    },
    { type: "heading", level: 2, text: "5. Caching and the edge" },
    {
      type: "paragraph",
      text: "Caching is trading freshness for speed. The hard part is never the cache, it is invalidation. Every cache needs a key, a lifetime and a strategy for the moment the source changes.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Cache-aside: the app reads the cache, falls back to the database, then fills the cache.",
        "Write-through: writes hit the cache and the store together — simpler, slower writes.",
        "TTL plus versioned keys is the most reliable invalidation strategy in practice.",
        "A CDN is a cache with global geography: static assets gain `max-age` and `immutable`, HTML stays short-lived or `no-store`.",
      ],
    },
    {
      type: "paragraph",
      text: "A CDN also absorbs traffic spikes and terminates TLS closer to the user. Ask for the cache key: if a response varies by cookie or authorisation header, the CDN will struggle to cache it at all.",
    },
    { type: "heading", level: 2, text: "6. Message queues and asynchronous work" },
    {
      type: "paragraph",
      text: "A queue decouples the producer from the consumer. The producer gets a fast acknowledgement, the consumer works at its own pace, and a spike becomes a backlog instead of an outage.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "At-least-once delivery is the default; consumers must be idempotent.",
        "A dead-letter queue holds messages that fail repeatedly so they stop blocking the pipeline.",
        "Visibility timeouts decide when an unacknowledged message is retried — too short creates duplicates, too long creates stalls.",
        "Ordering is a per-partition guarantee, never a global one, unless the broker says otherwise.",
      ],
    },
    { type: "heading", level: 2, text: "7. Observability" },
    {
      type: "paragraph",
      text: "Logs tell you what happened, metrics tell you how much, traces tell you where the time went. Together they answer the only production question that matters: is the user's experience degraded, and which component is responsible?",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Track latency at percentiles (p50, p95, p99), never averages alone.",
        "Alert on symptoms users feel — error rate and saturation — not on every internal counter.",
        "Give every request a correlation id and thread it through logs and traces.",
        "Dashboards should be able to answer 'was this deploy responsible?' in under a minute.",
      ],
    },
    {
      type: "image",
      url: image(data_viz),
      alt: "CloudWatch dashboard with request metrics",
      caption: "AWS CloudWatch: metrics grouped by service, with alarms on the p99.",
    },
    { type: "heading", level: 2, text: "8. Exam-day checklist" },
    {
      type: "list",
      ordered: true,
      items: [
        "Name the tool, then name the problem it removes — most marks live in the second half.",
        "When a question describes a failure, identify whether it is state (desired vs observed) or connectivity (DNS, routing, ports).",
        "For trade-off questions, state the cost as clearly as the benefit.",
        "Use the vocabulary precisely: image vs container, delivery vs deployment, at-least-once vs exactly-once.",
      ],
    },
    {
      type: "callout",
      title: "One last thing",
      text: "You do not need to memorise every kubectl flag. You need to be able to explain why the cluster behaves the way it does. That is what the paper is testing.",
    },
  ],
};

export const staticBlogPosts: StaticBlogPost[] = [
  {
    title: "Building Docker Images",
    slug: "building-docker-images",
    summary:
      "Learn how to build Docker images efficiently and reliably for your applications.",
    publishedAt: "2026-03-14",
    category: "Containers",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/building-docker-images",
    coverImage: image(dockerImage),
  },
  {
    title: "Working With Your First Pod",
    slug: "working-with-your-first-pod",
    summary:
      "A beginner's guide to launching and managing your first Kubernetes pods.",
    publishedAt: "2025-09-13",
    category: "Kubernetes",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/working-with-your-first-pod",
    coverImage: image(docker2),
  },
  {
    title: "Setting up Git Authentication via Ubuntu Terminal",
    slug: "setting-up-git-authentication-via-ubuntu-terminal",
    summary:
      "A step-by-step tutorial for setting up SSH-based Git authentication on Ubuntu.",
    publishedAt: "2026-04-01",
    category: "Tooling",
    source: "hashnode",
    externalUrl:
      "https://kodenops.hashnode.dev/setting-up-git-authentication-via-ubuntu-terminal",
    coverImage: image(github),
  },
  {
    title: "Kubernetes: Getting Started",
    slug: "kubernetes-getting-started",
    summary:
      "Get started with Kubernetes and learn the fundamentals of cluster deployment.",
    publishedAt: "2025-09-02",
    category: "Kubernetes",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/kubernetes-getting-started",
    coverImage: image(kuber),
  },
  {
    title: "Kubernetes: Architecture Explained",
    slug: "kubernetes-architecture-explained",
    summary:
      "Understand Kubernetes architecture, components, and how they work together.",
    publishedAt: "2025-09-01",
    category: "Kubernetes",
    source: "hashnode",
    externalUrl:
      "https://kodenops.hashnode.dev/kubernetes-architecture-explained",
    coverImage: image(kuber2),
  },
  {
    title: "Kuber — What?",
    slug: "kuber-what",
    summary:
      "An introduction to Kubernetes and the problems it solves in modern infrastructure.",
    publishedAt: "2025-09-01",
    category: "Kubernetes",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/kuber-what",
    coverImage: image(kuber2),
  },
  {
    title: "Message Queues: Making Sure Nobody Fights Over Cake or Data (or Both)",
    slug: "message-queues-making-sure-nobody-fights-over-cake-or-data-or-both",
    summary:
      "A simplified explanation of asynchronous message handling and queue systems.",
    publishedAt: "2025-08-20",
    category: "Architecture",
    source: "hashnode",
    externalUrl:
      "https://kodenops.hashnode.dev/message-queues-making-sure-nobody-fights-over-cake-or-data-or-both",
    coverImage: image(mq),
  },
  {
    title: "Content Delivery Network (CDN)",
    slug: "content-delivery-network-cdn",
    summary:
      "Learn why CDNs matter and how they make websites faster and more resilient.",
    publishedAt: "2025-08-04",
    category: "Networking",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/content-delivery-network-cdn",
    coverImage: image(cdn),
  },
  {
    title: "Caching: Deliver Content Faster Than Bolt",
    slug: "caching-deliver-content-faster-than-bolt",
    summary:
      "An easy guide to caching, cache invalidation, and why your app needs it.",
    publishedAt: "2025-08-02",
    category: "Performance",
    source: "hashnode",
    externalUrl: "https://kodenops.hashnode.dev/caching-deliver-content-faster-than-bolt",
    coverImage: image(caching),
  },
  {
    title: "Why Your Code Works on Your Machine But Not on Mine (And How to Fix It)",
    slug: "why-your-code-works-on-your-machine-but-not-on-mine-and-how-to-fix-it",
    summary:
      "Troubleshoot environment-specific bugs and learn how to make your code portable.",
    publishedAt: "2025-08-02",
    category: "Debugging",
    source: "hashnode",
    externalUrl:
      "https://kodenops.hashnode.dev/why-your-code-works-on-your-machine-but-not-on-mine-and-how-to-fix-it",
    coverImage: image(code_works),
  },
  {
    title: "Data Visualization With AWS CloudWatch",
    slug: "data-visualization-with-aws-cloudwatch",
    summary:
      "A practical guide to real-time monitoring and visualization using AWS CloudWatch.",
    publishedAt: "2025-08-02",
    category: "Observability",
    source: "hashnode",
    externalUrl:
      "https://kodenops.hashnode.dev/data-visualization-with-aws-cloudwatch",
    coverImage: image(data_viz),
  },
];
