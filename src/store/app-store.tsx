"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { ENROLLMENT_LIMIT } from "@/types/app";
import type { AppRole, Enrollment, Profile } from "@/types/app";

type MeResponse = {
  configured: boolean;
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  enrollments: Enrollment[];
  limit?: number;
};

type AppStoreValue = {
  ready: boolean;
  configured: boolean;
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  role: AppRole;
  isAdmin: boolean;
  isStaff: boolean;
  enrollments: Enrollment[];
  enrolledCourseIds: string[];
  activeCourseIds: string[];
  limit: number;
  remaining: number;
  refresh: () => Promise<void>;
  addEnrollment: (enrollment: Enrollment) => void;
  removeEnrollment: (courseId: string) => void;
  setFullName: (fullName: string) => void;
};

type AppState = {
  ready: boolean;
  configured: boolean;
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  enrollments: Enrollment[];
  limit: number;
};

const initialState: AppState = {
  ready: false,
  configured: true,
  user: null,
  profile: null,
  enrollments: [],
  limit: ENROLLMENT_LIMIT,
};

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/me", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Session request failed (${response.status})`);
      }

      const data = (await response.json()) as MeResponse;

      setState({
        ready: true,
        configured: data.configured,
        user: data.user,
        profile: data.profile,
        enrollments: data.enrollments ?? [],
        limit: data.limit ?? ENROLLMENT_LIMIT,
      });
    } catch (error) {
      console.warn("Could not load the learner session:", error);
      setState((previous) => ({ ...previous, ready: true }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Keep the store in sync when Supabase signs someone in or out in another
  // tab, or when a session is refreshed.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED"
        ) {
          void refresh();
        }
      });

      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.warn("Supabase auth listener unavailable:", error);
    }

    return () => unsubscribe?.();
  }, [refresh]);

  const addEnrollment = useCallback((enrollment: Enrollment) => {
    setState((previous) => {
      if (
        previous.enrollments.some(
          (item) => item.courseId === enrollment.courseId,
        )
      ) {
        return previous;
      }

      return {
        ...previous,
        enrollments: [enrollment, ...previous.enrollments],
      };
    });
  }, []);

  const removeEnrollment = useCallback((courseId: string) => {
    setState((previous) => ({
      ...previous,
      enrollments: previous.enrollments.filter(
        (item) => item.courseId !== courseId,
      ),
    }));
  }, []);

  const setFullName = useCallback((fullName: string) => {
    setState((previous) =>
      previous.profile
        ? { ...previous, profile: { ...previous.profile, fullName } }
        : previous,
    );
  }, []);

  const value = useMemo<AppStoreValue>(() => {
    const role: AppRole = state.profile?.role ?? "learner";
    const activeCourseIds = state.enrollments
      .filter((item) => item.status === "active")
      .map((item) => item.courseId);

    return {
      ready: state.ready,
      configured: state.configured,
      user: state.user,
      profile: state.profile,
      role,
      isAdmin: role === "admin",
      isStaff: role === "admin" || role === "instructor",
      enrollments: state.enrollments,
      enrolledCourseIds: state.enrollments.map((item) => item.courseId),
      activeCourseIds,
      limit: state.limit,
      remaining: Math.max(0, state.limit - activeCourseIds.length),
      refresh,
      addEnrollment,
      removeEnrollment,
      setFullName,
    };
  }, [
    state,
    refresh,
    addEnrollment,
    removeEnrollment,
    setFullName,
  ]);

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error("useAppStore must be used inside <AppStoreProvider>");
  }

  return value;
}
