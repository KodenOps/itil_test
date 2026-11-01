"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaBookOpen,
  FaChartPie,
  FaChevronDown,
  FaChevronRight,
  FaCommentDots,
  FaGraduationCap,
  FaHome,
  FaLayerGroup,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { MdDashboardCustomize, MdOutlineInstallMobile } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { isAppInstalled, requestInstallPrompt } from "@/lib/pwa";
import { ROLE_LABELS } from "@/types/app";

const BRAND_DEEP = "#0d2c5d";
const BRAND = "#2660A4";

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  badge?: number;
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Starts false so the server and client markup match; revealed after mount
  // only when the app is not already installed.
  const [canInstall, setCanInstall] = useState(false);

  const { ready, user, profile, role, isAdmin, enrollments, signOutRefresh } =
    useNavState();

  const router = useRouter();
  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.fullName || user?.email?.split("@")[0] || "Learner";
  const initials = getInitials(displayName, user?.email);
  const activeCourses = enrollments.filter((item) => item.status === "active");

  const links: NavLink[] = [
    { href: "/", label: "Home", icon: <FaHome size={15} /> },
    {
      href: "/profile",
      label: "My Courses",
      icon: <FaGraduationCap size={16} />,
      badge: activeCourses.length,
    },
    { href: "/blog", label: "My Blog", icon: <FaBookOpen size={14} /> },
    {
      href: "https://rubytech.com.ng/bootcamp",
      label: "Bootcamp",
      icon: <FaLayerGroup size={14} />,
      external: true,
    },
    {
      href: "/page/suggestion",
      label: "Feedback",
      icon: <FaCommentDots size={14} />,
    },
  ];

  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (isAppInstalled()) return;

    setCanInstall(true);

    const onInstalled = () => setCanInstall(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation, and keep the page behind it still.
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signOutRefresh();
      setIsProfileOpen(false);
      closeMenu();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Unexpected sign-out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignIn = () => {
    const callback = pathname ?? "/";
    closeMenu();
    router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
  };

  const UserAvatar = ({
    size = 40,
    tone = "light",
  }: {
    size?: number;
    tone?: "light" | "dark";
  }) => (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold ${
        tone === "dark"
          ? "bg-white/15 text-white ring-1 ring-white/30"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80"
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {initials}
    </span>
  );

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-slate-900/[0.06]" : ""
      }`}
    >
      <div className='relative border-b border-slate-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70'>
        <div className='mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:h-[84px] lg:px-8'>
          {/* Brand */}
          <Link
            href='/'
            aria-label='CertifyHub home'
            className='group flex items-center gap-2.5 rounded-2xl pr-1'
          >
            <span className='relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#0d2c5d] shadow-lg shadow-[#2660A4]/25 ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-0.5 md:h-12 md:w-12 md:rounded-2xl'>
              <Image
                src='/icons/icon-192.png'
                alt='CertifyHub logo'
                width={48}
                height={48}
                priority
                className='h-full w-full object-cover'
              />
            </span>

            <span className='flex flex-col leading-none'>
              <span className='text-[19px] font-black tracking-tight text-slate-900 md:text-[22px]'>
                Certify
                <span className='bg-gradient-to-r from-[#2660A4] to-[#26a465] bg-clip-text text-transparent'>
                  Hub
                </span>
              </span>
              <span className='mt-1.5 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block'>
                Learn · Practise · Pass
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className='hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-100/60 p-1 lg:flex'>
            {links.map((link) => {
              const active = !link.external && isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold transition-all duration-200 xl:px-3.5 xl:text-sm ${
                    active
                      ? "bg-white text-[#0d2c5d] shadow-sm ring-1 ring-slate-900/5"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                  }`}
                >
                  <span className={active ? "text-[#2660A4]" : "text-slate-400"}>
                    {link.icon}
                  </span>
                  {link.label}
                  {!!link.badge && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                        active
                          ? "bg-[#2660A4] text-white"
                          : "bg-[#2660A4]/10 text-[#2660A4]"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className='flex items-center gap-2'>
            {canInstall && (
              <button
                type='button'
                onClick={requestInstallPrompt}
                className='hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-[#2660A4] hover:shadow-md xl:inline-flex'
              >
                <MdOutlineInstallMobile size={16} />
                Install
              </button>
            )}

            {isAdmin && (
              <Link
                href='/admin'
                className='hidden items-center gap-2 rounded-full bg-[#0d2c5d] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0d2c5d]/20 transition hover:-translate-y-0.5 hover:bg-[#0a2247] hover:shadow-xl lg:inline-flex'
              >
                <MdDashboardCustomize size={15} />
                Admin
              </Link>
            )}

            {ready && user ? (
              <div ref={profileRef} className='relative ml-1 hidden lg:block'>
                <button
                  type='button'
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup='menu'
                  className={`flex items-center gap-2 rounded-full border p-1 pr-2.5 transition ${
                    isProfileOpen
                      ? "border-slate-300 bg-slate-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <UserAvatar size={34} />

                  <span className='hidden max-w-[132px] text-left xl:block'>
                    <span className='block truncate text-[13px] font-semibold leading-tight text-slate-900'>
                      {displayName}
                    </span>
                    <span className='block truncate text-[11px] leading-tight text-slate-400'>
                      {ROLE_LABELS[role]}
                    </span>
                  </span>

                  <FaChevronDown
                    size={10}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    className='absolute right-0 top-[calc(100%+14px)] z-50 w-80 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10'
                    role='menu'
                  >
                    <div className='relative overflow-hidden bg-gradient-to-br from-[#0d2c5d] via-[#1b4a86] to-[#2660A4] px-5 py-5 text-white'>
                      <span className='pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl' />

                      <div className='relative flex items-center gap-3'>
                        <UserAvatar size={46} tone='dark' />

                        <div className='min-w-0'>
                          <p className='truncate text-sm font-bold'>
                            {displayName}
                          </p>
                          {user.email && (
                            <p className='truncate text-xs text-white/65'>
                              {user.email}
                            </p>
                          )}
                          <span className='mt-1.5 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]'>
                            {ROLE_LABELS[role]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='p-2'>
                      <Link
                        href='/profile'
                        onClick={() => setIsProfileOpen(false)}
                        className='group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900'
                        role='menuitem'
                      >
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-[#2660A4]/10 group-hover:text-[#2660A4]'>
                          <FaUser size={13} />
                        </span>
                        My profile & activity
                        <FaChevronRight
                          size={10}
                          className='ml-auto text-slate-300'
                        />
                      </Link>

                      <Link
                        href='/profile#courses'
                        onClick={() => setIsProfileOpen(false)}
                        className='group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900'
                        role='menuitem'
                      >
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-[#2660A4]/10 group-hover:text-[#2660A4]'>
                          <FaGraduationCap size={15} />
                        </span>
                        Enrolled courses
                        <span className='ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500'>
                          {activeCourses.length}/2
                        </span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href='/admin'
                          onClick={() => setIsProfileOpen(false)}
                          className='group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900'
                          role='menuitem'
                        >
                          <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#2660A4]/10 text-[#2660A4]'>
                            <FaChartPie size={13} />
                          </span>
                          Admin dashboard
                          <FaChevronRight
                            size={10}
                            className='ml-auto text-slate-300'
                          />
                        </Link>
                      )}

                      <div className='my-1.5 h-px bg-slate-100' />

                      <button
                        type='button'
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className='flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                        role='menuitem'
                      >
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-red-50'>
                          <FaSignOutAlt size={13} />
                        </span>
                        {isSigningOut ? "Signing out…" : "Log out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : ready && !user ? (
              <button
                type='button'
                onClick={handleSignIn}
                className='ml-1 hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#2660A4] to-[#1b4a86] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2660A4]/25 transition hover:-translate-y-0.5 hover:shadow-xl lg:inline-flex'
              >
                <FaSignInAlt size={13} />
                Sign in
              </button>
            ) : null}

            {/* Mobile trigger */}
            <button
              type='button'
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls='mobile-nav-sheet'
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 lg:hidden'
            >
              {isOpen ? <FaTimes size={19} /> : <FaBars size={19} />}
            </button>
          </div>
        </div>

        <span className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2660A4]/25 to-transparent' />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        <aside
          id='mobile-nav-sheet'
          role='dialog'
          aria-modal='true'
          aria-label='Navigation'
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-hidden rounded-l-[28px] bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sheet header */}
          <div className='relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-white to-[#2660A4]/[0.06] px-5 pb-4 pt-5'>
            <span className='pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#2660A4]/10 blur-2xl' />

            <div className='relative flex items-start justify-between gap-3'>
              <div className='flex items-center gap-2.5'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0d2c5d] shadow-md shadow-[#2660A4]/25'>
                  <Image
                    src='/icons/icon-192.png'
                    alt=''
                    width={40}
                    height={40}
                    className='h-full w-full object-cover'
                  />
                </span>

                <div className='leading-none'>
                  <p className='text-[15px] font-black tracking-tight text-slate-900'>
                    Certify
                    <span className='bg-gradient-to-r from-[#2660A4] to-[#26a465] bg-clip-text text-transparent'>
                      Hub
                    </span>
                  </p>
                  <p className='mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400'>
                    Learn · Practise · Pass
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={closeMenu}
                aria-label='Close menu'
                className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition active:scale-95'
              >
                <FaTimes size={17} />
              </button>
            </div>
          </div>

          {/* Sheet body */}
          <div className='flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4'>
            {ready && user ? (
              <Link
                href='/profile'
                onClick={closeMenu}
                className='group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2c5d] via-[#1b4a86] to-[#2660A4] p-4 text-white shadow-lg shadow-[#2660A4]/20 transition active:scale-[0.99]'
              >
                <span className='pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl' />

                <UserAvatar size={42} tone='dark' />

                <span className='relative min-w-0 flex-1'>
                  <span className='block truncate text-[15px] font-bold'>
                    {displayName}
                  </span>
                  <span className='block truncate text-xs text-white/65'>
                    {user.email}
                  </span>
                </span>

                <span className='relative rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]'>
                  {ROLE_LABELS[role]}
                </span>
              </Link>
            ) : ready && !user ? (
              <div className='rounded-2xl border border-slate-200 bg-slate-50/80 p-4'>
                <p className='text-sm font-bold text-slate-900'>
                  Welcome to CertifyHub
                </p>
                <p className='mt-1 text-xs leading-relaxed text-slate-500'>
                  Sign in to track your courses, scores and progress.
                </p>

                <button
                  type='button'
                  onClick={handleSignIn}
                  className='mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2660A4] to-[#1b4a86] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2660A4]/25 transition active:scale-[0.99]'
                >
                  <FaSignInAlt size={13} />
                  Sign in
                </button>
              </div>
            ) : null}

            <p className='px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
              Explore
            </p>

            <div className='space-y-1'>
              {links.map((link) => {
                const active = !link.external && isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                      active
                        ? "bg-[#2660A4]/10 text-[#0d2c5d]"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        active
                          ? "bg-white text-[#2660A4] shadow-sm"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#2660A4] group-hover:shadow-sm"
                      }`}
                    >
                      {link.icon}
                    </span>

                    <span className='flex-1 text-[15px] font-semibold'>
                      {link.label}
                    </span>

                    {!!link.badge && (
                      <span className='rounded-full bg-[#2660A4] px-2 py-0.5 text-[10px] font-bold text-white'>
                        {link.badge}
                      </span>
                    )}

                    <FaChevronRight
                      size={11}
                      className='text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400'
                    />
                  </Link>
                );
              })}
            </div>

            <p className='px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
              Account
            </p>

            <div className='space-y-1'>
              {canInstall && (
                <button
                  type='button'
                  onClick={() => {
                    closeMenu();
                    requestInstallPrompt();
                  }}
                  className='group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-slate-800 transition hover:bg-slate-50'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-white group-hover:text-[#2660A4] group-hover:shadow-sm'>
                    <MdOutlineInstallMobile size={18} />
                  </span>
                  <span className='flex-1 text-[15px] font-semibold'>
                    Install app
                  </span>
                  <FaChevronRight size={11} className='text-slate-300' />
                </button>
              )}

              {user && (
                <Link
                  href='/profile#courses'
                  onClick={closeMenu}
                  className='group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-slate-800 transition hover:bg-slate-50'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-white group-hover:text-[#2660A4] group-hover:shadow-sm'>
                    <FaGraduationCap size={16} />
                  </span>
                  <span className='flex-1 text-[15px] font-semibold'>
                    My enrolments
                  </span>
                  <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500'>
                    {activeCourses.length}/2
                  </span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href='/admin'
                  onClick={closeMenu}
                  className='group flex items-center gap-3 rounded-2xl bg-[#0d2c5d] px-3 py-2.5 text-white shadow-lg shadow-[#0d2c5d]/20 transition active:scale-[0.99]'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white'>
                    <MdDashboardCustomize size={17} />
                  </span>
                  <span className='flex-1 text-[15px] font-semibold'>
                    Admin dashboard
                  </span>
                  <FaChevronRight size={11} className='text-white/50' />
                </Link>
              )}

              {user && (
                <button
                  type='button'
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className='group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500'>
                    <FaSignOutAlt size={15} />
                  </span>
                  <span className='flex-1 text-[15px] font-semibold'>
                    {isSigningOut ? "Signing out…" : "Log out"}
                  </span>
                </button>
              )}
            </div>

            <p className='px-3 pt-6 text-[10px] font-medium leading-relaxed text-slate-400'>
              CertifyHub · Professional exam practice
            </p>
          </div>
        </aside>
      </div>
    </nav>
  );
};

function getInitials(name: string | null, email: string | null | undefined) {
  if (name) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0]?.[0]?.toUpperCase() ?? "U";
  }

  return email?.charAt(0).toUpperCase() ?? "U";
}

function useNavState() {
  const store = useAppStore();

  return {
    ready: store.ready,
    user: store.user,
    profile: store.profile,
    role: store.role,
    isAdmin: store.isAdmin,
    enrollments: store.enrollments,
    signOutRefresh: store.refresh,
  };
}

export default NavBar;
