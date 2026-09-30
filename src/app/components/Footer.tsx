import Link from "next/link";
import React from "react";
import { IoLogoLinkedin } from "react-icons/io";

const Footer = () => {
  return (
    <footer className='border-t border-slate-200 bg-white px-6 py-8 text-slate-700 shadow-[0_-1px_0_rgba(15,23,42,0.04)]'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-6 shadow-sm md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
            CertifyHub
          </p>
          <p className='mt-2 text-base font-semibold text-slate-900'>
            Built for exam prep, learning paths, and steady momentum.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 text-sm font-medium'>
          <Link
            href='/'
            className='rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-slate-300 hover:text-[#2660A4]'
          >
            Home
          </Link>
          <Link
            href='/blog'
            className='rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-slate-300 hover:text-[#2660A4]'
          >
            Blog
          </Link>
          <Link
            href='/page/suggestion'
            className='rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-slate-300 hover:text-[#2660A4]'
          >
            Contact
          </Link>
          <Link
            href='https://ng.linkedin.com/in/femi-fadiya-segun-pelumi'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full bg-[#2660A4] px-4 py-2 text-white transition hover:bg-[#1f4f8d] flex items-center gap-2'
          >
            <IoLogoLinkedin size={16} /> Connect
          </Link>
        </div>

        <p className='text-sm text-slate-500'>Created with ❤️ by Lumi</p>
      </div>
    </footer>
  );
};

export default Footer;
