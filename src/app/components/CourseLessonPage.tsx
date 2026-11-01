"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { MdOutlineMenuBook, MdClose } from "react-icons/md";

export type Lesson = {
  id: string;
  title: string;
  body: string;
  takeaway: string;
  bullets?: string[];
  table?: { header: string[]; rows: string[][] };
};

export type LessonCategory = {
  id: string;
  title: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  accentHex: string;
  lessons: Lesson[];
};

export type CourseCard = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
};

type Props = {
  badge: string;
  title: string;
  intro: string;
  meta: string[];
  categories: LessonCategory[];
  practiceHeading?: string;
  practiceNote?: string;
  cards: CourseCard[];
};

/**
 * Blog-style course landing page: category switcher, sticky lesson index and
 * long-form lesson cards, followed by the exam/practice cards every other
 * course page ends with.
 */
export default function CourseLessonPage({
  badge,
  title,
  intro,
  meta,
  categories,
  practiceHeading = "Practise What You've Learnt",
  practiceNote,
  cards,
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ??
    categories[0];

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLessonId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    observerRef.current = observer;

    activeCategory.lessons.forEach((lesson) => {
      const element = document.getElementById(lesson.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeCategory]);

  const switchCategory = (id: string) => {
    setActiveCategoryId(id);
    setIsIndexOpen(false);
    setActiveLessonId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToLesson = (id: string) => {
    setIsIndexOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      <div className='h-24' aria-hidden='true' />

      {/* ── Category switcher ── */}
      <div className='sticky top-[84px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto max-w-7xl px-4 md:px-8'>
          <div className='flex items-center gap-1 overflow-x-auto py-3'>
            {categories.map((category) => {
              const isActive = category.id === activeCategoryId;

              return (
                <button
                  key={category.id}
                  type='button'
                  onClick={() => switchCategory(category.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: category.accentHex }
                      : undefined
                  }
                >
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className='mx-auto max-w-7xl px-4 pt-8 md:px-8'>
        {/* ── Hero ── */}
        <div className='relative overflow-hidden rounded-3xl p-7 md:p-12'>
          <div
            className='absolute inset-0 opacity-10'
            style={{
              backgroundImage: `linear-gradient(135deg, ${activeCategory.accentFrom}, ${activeCategory.accentTo})`,
            }}
          />
          <div
            className='absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl'
            style={{ backgroundColor: activeCategory.accentHex }}
          />

          <div className='relative'>
            <span
              className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white'
              style={{ backgroundColor: activeCategory.accentHex }}
            >
              {badge}
            </span>
            <h1 className='mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
              {title}
            </h1>
            <p className='mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg'>
              {intro}
            </p>
            <div className='mt-5 flex flex-wrap gap-2'>
              {meta.map((item) => (
                <span
                  key={item}
                  className='rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600'
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile lesson index ── */}
        <div className='mt-6 lg:hidden'>
          <button
            type='button'
            onClick={() => setIsIndexOpen((open) => !open)}
            aria-expanded={isIndexOpen}
            className='flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm'
          >
            <span className='inline-flex items-center gap-2'>
              <MdOutlineMenuBook size={18} />
              On this page ({activeCategory.lessons.length})
            </span>
            {isIndexOpen ? <MdClose size={18} /> : <span>+</span>}
          </button>

          {isIndexOpen && (
            <nav className='mt-2 space-y-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm'>
              {activeCategory.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  type='button'
                  onClick={() => scrollToLesson(lesson.id)}
                  className='flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50'
                >
                  <span className='mt-0.5 shrink-0 font-mono text-xs text-slate-400'>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {lesson.title}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* ── Lesson column + index ── */}
        <div className='mt-8 flex gap-10 pb-20'>
          <div className='min-w-0 flex-1'>
            <p
              className='text-xs font-bold uppercase tracking-[0.3em]'
              style={{ color: activeCategory.accentHex }}
            >
              Section
            </p>
            <h2 className='mt-2 text-2xl font-black text-slate-900 md:text-3xl'>
              {activeCategory.title}
            </h2>
            <p className='mt-3 max-w-3xl text-base leading-7 text-slate-600'>
              {activeCategory.description}
            </p>

            <div className='mt-10'>
              {activeCategory.lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  id={lesson.id}
                  className='mb-14 scroll-mt-36'
                >
                  <div
                    className='mb-1 h-1 w-10 rounded-full'
                    style={{ backgroundColor: activeCategory.accentHex }}
                  />
                  <h3 className='mb-4 text-xl font-bold text-slate-900 md:text-2xl'>
                    {lesson.title}
                  </h3>

                  <div className='space-y-4'>
                    {lesson.body.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className='text-base leading-8 text-slate-600'
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {lesson.bullets && lesson.bullets.length > 0 && (
                    <ul className='mt-5 space-y-2'>
                      {lesson.bullets.map((item) => (
                        <li key={item} className='flex items-start gap-3'>
                          <span
                            className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full'
                            style={{
                              backgroundColor: activeCategory.accentHex,
                            }}
                          />
                          <span className='text-sm leading-7 text-slate-700'>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {lesson.table && (
                    <div className='mt-5 overflow-x-auto rounded-2xl border border-slate-200'>
                      <table className='min-w-full text-sm'>
                        <thead className='bg-slate-50'>
                          <tr>
                            {lesson.table.header.map((heading) => (
                              <th
                                key={heading}
                                className='whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100 bg-white'>
                          {lesson.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className='px-4 py-3 align-top text-slate-700'
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div
                    className='mt-6 rounded-2xl px-5 py-4'
                    style={{
                      backgroundColor: `${activeCategory.accentHex}12`,
                      borderLeft: `3px solid ${activeCategory.accentHex}`,
                    }}
                  >
                    <p
                      className='mb-1 text-xs font-bold uppercase tracking-widest'
                      style={{ color: activeCategory.accentHex }}
                    >
                      Key takeaway
                    </p>
                    <p className='text-sm font-medium text-slate-800'>
                      {lesson.takeaway}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className='hidden w-64 shrink-0 lg:block xl:w-72'>
            <div className='sticky top-36 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-slate-400'>
                In this section
              </p>
              <nav className='max-h-[calc(100vh-12rem)] space-y-0.5 overflow-y-auto pr-1'>
                {activeCategory.lessons.map((lesson, index) => {
                  const isActive = activeLessonId === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      type='button'
                      onClick={() => scrollToLesson(lesson.id)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                      style={
                        isActive
                          ? { color: activeCategory.accentHex }
                          : undefined
                      }
                    >
                      <span className='mt-0.5 shrink-0 font-mono text-xs opacity-50'>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className='leading-snug'>{lesson.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Exam + practice cards, matching the other course pages ── */}
      <div className='mx-auto mb-12 w-full max-w-7xl border-t border-slate-200 px-4 pt-10 md:px-8'>
        <p className='text-xs font-bold uppercase tracking-widest text-slate-400'>
          {practiceHeading}
        </p>
        {practiceNote && (
          <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600'>
            {practiceNote}
          </p>
        )}

        <div className='mt-6 grid gap-5 md:grid-cols-2'>
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className='group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
            >
              <div
                className='rounded-[22px] p-6 text-white'
                style={{
                  backgroundImage: `linear-gradient(135deg, ${card.accentFrom}, ${card.accentTo})`,
                }}
              >
                <div className='flex h-full min-h-[240px] flex-col justify-between gap-8 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>
                        Learning track
                      </p>
                      <h2 className='mt-3 text-3xl font-black leading-tight'>
                        {card.label}
                      </h2>
                    </div>
                    <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white'>
                      Open
                    </span>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/15'>
                      {card.icon}
                    </div>
                    <p className='max-w-sm text-sm leading-6 text-white/90'>
                      {card.description}
                    </p>
                  </div>

                  <div className='flex items-center justify-between gap-3 text-sm font-semibold text-white/85'>
                    <span>Jump in now</span>
                    <span className='rounded-full border border-white/20 bg-white/10 px-4 py-2 transition group-hover:bg-white/20'>
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
