"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AppStartupScreen() {
  // Defer mounting the motion + DOM work until after the first paint so the
  // body is never blocked by the branding pass.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The body paint happens with just this card in place; once the browser
    // is ready we fade the full branding pass in together, then unblock the
    // rest of the app.
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AppStartScreen
      ready={ready}
    />
  );
}

function AppStartScreen({ ready }: { ready: boolean }) {
  return (
    <>
      <style>{cinemagraphStyles}</style>

      <div
        className={
          `
            fixed inset-0 z-[9999] overflow-hidden isolate
            flex items-center justify-center
            bg-[#0E2F5E] antialiased text-white
          `
        }
        aria-busy={!ready}
        aria-label="Loading CertifyHub"
      >
        {/* Deep navy background wash behind the wordmark */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-30%] left-[-20%] h-[80%] w-[70%] rounded-full bg-[#2660A4]/30 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[50%] rounded-full bg-[#26a465]/25 blur-[110px]" />
          <div className="absolute top-[40%] right-[12%] h-[30%] w-[30%] rounded-full bg-white/5 blur-[90px]" />
        </div>

        {/* Soft grid behind everything for a premium motion feel */}
        <div
          className="absolute inset-0 z-0 -translate-x-1/2 -translate-y-1/2 translate-y-[1px]"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <AppStartCenter>
          {/* Emblem */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#0d2c5d] shadow-2xl shadow-[#2660a4]/30 ring-1 ring-white/10">
            <AppLogoMotion
              ready={ready}
            />
          </div>

          <AppWordmark ready={ready} />

          <AppPillTag ready={ready} />

          <AppProgress ready={ready} />
        </AppStartCenter>

        {/* Bottom status row */}
        <AppStatusBar ready={ready} />
      </div>
    </>
  );
}

function AppStartCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-5 px-5">
      {children}
    </div>
  );
}

function AppLogoMotion({
  ready,
}: {
  ready: boolean;
}) {
  // Keep the first frame paintable without JS animation work.
  const scale = ready ? 1 : 0.24;
  const opacity = ready ? 1 : 0;

  const logoImg = (
    <Image
      src="/icons/icon-192.png"
      alt=""
      width={80}
      height={80}
      className="h-full w-full object-cover"
      priority
    />
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
      className={`
        will-change-transform transition-[transform,opacity]
        duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
      `}
    >
      {logoImg}
    </div>
  );
}

function AppWordmark({
  ready,
}: {
  ready: boolean;
}) {
  return (
    <div
      className={`
        mt-5 text-center
        transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${(ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
      `}
    >
      <h1 className="font-black tracking-tight text-4xl md:text-5xl text-white">
        Certify
        <span className="bg-gradient-to-r from-[#6bd4b8] via-[#26a465] to-[#a3f0cf] bg-clip-text text-transparent">
          Hub
        </span>
      </h1>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
        Learn · Practise · Pass
      </p>
    </div>
  );
}

function AppPillTag({
  ready,
}: {
  ready: boolean;
}) {
  // A tiny animated pill that appears once the brand wordmark is set.
  if (!ready) {
    return null;
  }

  return (
    <div
      className={`
        mt-1.5 inline-flex items-center gap-2 rounded-full px-4 py-1.5
        bg-white/10 backdrop-blur-md border border-white/10
        text-[11px] font-semibold text-white/90
        transition-[opacity,transform] duration-500 ease-out
        opacity-100 scale-100
      `}
      aria-hidden="false"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#26a465]" />
      Launching your learning dashboard
    </div>
  );
}

function AppProgress({
  ready,
}: {
  ready: boolean;
}) {
  // A subtle shimmer bar at the bottom that runs until ready.
  if (ready) {
    return null;
  }

  return (
    <div
      className={`
        mt-8 w-full max-w-[220px]
        animate-pulse-shimmer
      `}
      aria-hidden="true"
    >
      {/* Thin determinate proxy bar so this looks like real progress,
          not an endless spinner */}
      <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
        <AppProgressRail />
        <AppProgressKnob />
      </div>
    </div>
  );
}

function AppProgressRail() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)",
        animation:
          "shimmer-rail 1.2s ease-in-out infinite",
        animationDelay: `0ms`,
      }}
    />
  );
}

function AppProgressKnob() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 h-full w-1/3 rounded-full"
      style={{
        background:
          "linear-gradient(90deg, #26a465 0%, #6bd4b8 100%)",
        opacity: 0.85,
      }}
    />
  );
}

function AppStatusBar({
  ready,
}: {
  ready: boolean;
}) {
  return (
    <div
      className={`
        absolute left-5 right-5 bottom-5 z-10
        text-center text-[10px] font-medium tracking-[0.18em]
        uppercase text-white/35
        transition-[opacity] duration-300
        ${ready ? "opacity-0" : "opacity-100"}
      `}
      aria-hidden="true"
    >
      Loading CertifyHub…
    </div>
  );
}

// Cinemagraph keyframes injected once. We keep them global so the motion
// stays smooth even as React re-renders the rest of the card.
const cinemagraphStyles = `
@keyframes shimmer-rail {
  0%   { transform: translateX(-100%); }
  80%  { transform: translateX(150%); }
  100% { transform: translateX(150%); }
}

.animate-pulse-shimmer {
  display: block;
  width: 100%;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .animate-pulse-shimmer,
  .animate-pulse-shimmer * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;
