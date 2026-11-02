"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MdOutlineInstallMobile, MdOutlineShare, MdClose } from "react-icons/md";
import {
  INSTALL_PROMPT_EVENT,
  INSTALL_PROMPT_SNOOZE_DAYS,
  isAppInstalled,
} from "@/lib/pwa";

/**
 * Chromium fires `beforeinstallprompt` when the app meets the installability
 * criteria; we stash it and show our own prompt instead of the mini-infobar.
 * Safari/iOS never fires it, so those users get Share → Add to Home Screen
 * instructions. The navbar can re-open this card at any time via the
 * INSTALL_PROMPT_EVENT custom event.
 */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Mode = "native" | "ios" | "unsupported";

const DISMISS_KEY = "certifyhub:install-dismissed-at";
// Let the page settle before competing with the first paint.
const APPEAR_DELAY_MS = 2500;

function isIos() {
  if (typeof navigator === "undefined") return false;

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function recentlyDismissed() {
  if (INSTALL_PROMPT_SNOOZE_DAYS === 0) return false;

  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;

    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;

    return (
      Date.now() - dismissedAt <
      INSTALL_PROMPT_SNOOZE_DAYS * 24 * 60 * 60 * 1000
    );
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return false;
  }
}

function snooze() {
  if (INSTALL_PROMPT_SNOOZE_DAYS === 0) return;

  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore — worst case the prompt reappears next visit.
  }
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("native");
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(
    null,
  );
  const [isInstalling, setIsInstalling] = useState(false);

  // The manual-open listener must not capture a stale event.
  const installEventRef = useRef<InstallPromptEvent | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const showAfterDelay = () => {
      if (timer) return;
      timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    };

    const onBeforeInstallPrompt = (event: Event) => {
      // Stop Chrome's own mini-infobar; we present the prompt ourselves.
      event.preventDefault();
      installEventRef.current = event as InstallPromptEvent;
      setInstallEvent(event as InstallPromptEvent);

      if (!timer) showAfterDelay();
    };

    const onInstalled = () => {
      setVisible(false);
      installEventRef.current = null;
      setInstallEvent(null);
      // Once the user has installed and launched the app, future opens from
      // the navbar should not re-prompt them. Ordinarily we could only prove
      // installation while the installed app is running; when they actually
      // installed from this card, the `appinstalled` event is our proof.
      try {
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // Storage may be unavailable; worst case we re-ask on next visit.
      }
    };

    // Opening it from the navbar bypasses the auto-show rules (standalone or
    // a recent dismissal) but still respects the app being installed.
    const onManualOpen = () => {
      if (isAppInstalled()) return;

      setMode(
        installEventRef.current
          ? "native"
          : isIos()
            ? "ios"
            : "unsupported",
      );

      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener(INSTALL_PROMPT_EVENT, onManualOpen);

    const shouldAutoShow =
      !isAppInstalled() && !recentlyDismissed();

    // iOS has no install event at all, so instructions are the only option.
    if (shouldAutoShow && isIos()) {
      setMode("ios");
      showAfterDelay();
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener(INSTALL_PROMPT_EVENT, onManualOpen);
    };
  }, []);

  const dismiss = () => {
    snooze();
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) {
      dismiss();
      return;
    }

    setIsInstalling(true);

    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;

      if (choice.outcome === "accepted") {
        setVisible(false);
        installEventRef.current = null;
        setInstallEvent(null);
        return;
      }

      dismiss();
    } catch (error) {
      console.warn("Install prompt failed:", error);
      dismiss();
    } finally {
      setIsInstalling(false);
    }
  };

  if (!visible) return null;

  return (
    <aside
      role='dialog'
      aria-labelledby='install-title'
      aria-describedby='install-copy'        className='fixed inset-x-4 bottom-4 z-[60] mx-auto w-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20 sm:left-6 sm:right-auto sm:mx-0'
    >
      <button
        type='button'
        onClick={dismiss}
        aria-label='Dismiss install prompt'
        className='absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
      >
        <MdClose size={18} />
      </button>

      <div className='flex items-start gap-4'>
        <Image
          src='/icons/icon-192.png'
          alt='CertifyHub'
          width={52}
          height={52}
          className='h-[52px] w-[52px] shrink-0 rounded-2xl'
        />

        <div className='min-w-0 pr-6'>
          <h2 id='install-title' className='text-base font-black text-slate-900'>
            Install CertifyHub
          </h2>
          <p id='install-copy' className='mt-1 text-sm leading-6 text-slate-600'>
            {mode === "ios" ? (
              <>
                Tap the{" "}
                <MdOutlineShare className='inline-block align-text-bottom' />{" "}
                share button, then{" "}
                <span className='font-semibold text-slate-800'>
                  Add to Home Screen
                </span>{" "}
                for a full-screen app and offline access.
              </>
            ) : mode === "unsupported" ? (
              <>
                Open your browser menu and choose{" "}
                <span className='font-semibold text-slate-800'>
                  Install app
                </span>{" "}
                or{" "}
                <span className='font-semibold text-slate-800'>
                  Add to Home Screen
                </span>
                . This browser can&apos;t open the install dialog for us.
              </>
            ) : (
              "Add it to your home screen for full-screen practice, faster loads and offline access."
            )}
          </p>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2'>
        <button
          type='button'
          onClick={install}
          disabled={isInstalling || !installEvent}
          className='inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2660A4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
        >
          <MdOutlineInstallMobile size={18} />
          {isInstalling ? "Opening…" : "Install app"}
        </button>
        <button
          type='button'
          onClick={dismiss}
          className='rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50'
        >
          Not now
        </button>
      </div>
    </aside>
  );
}
