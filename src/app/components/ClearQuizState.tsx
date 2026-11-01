"use client";

import { useEffect } from "react";

/**
 * The assessment components persist their session under one shared
 * localStorage key. Clearing it on mount keeps a fresh assessment from
 * restoring another course's questions (previous page-level behaviour).
 */
export default function ClearQuizState() {
  useEffect(() => {
    try {
      localStorage.clear();
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  return null;
}
