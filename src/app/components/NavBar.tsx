"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaHome,
  FaLightbulb,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // Reference to desktop profile dropdown
  const profileRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
  };

  /**
   * Close desktop profile dropdown when clicking outside it.
   */
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Get the currently authenticated Supabase user.
   */
  const fetchUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting authenticated user:", error);
        setUser(null);
        return;
      }

      if (!user) {
        setUser(null);
        return;
      }

      /**
       * Google authentication stores profile information
       * inside user.user_metadata.
       */
      const metadata = user.user_metadata ?? {};

      setUser({
        id: user.id,
        email: user.email ?? null,
        name: metadata.full_name ?? metadata.name ?? null,
        avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
      });
    } catch (error) {
      console.error("Unexpected error getting user:", error);
      setUser(null);
    } finally {
      setIsCheckingUser(false);
    }
  };

  /**
   * Check the current user when the navbar loads
   * and listen for authentication changes.
   */
  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const authUser = session.user;
        const metadata = authUser.user_metadata ?? {};

        setUser({
          id: authUser.id,
          email: authUser.email ?? null,
          name: metadata.full_name ?? metadata.name ?? null,
          avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
        });
      } else {
        setUser(null);
        setIsProfileOpen(false);
      }

      setIsCheckingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Get user initials for fallback avatar.
   */
  const getInitials = () => {
    if (user?.name) {
      const names = user.name.trim().split(/\s+/);

      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }

      return names[0][0]?.toUpperCase() ?? "U";
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  /**
   * User avatar component.
   */
  const UserAvatar = ({ size = 40 }: { size?: number }) => {
    if (!user) {
      return null;
    }

    return (
      <div
        className='overflow-hidden rounded-full border border-slate-200 bg-slate-100'
        style={{
          width: size,
          height: size,
        }}
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || "User avatar"}
            width={size}
            height={size}
            className='h-full w-full object-cover'
            unoptimized
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-600'>
            {getInitials()}
          </div>
        )}
      </div>
    );
  };

  /**
   * Sign out.
   */
  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        return;
      }

      setUser(null);
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

  return (
    <nav className='fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/90 px-4 shadow-sm shadow-slate-200/70 backdrop-blur md:px-6 lg:px-10'>
      <div className='mx-auto flex h-[84px] w-full max-w-7xl items-center justify-between gap-4'>
        {/* ============================================================
            LOGO
        ============================================================ */}
        <Link
          href='/'
          className='inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md'
        >
          <span className='text-lg font-black tracking-tight text-slate-900 md:text-2xl'>
            Certify<span className='text-[#2660A4]'>Hub</span>
          </span>
        </Link>

        {/* ============================================================
            DESKTOP NAVIGATION
        ============================================================ */}
        <div className='hidden items-center gap-2 font-medium text-slate-700 md:flex'>
          {/* Home */}
          <Link
            href='/'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Home
          </Link>

          {/* Blog */}
          <Link
            href='/blog'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            My Blog
          </Link>

          {/* Feedback */}
          <Link
            href='/page/suggestion'
            className='rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-[#2660A4]'
          >
            Feedback & Report Bug
          </Link>

          {/* Exam Hub */}
          <Link
            href='/page/exams'
            className='ml-2 rounded-full bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800'
          >
            Exam Hub
          </Link>

          {/* ============================================================
              DESKTOP PROFILE
          ============================================================ */}
          {!isCheckingUser && user && (
            <div ref={profileRef} className='relative ml-2'>
              {/* Profile Trigger */}
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
                    {user.name || "User"}
                  </p>

                  <p className='truncate text-xs text-slate-400'>
                    {user.email}
                  </p>
                </div>

                <FaChevronDown
                  size={11}
                  className={`mr-1 text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ========================================================
                  DESKTOP PROFILE DROPDOWN
              ======================================================== */}
              {isProfileOpen && (
                <div
                  className='absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70'
                  role='menu'
                >
                  {/* User Information */}
                  <div className='border-b border-slate-100 px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <UserAvatar size={48} />

                      <div className='min-w-0'>
                        <p className='truncate text-sm font-bold text-slate-900'>
                          {user.name || "User"}
                        </p>

                        {user.email && (
                          <p className='truncate text-xs text-slate-400'>
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Actions */}
                  <div className='p-2'>
                    {/* Profile */}
                    <Link
                      href='/profile'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900'
                      role='menuitem'
                    >
                      <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500'>
                        <FaUser size={14} />
                      </span>
                      Profile
                    </Link>

                    {/* Logout */}
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
          )}
        </div>

        {/* ============================================================
            MOBILE MENU BUTTON
        ============================================================ */}
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

      {/* ================================================================
          MOBILE OVERLAY
      ================================================================= */}
      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm'
          onClick={closeMenu}
        />
      )}

      {/* ================================================================
          MOBILE MENU
      ================================================================= */}
      <div
        className={`fixed right-0 top-0 z-40 h-[78vh] w-full transform rounded-b-[32px] bg-white shadow-2xl shadow-slate-300/60 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className='flex flex-col p-6 text-lg font-medium text-slate-700'>
          {/* ============================================================
              MOBILE HEADER
          ============================================================ */}
          <div className='mb-6 flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
                Navigation
              </p>

              <h2 className='mt-2 text-2xl font-black text-slate-900'>
                Explore CertifyHub
              </h2>

              {/* Mobile User */}
              {user && (
                <div className='mt-3 flex items-center gap-3'>
                  <UserAvatar size={42} />

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {user.name || "User"}
                    </p>

                    {user.email && (
                      <p className='truncate text-xs font-medium text-slate-400'>
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type='button'
              onClick={closeMenu}
              aria-label='Close menu'
              className='ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600'
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* ============================================================
              HOME
          ============================================================ */}
          <Link
            href='/'
            className='flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaHome size={24} color='#64748b' />
            Home
          </Link>

          {/* ============================================================
              BLOG
          ============================================================ */}
          <Link
            href='/blog'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            My Blog
          </Link>

          {/* ============================================================
              FEEDBACK
          ============================================================ */}
          <Link
            href='/page/suggestion'
            className='mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-100 hover:text-[#2660A4]'
            onClick={closeMenu}
          >
            <FaLightbulb size={24} color='#64748b' />
            Feedback & Report Bug
          </Link>

          {/* ============================================================
              EXAM HUB
          ============================================================ */}
          <Link
            href='/page/exams'
            className='mt-3 flex items-center gap-4 rounded-2xl bg-slate-900 px-4 py-4 font-semibold text-white transition hover:bg-slate-800'
            onClick={closeMenu}
          >
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black'>
              EH
            </span>
            Exam Hub
          </Link>

          {/* ============================================================
              MOBILE LOGOUT
          ============================================================ */}
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

export default NavBar;
