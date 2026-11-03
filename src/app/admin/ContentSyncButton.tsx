"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContentSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const router = useRouter();

  const sync = async () => {
    setIsSyncing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/sync-content", {
        method: "POST",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        counts?: { questions: number; tasks: number; reviews: number };
      };

      if (!response.ok || !data.ok) {
        setMessage({
          tone: "error",
          text: data.error ?? "Sync failed. Check the server logs.",
        });
        return;
      }

      setMessage({
        tone: "ok",
        text: `Synced ${data.counts?.questions ?? 0} questions, ${
          data.counts?.tasks ?? 0
        } tasks and ${data.counts?.reviews ?? 0} reviews.`,
      });
      router.refresh();
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Sync failed.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={sync}
        disabled={isSyncing}
        className='rounded-full bg-[#2660A4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f4f8d] disabled:opacity-60'
      >
        {isSyncing ? "Syncing question banks…" : "Sync question bank from /data"}
      </button>
      {message && (
        <p
          className={`text-sm ${
            message.tone === "ok" ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
