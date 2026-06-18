"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type TopicGroup = {
  id: string;
  title: string;
  description: string;
  accent: string;
  topics: string[];
  deepDive: string;
};

const topicGroups: TopicGroup[] = [
  {
    id: "architecture-system-thinking",
    title: "Architecture and system thinking",
    description:
      "Learn how to shape systems that stay understandable, adaptable, and safe to change as they grow.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    topics: [
      "system boundaries",
      "API design",
      "backward compatibility",
      "migrations",
      "long-term maintainability",
      "reducing accidental complexity",
      "knowing when not to build",
    ],
    deepDive:
      "Strong architecture is about making the next change easier, not just the current one faster. Focus on clear boundaries, stable contracts, and enough simplicity that future teams can safely extend the system without creating fragile dependencies.",
  },
  {
    id: "scalability-reliability",
    title: "Scalability and reliability",
    description:
      "Build services that keep working under pressure, recover gracefully, and fail in ways people can understand.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    topics: [
      "caching",
      "queues",
      "retries and idempotency",
      "rate limiting",
      "graceful degradation",
      "failure mode analysis",
      "rollback planning",
      "dependency handling",
    ],
    deepDive:
      "Reliability work is not only about uptime. It is about controlling blast radius, shaping failure paths, and designing systems that remain predictable when traffic spikes, dependencies slow down, or a deploy goes wrong.",
  },
  {
    id: "data-backend-fundamentals",
    title: "Data and backend fundamentals",
    description:
      "Understand the storage and query choices that determine correctness, performance, and how easy the system is to evolve.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    topics: [
      "data modeling",
      "indexing",
      "transaction behavior",
      "read/write scaling",
      "schema evolution",
      "backup and restore",
      "correctness under bad data",
    ],
    deepDive:
      "Backend fluency means knowing what the database guarantees, where performance bottlenecks usually appear, and how to keep data trustworthy even when inputs are incomplete, duplicated, or malformed.",
  },
  {
    id: "execution-influence",
    title: "Execution and influence",
    description:
      "Turn technical judgment into alignment by documenting decisions, exposing tradeoffs, and helping others move faster.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    topics: [
      "writing design docs",
      "explaining tradeoffs simply",
      "getting alignment",
      "reviewing code well",
      "mentoring juniors",
      "unblocking peers",
      "making hidden risks visible",
    ],
    deepDive:
      "Execution skills multiply technical skill. A strong engineer can translate complexity into clear options, build trust through good reviews, and make risk visible early enough for the team to act on it.",
  },
  {
    id: "operations-production-sense",
    title: "Operations and production sense",
    description:
      "Make systems observable, supportable, and calmer to run when they are in production every day.",
    accent: "from-[#F97316] to-[#F59E0B]",
    topics: [
      "logging",
      "monitoring",
      "tracing",
      "alert quality",
      "incident response",
      "postmortems",
      "reducing on-call pain",
    ],
    deepDive:
      "Production sense is the discipline of spotting what breaks in real life, measuring it clearly, and improving the system so the next incident is smaller, faster to understand, and easier to resolve.",
  },
];

export default function Page() {
  const [selectedTopic, setSelectedTopic] = useState<TopicGroup | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTopic(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setSelectedTopic(null);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />
        <div className='absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-[#2660A4]/10 blur-3xl' />
        <div className='absolute right-[-6rem] top-56 -z-10 h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl' />

        <section className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:px-10 lg:px-12'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm shadow-slate-200/70 backdrop-blur'>
              DevOps + System Engineer learning path
            </div>
            <h1 className='mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
              Build systems that scale, recover, and stay understandable.
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
              This landing page captures the core skills DevOps and system
              engineer learners need to grow from tools and tactics into
              production-ready thinking. Open any topic for a quick summary,
              then jump into the deeper guide below.
            </p>
          </div>

          <div className='relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {topicGroups.map((group) => (
              <button
                key={group.id}
                type='button'
                onClick={() => setSelectedTopic(group)}
                className='group rounded-3xl border border-slate-200 bg-white p-[1px] text-left shadow-lg shadow-slate-200/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl'
              >
                <div
                  className={`h-full rounded-3xl bg-gradient-to-br ${group.accent} p-6 sm:p-7`}
                >
                  <div className='flex h-full flex-col justify-between gap-6 rounded-2xl bg-white/90 p-5 backdrop-blur-sm'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                        Focus area
                      </p>
                      <h2 className='mt-3 text-2xl font-bold text-slate-900'>
                        {group.title}
                      </h2>
                      <p className='mt-3 text-sm leading-6 text-slate-600'>
                        {group.description}
                      </p>
                    </div>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-sm font-semibold text-slate-600'>
                        Tap for a quick pop-up
                      </span>
                      <span className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:bg-slate-50'>
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedTopic && (
        <div className='fixed  inset-0  z-50 flex items-center justify-center px-4 py-8 min-h-screen w-full'>
          <button
            type='button'
            aria-label='Close topic modal'
            onClick={() => setSelectedTopic(null)}
            className='absolute inset-0 bg-black/70 backdrop-blur-sm'
          />
          <div className='relative z-10 w-full max-w-2xl overflow-x-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/20'>
            <div
              className={`h-2 w-full bg-gradient-to-r ${selectedTopic.accent}`}
            />
            <div className='p-6 sm:p-8'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                Quick info
              </p>
              <h2 className='mt-3 text-3xl font-bold text-slate-900'>
                {selectedTopic.title}
              </h2>
              <p className='mt-4 text-base leading-7 text-slate-600'>
                {selectedTopic.description}
              </p>
              <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>
                  Key topics
                </p>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {selectedTopic.topics.map((topic) => (
                    <span
                      key={topic}
                      className='rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <button
                  type='button'
                  onClick={() => scrollToSection(selectedTopic.id)}
                  className='rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800'
                >
                  Learn more
                </button>
                <button
                  type='button'
                  onClick={() => setSelectedTopic(null)}
                  className='rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTopic && (
        <div className='fixed inset-0 z-50 overflow-y-auto min-h-screen w-full'>
          <button
            type='button'
            aria-label='Close topic modal'
            onClick={() => setSelectedTopic(null)}
            className='absolute inset-0 bg-black/70 backdrop-blur-sm'
          />

          <div className='flex min-h-full items-start justify-center px-4 py-6 sm:py-10'>
            <div className='relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/20'>
              <div
                className={`h-2 w-full bg-gradient-to-r ${selectedTopic.accent}`}
              />

              <div className='p-6 sm:p-8'>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                  Quick info
                </p>

                <h2 className='mt-3 text-3xl font-bold text-slate-900'>
                  {selectedTopic.title}
                </h2>

                <p className='mt-4 text-base leading-7 text-slate-600'>
                  {selectedTopic.description}
                </p>

                <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>
                    Key topics
                  </p>

                  <div className='mt-4 flex flex-wrap gap-2'>
                    {selectedTopic.topics.map((topic) => (
                      <span
                        key={topic}
                        className='rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                  <button
                    type='button'
                    onClick={() => scrollToSection(selectedTopic.id)}
                    className='rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800'
                  >
                    Learn more
                  </button>

                  <button
                    type='button'
                    onClick={() => setSelectedTopic(null)}
                    className='rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
