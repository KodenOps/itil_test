"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 5000;
const FADE_MS = 500;

/**
 * Full-screen splash shown while the app boots.
 *
 * It dismisses as soon as the document has finished loading (with a short
 * minimum so the animation is not a flicker), and always gives up after
 * MAX_VISIBLE_MS so it can never trap the user on a blank screen.
 */
export default function AppStartupScreen() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const startedAt = Date.now();
    let finished = false;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let unmountTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;

      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      fadeTimer = setTimeout(() => {
        setDismissed(true);
        unmountTimer = setTimeout(() => setMounted(false), FADE_MS);
      }, wait);
    };

    const safetyTimer = setTimeout(finish, MAX_VISIBLE_MS);

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      clearTimeout(safetyTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
      if (unmountTimer) clearTimeout(unmountTimer);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role='status'
      aria-live='polite'
      aria-busy={!dismissed}
      aria-label='Loading CertifyHub'
      className={`ch-splash fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-500 ease-out ${
        dismissed ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <style>{`
        .ch-splash {
          background:
            radial-gradient(120% 90% at 18% 0%, rgba(38, 96, 164, 0.55) 0%, transparent 55%),
            radial-gradient(100% 80% at 100% 100%, rgba(38, 164, 101, 0.35) 0%, transparent 55%),
            linear-gradient(160deg, #0b2445 0%, #0E2F5E 48%, #0a1e3a 100%);
        }
        .ch-splash::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(circle at 50% 45%, #000 0%, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 0%, transparent 72%);
          animation: ch-grid-drift 9s linear infinite;
          pointer-events: none;
        }
        @keyframes ch-grid-drift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 52px 52px, 52px 52px; }
        }
        @keyframes ch-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ch-pop {
          0% { opacity: 0; transform: scale(0.7) rotate(-6deg); }
          60% { opacity: 1; transform: scale(1.04) rotate(1.5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes ch-sweep {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(320%); }
        }
        @keyframes ch-halo {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes ch-dot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        .ch-splash-logo { animation: ch-pop 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .ch-splash-rise { animation: ch-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) 220ms both; }
        .ch-splash-rise-late { animation: ch-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) 420ms both; }
        .ch-splash-halo { animation: ch-halo 3.4s ease-in-out infinite; }
        .ch-splash-sweep { animation: ch-sweep 1.25s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ch-splash *, .ch-splash::before { animation: none !important; }
        }
      `}</style>

      <div className='relative flex h-full w-full flex-col items-center justify-center px-6 text-center text-white'>
        {/* Emblem */}
        <div className='relative'>
          <span
            aria-hidden='true'
            className='ch-splash-halo absolute -inset-6 -z-10 rounded-[36px] bg-[#26a465]/30 blur-2xl'
          />
          <div className='ch-splash-logo flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-[#0d2c5d] shadow-2xl shadow-black/40 ring-1 ring-white/15 sm:h-24 sm:w-24'>
            <Image
              src='/icons/icon-192.png'
              alt='CertifyHub'
              width={96}
              height={96}
              priority
              className='h-full w-full object-cover'
            />
          </div>
        </div>

        {/* Wordmark */}
        <div className='ch-splash-rise'>
          <h1 className='mt-7 text-3xl font-black tracking-tight sm:text-4xl'>
            Certify
            <span className='bg-gradient-to-r from-[#7ee2c3] via-[#26a465] to-[#b8f5da] bg-clip-text text-transparent'>
              Hub
            </span>
          </h1>
          <p className='mt-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55'>
            Learn · Practise · Pass
          </p>
        </div>

        {/* Progress */}
        <div className='ch-splash-rise-late mt-9 w-full max-w-[240px]'>
          <div className='relative h-1.5 w-full overflow-hidden rounded-full bg-white/12'>
            <span className='ch-splash-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#6bd4b8] to-[#26a465]' />
          </div>
          <p className='mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60'>
            Preparing your dashboard
            <span className='inline-flex gap-1' aria-hidden='true'>
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className='h-1 w-1 rounded-full bg-[#6bd4b8]'
                  style={{ animation: `ch-dot 1.4s ease-in-out ${index * 0.16}s infinite` }}
                />
              ))}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
