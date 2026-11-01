"use client";

import React, { useEffect, useState } from "react";
import { MdFormatQuote } from "react-icons/md";
import type { ReviewRecord } from "@/lib/content/reviews";

/**
 * Testimonials now come from the reviews table (seeded from src/data by the
 * admin Content sync action) instead of the bundled file.
 */
const ReviewBar = ({ reviews = [] }: { reviews?: ReviewRecord[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    setActiveIndex(Math.floor(Math.random() * reviews.length));
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const activeReview = reviews[Math.min(activeIndex, reviews.length - 1)];
  const initials = activeReview.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className='review w-full py-8 bg-[#1B3F7A] px-4 rounded-sm'>
      <p className='text-white text-sm mb-4'>
        <MdFormatQuote className='inline' size={24} color='#6AF1F1' />
        {activeReview.body}
        <MdFormatQuote className='inline' size={30} color='#6AF1F1' />
      </p>
      <div className='user_details flex items-center gap-4'>
        {activeReview.avatarUrl ? (
          <img
            src={activeReview.avatarUrl}
            alt={activeReview.name}
            width={70}
            className='border-2 border-white rounded-sm'
          />
        ) : (
          <span className='flex h-[70px] w-[70px] items-center justify-center rounded-sm border-2 border-white text-lg font-black text-white'>
            {initials || "CH"}
          </span>
        )}
        <div className='names text-md'>
          <h4 className='text-white font-bold'>{activeReview.name}</h4>
          {activeReview.role && (
            <p className='text-[#E9F0BC] text-sm'>{activeReview.role}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewBar;
