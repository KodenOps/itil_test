"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdCampaign,
  MdCheckCircle,
  MdMarkEmailRead,
  MdNotifications,
  MdOutlineArticle,
  MdOutlineQuiz,
} from "react-icons/md";
import type { Notification } from "@/types/app";

function iconFor(type: Notification["type"]) {
  switch (type) {
    case "report_replied":
      return <MdMarkEmailRead size={15} />;
    case "question_updated":
      return <MdOutlineQuiz size={15} />;
    case "blog_published":
      return <MdOutlineArticle size={15} />;
    default:
      return <MdCampaign size={15} />;
  }
}

function timeAgo(value: string): string {
  const then = new Date(value).getTime();
  if (isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;

      const data = (await res.json()) as {
        notifications?: Notification[];
        unread?: number;
      };

      setNotifications(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // The bell must never break navigation.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const timer = setInterval(() => void load(), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const markRead = async (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
      ),
    );
    setUnread((count) => Math.max(0, count - 1));

    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
  };

  const markAllRead = async () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })),
    );
    setUnread(0);

    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => undefined);
  };

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        onClick={() => {
          setOpen((value) => !value);
          if (!open) void load();
        }}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className='relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#2660A4] hover:text-[#2660A4]'
      >
        <MdNotifications size={18} />
        {unread > 0 && (
          <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2660A4] px-1 text-[10px] font-bold text-white'>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 top-[calc(100%+10px)] z-50 w-[22rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10'>
          <div className='flex items-center justify-between border-b border-slate-100 px-4 py-3'>
            <p className='text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400'>
              Notifications
            </p>
            {unread > 0 ? (
              <button
                type='button'
                onClick={markAllRead}
                className='inline-flex items-center gap-1 text-[11px] font-bold text-[#2660A4] hover:underline'
              >
                <MdCheckCircle size={12} /> Mark all read
              </button>
            ) : (
              <span className='text-[11px] font-semibold text-slate-400'>All caught up</span>
            )}
          </div>

          <div className='max-h-[24rem] overflow-y-auto'>
            {loading ? (
              <p className='px-4 py-8 text-center text-sm text-slate-400'>Loading…</p>
            ) : notifications.length === 0 ? (
              <div className='px-4 py-10 text-center'>
                <p className='text-sm font-semibold text-slate-600'>Nothing yet</p>
                <p className='mt-1 text-xs text-slate-400'>
                  Replies to your question reports, fixes and new posts land here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const body = (
                  <>
                    <div className='flex items-start gap-2.5'>
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          item.readAt
                            ? "bg-slate-100 text-slate-400"
                            : "bg-[#2660A4]/10 text-[#2660A4]"
                        }`}
                      >
                        {iconFor(item.type)}
                      </span>
                      <div className='min-w-0'>
                        <p className='text-xs font-bold text-slate-900'>{item.title}</p>
                        <p className='mt-0.5 line-clamp-2 text-[12.5px] leading-5 text-slate-600'>
                          {item.body}
                        </p>
                        <p className='mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400'>
                          {timeAgo(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </>
                );

                return (
                  <div
                    key={item.id}
                    className={`border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${
                      item.readAt ? "" : "bg-[#2660A4]/[0.04]"
                    }`}
                  >
                    {item.link ? (
                      <Link
                        href={item.link}
                        onClick={() => {
                          void markRead(item.id);
                          setOpen(false);
                        }}
                        className='block'
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type='button'
                        onClick={() => void markRead(item.id)}
                        className='block w-full text-left'
                      >
                        {body}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <Link
            href='/notifications'
            onClick={() => setOpen(false)}
            className='block border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-[#2660A4] transition hover:bg-[#2660A4]/5'
          >
            See everything, including your report replies
          </Link>
        </div>
      )}
    </div>
  );
}
