"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdArrowForward,
  MdClose,
  MdDashboardCustomize,
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
  alerts = {},
}: {
  view: string;
  openReports: number;
  draftBanks: number;
  pendingGrading: number;
  /** Unread admin alerts per section; renders the red dot until it is opened. */
  alerts?: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [view]);

  const groups: Group[] = [
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
  ];

  const shortcuts: Item[] = [
    {
      id: "catalogue",
      label: "Back to the catalogue",
      href: "/",
      icon: <MdOutlineAutoGraph size={17} />,
    },
    {
      id: "public-blog",
      label: "View the public blog",
      href: "/blog",
      icon: <MdOutlineArticle size={17} />,
    },
  ];

  const itemClass = (active: boolean) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition ${
      active
        ? "bg-slate-900 font-bold text-white shadow-sm"
        : "font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const renderItem = (item: Item) => {
    const active = item.id === view;
    const alert = alerts[item.id] ?? 0;

    return (
      <Link key={item.id} href={item.href} className={itemClass(active)}>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
            active
              ? "bg-white/15 text-white"
              : "text-slate-400 group-hover:text-slate-700"
          }`}
        >
          {item.icon}
        </span>
        <span className='flex-1 truncate'>{item.label}</span>

        {alert > 0 ? (
          // Something landed here and has not been opened yet.
          <span
            className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-white'
            title={`${alert} new`}
          >
            {alert > 99 ? "99+" : alert}
          </span>
        ) : item.badge ? (
          <span
            className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
              active
                ? "bg-white text-slate-900"
                : item.tone === "warn"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  const sidebar = (
    <div className='flex h-full flex-col border-r border-slate-200 bg-white text-slate-700'>
      <div className='flex items-center gap-3 border-b border-slate-200 px-5 py-5'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0d2c5d] text-white'>
          <MdDashboardCustomize size={20} />
        </span>
        <div className='min-w-0'>
          <p className='truncate text-base font-black tracking-tight text-slate-900'>
            Certify<span className='text-[#2660A4]'>Hub</span>
          </p>
          <p className='mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
            Admin studio
          </p>
        </div>
        <button
          type='button'
          onClick={() => setOpen(false)}
          className='ml-auto text-slate-400 transition hover:text-slate-900 lg:hidden'
          aria-label='Close menu'
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-4'>
        {groups.map((group) => (
          <div key={group.title} className='mb-5'>
            <p className='px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400'>
              {group.title}
            </p>

            <div className='space-y-1'>{group.items.map(renderItem)}</div>
          </div>
        ))}

        <div className='border-t border-slate-100 pt-4'>
          <p className='px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400'>
            Shortcuts
          </p>

          <div className='space-y-1'>
            {shortcuts.map(renderItem)}

            <Link
              href='/admin?view=blog'
              className='group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
            >
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition group-hover:text-slate-700'>
                <MdGroups size={18} />
              </span>
              <span className='flex-1 truncate'>Write something</span>
              <MdArrowForward size={14} className='text-slate-400' />
            </Link>
          </div>
        </div>
      </nav>
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
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
            onClick={() => setOpen(false)}
          />
          <aside className='absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl'>
            {sidebar}
          </aside>
        </div>
      )}

      <aside className='fixed inset-y-0 left-0 z-30 hidden w-[264px] shadow-[1px_0_0_0_rgba(15,23,42,0.06)] lg:block'>
        {sidebar}
      </aside>
    </>
  );
}
