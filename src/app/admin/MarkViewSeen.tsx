"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markAdminViewNotificationsRead } from "./actions";

/**
 * Clears the admin alerts for the section that is on screen.
 *
 * Rendered by the dashboard shell, so the red dot on the side nav and the bell
 * badge both drop as soon as an admin opens reports, grading, requests or users.
 */
export default function MarkViewSeen({ view }: { view: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    void markAdminViewNotificationsRead(view)
      .then((result) => {
        if (cancelled || !result.ok || !result.cleared) return;

        // The bell lives in the top nav, outside this server render, so tell it
        // to reload instead of waiting for its next poll.
        window.dispatchEvent(new Event("certifyhub:notifications"));
        router.refresh();
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [view, router]);

  return null;
}
