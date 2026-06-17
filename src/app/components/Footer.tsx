import Link from "next/link";
import React from "react";
import { MdMail, MdSend } from "react-icons/md";

const Footer = () => {
  return (
    <footer className='py-2 text-center bg-white border-1 border-slate-300 text-white w-full flex md:flex-row flex-col justify-between px-10 items-center gap-4'>
      <div className='a '>
        <div className='logo md:mt-4 mt-6 text-left md:text-3xl text-xl w-full text-lg font-bold text-[#002a5d] flex md:flex-row flex-col md:justify-start justify-center items-center gap-1  '>
          <Link href='/' className=''>
            Certify<span className='text-[#331E36]'>Hub</span>
          </Link>
          <p className='text-sm text-[#6f6f6f]  md:mt-2 w-full md:text-left text-center'>
            Hub for everyone preparing for IT certifications exam
          </p>
        </div>
      </div>

      {/* links */}

      <div className='b'>
        {/* newsletter column */}
        <h4 className='text-sm font-bold text-[#002a5d] mt-8 mb-0'>
          Be the first to know about major update
        </h4>
        <div className='newsletter w-full flex items-center justify-start mt-2 text-[#002a5d] text-sm  border-1 pl-4 rounded-sm border-[#002a5d] '>
          <MdMail size={24} color='#5c8df7' />
          <input
            type='text'
            placeholder='Subscribe to our newsletter'
            className='border-none placeholder:text-slate-400 w-full'
          />
          <div className='bg-[#2660A4] flex items-center justify-center p-4'>
            <MdSend size={20} color='white' />
          </div>
        </div>
        <p className='text-sm text-[#6f6f6f]  mt-2'>
          Created by{" "}
          <a
            href='https://www.linkedin.com/in/femi-fadiya-segun-pelumi'
            className='underline text-blue-600'
          >
            Kode-N-Ops
          </a>
          ❤
        </p>
      </div>
    </footer>
  );
};

export default Footer;
