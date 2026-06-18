import Link from "next/link";
import React from "react";
import { IoLogoLinkedin } from "react-icons/io";
import { MdMail, MdSend } from "react-icons/md";

const Footer = () => {
  return (
    <footer className='py-4 text-center bg-white border-1 border-slate-300 text-white w-full flex md:flex-row flex-col justify-between px-10 items-center gap-4'>
      {/* links */}
      <div className='links flex md:flex-row flex-col items-center justify-center w-full flex-wrap md:gap-4 gap-2'>
        <h4 className='text-sm font-bold text-[#002a5d]  uppercase'>Links</h4>
        <div className='flex items-start justify-left text-[#002a5d] text-sm '>
          <Link href='/'>Home</Link>
          <span className='mx-2'>|</span>
          <Link href='/blog'>Blog</Link>
          <span className='mx-2'>|</span>
          <Link href='/page/suggestion'>Contact</Link>
        </div>
      </div>
      {/* contact */}
      <div className='contact flex items-center justify-center text-[#002a5d] text-sm flex-wrap gap-4 w-full'>
        <p className='flex items-center gap-2' justify-center>
          Created with ❤️ by Lumi
        </p>
        <p className='sm:flex hidden'>|</p>
        <Link
          href='https://ng.linkedin.com/in/femi-fadiya-segun-pelumi'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2'
          justify-center
        >
          Connect with me on <IoLogoLinkedin size={20} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
