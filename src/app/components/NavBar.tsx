"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars,
  FaHome,
  FaLightbulb,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
  FaGraduationCap,
  FaChartPie,
} from "react-icons/fa";
import { MdDashboardCustomize, MdOutlineInstallMobile } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { isAppInstalled, requestInstallPrompt } from "@/lib/pwa";
import { ROLE_LABELS } from "@/types/app";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  const closeMenu = () => setIsOpen(false);

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
    router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
  };

  const UserAvatar = ({ size = 40 }: { size?: number }) => (
    <div
      className='overflow-hidden rounded-full border border-slate-200 bg-slate-100'
      style={{ width: size, height: size }}
    >
      <div className='flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-600'>
        {initials}
      </div>
    </div>
  );

  return (
    <nav className='fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/90 px-4 shadow-sm shadow-slate-200/70 backdrop-blur md:px-6 lg:px-10'>
      <div className='mx-auto flex h-[84px] w-full max-w-7xl items-center justify-between gap-4'>
        <Link
          href='/'
          className='inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md'
        >
          <span className='text-lg font-black tracking-tight text-slate-900 md:text-2xl'>
            Certify<span className='text-[#2660A4]'>Hub</span>
          </span>
        </Link>

        <div className='hidden items-center gap-2 font-medium text-slate-700 md:flex'>
          <Link
            href='/'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Home
          </Link>

          <Link
            href='/profile'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            My Courses
            {activeCourses.length > 0 && (
              <span className='ml-2 rounded-full bg-[#2660A4]/10 px-2 py-0.5 text-xs font-bold text-[#2660A4]'>
                {activeCourses.length}
              </span>
            )}
          </Link>

          <Link
            href='/blog'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            My Blog
          </Link>

          <Link
            href='https://rubytech.com.ng/bootcamp'
            target='_blank'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Bootcamp
          </Link>

          <Link
            href='/page/suggestion'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Feedback
          </Link>

          {isAdmin && (
            <Link
              href='/admin'
              className='flex items-center gap-2 rounded-full border border-slate-900 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white'
            >
              <MdDashboardCustomize size={15} />
              Admin
            </Link>
          )}

          {canInstall && (
            <button
              type='button'
              onClick={requestInstallPrompt}
              className='hidden items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-[#2660A4] xl:inline-flex'
            >
              <MdOutlineInstallMobile size={16} />
              Install app
            </button>
          )}

          {ready && user ? (
            <div ref={profileRef} className='relative ml-2'>
              <button
                type='button'
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-expanded={isProfileOpen}
                aria-haspopup='menu'
                className={`flex items-center gap-2 rounded-full border px-2 py-1.5 transition ${
                  isProfileOpen
                    ? "border-slate-300 bg-slate-100"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <UserAvatar size={38} />

                <div className='hidden max-w-[140px] text-left lg:block'>
                  <p className='truncate text-sm font-semibold text-slate-900'>
                    {displayName}
                  </p>
                  <p className='truncate text-xs text-slate-400'>
                    {ROLE_LABELS[role]}
                  </p>
                </div>

                <FaChevronDown
                  size={11}
                  className={`mr-1 text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div
                  className='absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70'
                  role='menu'
                >
                  <div className='border-b border-slate-100 px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <UserAvatar size={48} />
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-bold text-slate-900'>
                          {displayName}
                        </p>
                        {user.email && (
                          <p className='truncate text-xs text-slate-400'>
                            {user.email}
                          </p>
                        )}
                        <span className='mt-1 inline-flex rounded-full bg-[#2660A4]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#2660A4]'>
                          {ROLE_LABELS[role]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='p-2'>
                    <Link
                      href='/profile'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900'
                      role='menuitem'
                    >
                      <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500'>
                        <FaUser size={14} />
                      </span>
                      My profile & activity
                    </Link>

                    <Link
                      href='/profile#courses'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900'
                      role='menuitem'
                    >
                      <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500'>
                        <FaGraduationCap size={16} />
                      </span>
                      Enrolled courses
                      <span className='ml-auto text-xs font-semibold text-slate-400'>
                        {activeCourses.length}/2
                      </span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href='/admin'
                        onClick={() => setIsProfileOpen(false)}
                        className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900'
                        role='menuitem'
                      >
                        <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#2660A4]/10 text-[#2660A4]'>
                          <FaChartPie size={14} />
                        </span>
                        Admin dashboard
                      </Link>
                    )}

                    <button
                      type='button'
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                      role='menuitem'
                    >
                      <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-red-50'>
                        <FaSignOutAlt size={14} />
                      </span>
                      {isSigningOut ? "Signing out…" : "Log out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : ready && !user ? (
            <div className='ml-2'>
              <button
                type='button'
                onClick={handleSignIn}
                className='rounded-full px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-100'
              >
                Sign in
              </button>
            </div>
          ) : null}
        </div>

        <button
          type='button'
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 focus:outline-none md:hidden'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm'
          onClick={closeMenu}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-40 h-[82vh] w-full transform overflow-y-auto rounded-b-[32px] bg-white shadow-2xl shadow-slate-300/60 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className='flex flex-col p-6 text-lg font-medium text-slate-700'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                Navigation
              </p>
              <h2 className='mt-2 text-2xl font-black text-slate-900'>
                Explore CertifyHub
              </h2>

              {user && (
                <div className='mt-3 flex items-center gap-3'>
                  <UserAvatar size={42} />
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {displayName}
                    </p>
                    <p className='truncate text-xs font-medium text-slate-400'>
                      {ROLE_LABELS[role]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type='button'
              onClick={closeMenu}
              aria-label='Close menu'
              className='ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600'
            >
              <FaTimes size={24} />
            </button>
          </div>

          <Link
            href='/'
            className='flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaHome size={24} color='#64748b' />
            Home
          </Link>

          <Link
            href='/profile'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaGraduationCap size={24} color='#64748b' />
            My Courses & Profile
          </Link>

          {canInstall && (
            <button
              type='button'
              onClick={() => {
                closeMenu();
                requestInstallPrompt();
              }}
              className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            >
              <MdOutlineInstallMobile size={24} color='#64748b' />
              Install app
            </button>
          )}

          <Link
            href='/blog'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            My Blog
          </Link>

          <Link
            href='https://rubytech.com.ng/bootcamp'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaGraduationCap size={24} color='#64748b' />
            Bootcamp
          </Link>

          <Link
            href='/page/suggestion'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            Feedback & Report Bug
          </Link>

          {isAdmin && (
            <Link
              href='/admin'
              className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-4 font-semibold text-white transition hover:bg-slate-800'
              onClick={closeMenu}
            >
              <MdDashboardCustomize size={24} />
              Admin dashboard
            </Link>
          )}

          {ready && !user && (
            <button
              type='button'
              onClick={() => {
                closeMenu();
                handleSignIn();
              }}
              className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-200 hover:bg-slate-100'
            >
              <FaUser size={24} color='#64748b' />
              Sign in
            </button>
          )}

          {user && (
            <button
              type='button'
              onClick={handleSignOut}
              disabled={isSigningOut}
              className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <FaSignOutAlt size={24} color='#64748b' />
              {isSigningOut ? "Signing out…" : "Log out"}
            </button>
          )}
        </div>
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
