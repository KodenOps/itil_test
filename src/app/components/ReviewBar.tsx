"use client";
import React, { useEffect, useState } from "react";
import { reviews } from "@/data/reviews";
import { MdFormatQuote } from "react-icons/md";
import Image from "next/image";

const ReviewBar = () => {
  // Stable on first render (server and initial client paint both use index 0)
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Only runs in the browser, after hydration — safe to be random here.
    setActiveIndex(Math.floor(Math.random() * reviews.length));
  }, []);

  const activeReview = reviews[activeIndex];

  return (
    <div className='review w-full py-8 bg-[#1B3F7A] px-4 rounded-sm'>
      <p className='text-white text-sm mb-4'>
        <MdFormatQuote className='inline' size={24} color='#6AF1F1' />
        {activeReview.review}
        <MdFormatQuote className='inline' size={30} color='#6AF1F1' />
      </p>
      <div className='user_details flex items-center gap-4'>
        <Image
          src={activeReview.image}
          alt='line'
          width={70}
          className='border-2 border-white rounded-sm '
        />
        <div className='names text-md'>
          <h4 className='text-white font-bold'>{activeReview.name}</h4>
          <p className='text-[#E9F0BC] text-sm'>{activeReview.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewBar;
