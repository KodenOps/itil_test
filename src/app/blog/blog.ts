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
 * A post that lives in the repository rather than the database: the DevOps
 * track overview, plus the posts that mirror the Kodenops Hashnode publication
 * and link out to the original.
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

/**
 * The DevOps & Systems Engineering track overview.
 *
 * It is not a course in the catalogue and it is not an article written in the
 * studio either: the page is hand-built at `/blog/devops-sys-engineer`, so this
 * entry only carries the card the blog index shows for it.
 */
export const devopsOverview: StaticBlogPost = {
  title: "DevOps and Systems Engineering",
  slug: "devops-sys-engineer",
  summary:
    "The exam-track overview: architecture and system thinking, scalability and reliability, data and backend fundamentals, execution and influence, operations and production sense, then hands-on labs.",
  publishedAt: "2026-05-01",
  category: "DevOps & Sys Eng",
  source: "studio",
  externalUrl: null,
  coverImage: image(dockerImage),
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
