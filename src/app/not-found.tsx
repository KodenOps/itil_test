"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Drop this file at app/not-found.tsx (Next.js App Router).

const MESSAGES = [
  "This page wandered off.",
  "Still nothing. We checked twice.",
  "It's gone. It may never have existed.",
  "The eye sees nothing either.",
  "Ow. Please stop poking it.",
  "Okay, that's enough. Go home.",
];

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const eyeRef = useRef<HTMLButtonElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const hasPointerRef = useRef(false);

  const [pokes, setPokes] = useState(0);
  const [blinking, setBlinking] = useState(false);

  // Move the iris toward a point on screen.
  const lookAt = (x: number, y: number) => {
    const eye = eyeRef.current;
    const iris = irisRef.current;
    if (!eye || !iris) return;
    const r = eye.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const angle = Math.atan2(y - cy, x - cx);
    const dist = Math.min(Math.hypot(x - cx, y - cy) / 6, r.width * 0.2);
    iris.style.transform = `translate(${Math.cos(angle) * dist}px, ${
      Math.sin(angle) * dist
    }px)`;
  };

  // Follow the cursor / finger.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      hasPointerRef.current = true;
      lookAt(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Until someone moves a pointer, the eye glances around on its own.
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (hasPointerRef.current) return;
      lookAt(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const poke = () => {
    setPokes((n) => n + 1);
    setBlinking(true);
    setTimeout(() => setBlinking(false), 180);
  };

  const message = MESSAGES[Math.min(pokes, MESSAGES.length - 1)];

  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#333] px-6 py-16 text-[#F5F3EE]'>
      <style>{`
        @keyframes nf-wobble-a { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(3deg) translateY(-1.5%) } }
        @keyframes nf-wobble-b { 0%,100% { transform: rotate(4deg) } 50% { transform: rotate(-3deg) translateY(1.5%) } }
        .nf-four-a { animation: nf-wobble-a 4.2s ease-in-out infinite; }
        .nf-four-b { animation: nf-wobble-b 3.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nf-four-a, .nf-four-b { animation: none; }
        }
      `}</style>

      {/* The number: 4 (eye) 4 */}
      <div
        aria-hidden={false}
        role='img'
        aria-label='Error 404'
        className='flex items-center justify-center select-none'
        style={{ fontSize: "clamp(7rem, 26vw, 20rem)", lineHeight: 1 }}
      >
        <span className='nf-four-a font-black tracking-tighter'>4</span>

        <button
          ref={eyeRef}
          type='button'
          onClick={poke}
          aria-label='Poke the eye'
          className='relative mx-[0.02em] block h-[0.92em] w-[0.74em] cursor-pointer overflow-hidden rounded-[50%] bg-[#F5F3EE] outline-none focus-visible:ring-4 focus-visible:ring-[#FFD23F]'
        >
          {/* iris + pupil */}
          <div
            ref={irisRef}
            className='absolute left-1/2 top-1/2 -ml-[0.2em] -mt-[0.2em] flex h-[0.4em] w-[0.4em] items-center justify-center rounded-full bg-[#FFD23F] transition-transform duration-100 ease-out'
          >
            <div className='h-[0.19em] w-[0.19em] rounded-full bg-[#0A0A23]'>
              <div className='ml-[0.03em] mt-[0.03em] h-[0.05em] w-[0.05em] rounded-full bg-[#F5F3EE]' />
            </div>
          </div>
          {/* eyelid */}
          <div
            className={`absolute inset-0 origin-top bg-[#333] transition-transform duration-150 ease-in ${
              blinking ? "scale-y-100" : "scale-y-0"
            }`}
            style={{ borderBottom: "0.02em solid #F5F3EE" }}
          />
        </button>

        <span className='nf-four-b font-black tracking-tighter'>4</span>
      </div>

      <h1 className='mt-8 text-center text-2xl font-extrabold sm:text-4xl'>
        {message}
      </h1>

      <p className='mt-4 max-w-md break-all text-center text-sm text-[#F5F3EE]/80 sm:text-base'>
        Nothing lives at{" "}
        <span className='rounded-md bg-[#0A0A23]/40 px-2 py-0.5 font-mono line-through decoration-[#FFD23F] decoration-2'>
          {pathname}
        </span>
      </p>

      <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
        <Link
          href='/'
          className='rounded-full bg-[#F5F3EE] px-7 py-3 text-sm font-bold text-[#1F2BFF] transition hover:bg-[#FFD23F] hover:text-[#0A0A23] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FFD23F]'
        >
          Take me home
        </Link>
        <button
          type='button'
          onClick={() => router.back()}
          className='rounded-full border-2 border-[#F5F3EE] px-7 py-3 text-sm font-bold text-[#F5F3EE] transition hover:bg-[#F5F3EE]/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FFD23F]'
        >
          Go back
        </button>
      </div>

      {pokes === 0 && (
        <p className='mt-8 text-xs text-[#F5F3EE]/60'>
          Psst. The eye is clickable.
        </p>
      )}
    </main>
  );
}
