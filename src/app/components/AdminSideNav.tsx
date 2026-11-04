"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdArrowForward,
  MdClose,
  MdDashboardCustomize,
  MdFormatListBulleted,
  MdGroups,
  MdMenu,
  MdOutlineArticle,
  MdOutlineAutoGraph,
  MdOutlineCloudUpload,
  MdOutlineGrading,
  MdOutlineHistory,
  MdOutlineLibraryBooks,
  MdOutlineMailOutline,
  MdOutlinePeopleAlt,
  MdOutlineQuiz,
  MdReportProblem,
  MdSpaceDashboard,
} from "react-icons/md";

type Item = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  tone?: "brand" | "warn";
};

type Group = { title: string; items: Item[] };

export default function AdminSideNav({
  view,
  openReports,
  draftBanks,
  pendingGrading,
}: {
  view: string;
  openReports: number;
  draftBanks: number;
  pendingGrading: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [view]);

  const groups: Group[] = [
    {
      title: "Write",
      items: [
        {
          id: "blog",
          label: "Blog studio",
          href: "/admin?view=blog",
          icon: <MdOutlineArticle size={18} />,
        },
        {
          id: "import",
          label: "Course JSON",
          href: "/admin?view=import",
          icon: <MdOutlineCloudUpload size={18} />,
        },
        {
          id: "questions",
          label: "Question bank",
          href: "/admin?view=questions",
          icon: <MdOutlineQuiz size={18} />,
          badge: draftBanks,
          tone: "brand",
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          id: "reports",
          label: "Question reports",
          href: "/admin?view=reports",
          icon: <MdReportProblem size={18} />,
          badge: openReports,
          tone: "warn",
        },
        {
          id: "requests",
          label: "Course requests",
          href: "/admin?view=requests",
          icon: <MdOutlineMailOutline size={18} />,
        },
        {
          id: "grading",
          label: "Practical grading",
          href: "/admin?view=grading",
          icon: <MdOutlineGrading size={18} />,
          badge: pendingGrading,
          tone: "brand",
        },
      ],
    },
    {
      title: "Platform",
      items: [
        {
          id: "overview",
          label: "Overview",
          href: "/admin",
          icon: <MdSpaceDashboard size={18} />,
        },
        {
          id: "users",
          label: "Users & roles",
          href: "/admin?view=users",
          icon: <MdOutlinePeopleAlt size={18} />,
        },
        {
          id: "invitations",
          label: "Invitations",
          href: "/admin?view=invitations",
          icon: <MdOutlineMailOutline size={18} />,
        },
        {
          id: "courses",
          label: "Courses & content",
          href: "/admin?view=courses",
          icon: <MdOutlineLibraryBooks size={18} />,
        },
        {
          id: "activity",
          label: "Learning activity",
          href: "/admin?view=activity",
          icon: <MdOutlineHistory size={18} />,
        },
      ],
    },
  ];

  const sidebar = (
    <div className='flex h-full flex-col bg-gradient-to-b from-[#0d2c5d] via-[#0f3268] to-[#0b2450] text-white'>
      <div className='flex items-center gap-3 border-b border-white/10 px-5 py-5'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15'>
          <MdDashboardCustomize size={20} />
        </span>
        <div className='min-w-0'>
          <p className='truncate text-base font-black tracking-tight'>
            Certify<span className='text-[#7fd7b6]'>Hub</span>
          </p>
          <p className='mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45'>
            Admin studio
          </p>
        </div>
        <button
          type='button'
          onClick={() => setOpen(false)}
          className='ml-auto text-white/60 transition hover:text-white lg:hidden'
          aria-label='Close menu'
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-4'>
        {groups.map((group) => (
          <div key={group.title} className='mb-5'>
            <p className='px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35'>
              {group.title}
            </p>

            <div className='space-y-1'>
              {group.items.map((item) => {
                const active = item.id === view;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition ${
                      active
                        ? "bg-white text-[#0d2c5d] shadow-lg shadow-black/20"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                        active
                          ? "bg-[#2660A4]/10 text-[#2660A4]"
                          : "text-white/60 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className='flex-1 truncate'>{item.label}</span>

                    {item.badge ? (
                      <span
                        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          active
                            ? item.tone === "warn"
                              ? "bg-amber-500 text-white"
                              : "bg-[#2660A4] text-white"
                            : item.tone === "warn"
                              ? "bg-amber-400 text-[#3b2400]"
                              : "bg-white/15 text-white"
                        }`}
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className='space-y-2 border-t border-white/10 px-3 py-4'>
        <Link
          href='/'
          className='flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white'
        >
          <MdOutlineAutoGraph size={16} />
          Back to the catalogue
          <MdArrowForward size={14} className='ml-auto' />
        </Link>
        <Link
          href='/blog'
          className='flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white'
        >
          <MdFormatListBulleted size={16} />
          View the public blog
        </Link>
        <Link
          href='/admin?view=blog'
          className='mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#7fd7b6] px-3 py-2.5 text-[13px] font-black text-[#08301f] transition hover:bg-[#9be6cb]'
        >
          <MdGroups size={16} />
          Write something
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className='sticky top-16 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden'>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700'
        >
          <MdMenu size={16} /> Studio menu
        </button>
        <span className='text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400'>
          {view}
        </span>
      </div>

      {open && (
        <div className='fixed inset-0 z-[70] lg:hidden'>
          <div
            className='absolute inset-0 bg-slate-900/50 backdrop-blur-sm'
            onClick={() => setOpen(false)}
          />
          <aside className='absolute inset-y-0 left-0 w-[280px] shadow-2xl'>
            {sidebar}
          </aside>
        </div>
      )}

      <aside className='fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-black/10 shadow-xl shadow-slate-900/10 lg:block'>
        {sidebar}
      </aside>
    </>
  );
}
