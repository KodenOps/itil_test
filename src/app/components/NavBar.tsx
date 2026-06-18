"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaHome, FaLightbulb, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 px-4 shadow-sm shadow-slate-200/70 backdrop-blur md:px-6 lg:px-10'>
      <div className='mx-auto flex h-[84px] w-full max-w-7xl items-center justify-between gap-4'>
        <Link
          href='/'
          className='inline-flex items-center gap-3 rounded-full  bg-white px-4 py-2  transition hover:-translate-y-0.5 hover:shadow-md'
        >
          <span className='md:text-2xl text-lg font-black tracking-tight text-slate-900'>
            Certify<span className='text-[#2660A4]'>Hub</span>
          </span>
        </Link>

        <div className='hidden items-center gap-2 font-medium text-slate-700 md:flex'>
          <Link
            href='/'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Home
          </Link>
          <Link
            href='/blog'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            My Blog
          </Link>
          <Link
            href='/page/suggestion'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Feedback & Report Bug
          </Link>
          <Link
            href='/page/exams'
            className='ml-2 rounded-full bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800'
          >
            Exam Hub
          </Link>
        </div>

        <button
          className='inline-flex h-11 w-11 items-center justify-center rounded-full  bg-white text-slate-700  focus:outline-none md:hidden'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm'
          onClick={closeMenu}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-40 h-[78vh] w-full rounded-b-[32px] bg-white shadow-2xl shadow-slate-300/60 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className='flex flex-col p-6 text-lg font-medium text-slate-700'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                Navigation
              </p>
              <h2 className='mt-2 text-2xl font-black text-slate-900'>
                Explore CertifyHub
              </h2>
            </div>
            <button
              onClick={closeMenu}
              className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600'
            >
              <FaTimes size={24} />
            </button>
          </div>

          <Link
            href='/'
            className='flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaHome size={24} color='#64748b' />
            Home
          </Link>

          <Link
            href='/blog'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            My Blog
          </Link>

          <Link
            href='/page/suggestion'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            Feedback & Report Bug
          </Link>

          <Link
            href='/page/exams'
            className='mt-3 flex items-center gap-4 rounded-2xl bg-slate-900 px-4 py-4 font-semibold text-white transition hover:bg-slate-800'
            onClick={closeMenu}
          >
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black'>
              EH
            </span>
            Exam Hub
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
