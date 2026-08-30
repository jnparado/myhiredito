"use client";

import { useEffect } from "react";
import { useAppAuth } from "./useAppAuth";
import {
  getEmployerUserId,
  signOutEmployer,
} from "@/app/lib/employerAuth";
import {
  hydrateEmployerOnboardingFromDb,
  setEmployerOnboardingSyncUserId,
} from "@/app/lib/employerOnboarding";

export function useEmployerAuth() {
  const { loading, refresh, employer } = useAppAuth();

  useEffect(() => {
    const userId = getEmployerUserId(employer.user);
    setEmployerOnboardingSyncUserId(userId);
    if (userId) {
      void hydrateEmployerOnboardingFromDb(userId);
    }
  }, [employer.user]);

  async function signOut() {
    await signOutEmployer();
    setEmployerOnboardingSyncUserId(null);
    await refresh();
  }

  return {
    user: employer.user,
    loading,
    authenticated: employer.authenticated,
    refresh,
    signOut,
  };
}
