"use client";

import React, { useEffect, useState } from "react";
import { MdFormatQuote } from "react-icons/md";
import type { ReviewRecord, SafeAvatarUrl } from "@/lib/content/reviews";

/**
 * Allowed avatar sources. Anything outside this list is treated as absent and
 * falls back to the reviewer's initials, so the component never loads an
 * arbitrary external image as the reviewer's avatar.
 *
 * Keep this list small and additive: the reviews table is admin-seeded, so new
 * avatars go through the Content sync action (src/app/api/admin/sync-content),
 * which validates them before insert.
 */
const ALLOWED_AVATAR_ORIGINS = new Set([
  // Repo-internal public images served by Next static asset routing.
  "",
  // Well-known image CDNs used by the seeded review data.
  "https://cdn.hashnode.com",
  "https://images.unsplash.com",
]);

/**
 * True when `avatarUrl` is safe to render as an <img>.
 * Drops javascript:/data:/blob: schemes and anything whose origin is not in
 * the allowlist (including relative paths that Next will resolve to /public).
 */
function isSafeAvatar(url: string | null): url is SafeAvatarUrl {
  if (!url) return false;
  if (url.startsWith("javascript:") || url.startsWith("data:") || url.startsWith("blob:")) return false;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_AVATAR_ORIGINS.has(parsed.origin)) return false;
    return true;
  } catch {
    // A relative path like "/images/hashnode.jpeg" — safe only if our static
    // asset routing serves it, which it does for anything under /public. Allow
    // relative paths that start with "/".
    return url.startsWith("/");
  }
}

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
        {isSafeAvatar(activeReview.avatarUrl) ? (
          <img
            src={activeReview.avatarUrl}
            alt={activeReview.name}
            width={70}
            loading="lazy"
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
