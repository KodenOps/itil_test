/**
 * Shared PWA helpers used by the navbar and the install prompt. Safe to
 * import from client components: every access to browser globals is guarded.
 */

export const INSTALL_PROMPT_EVENT = "certifyhub:open-install-prompt";

const DEFAULT_SNOOZE_DAYS = 14;

function parseSnoozeDays(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return DEFAULT_SNOOZE_DAYS;

  const days = Number(value);

  if (!Number.isFinite(days) || days < 0) return DEFAULT_SNOOZE_DAYS;

  // `0` means "ask every visit"; cap the upper bound to a year.
  return Math.min(Math.floor(days), 365);
}

/**
 * How long a dismissed install prompt stays quiet. Configure with
 * NEXT_PUBLIC_INSTALL_PROMPT_SNOOZE_DAYS (default 14, 0 = ask every visit).
 */
export const INSTALL_PROMPT_SNOOZE_DAYS = parseSnoozeDays(
  process.env.NEXT_PUBLIC_INSTALL_PROMPT_SNOOZE_DAYS,
);

/** True when the app is already running as an installed PWA. */
export function isAppInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const nav = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    nav.standalone === true
  );
}

/** Ask the install prompt to open, from anywhere in the app. */
export function requestInstallPrompt(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(INSTALL_PROMPT_EVENT));
}
