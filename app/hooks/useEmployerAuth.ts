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
import { applySignedOutRole } from "@/app/lib/authState";
import { setLastAuthRole } from "@/app/lib/authRole";

export function useEmployerAuth() {
  const { loading, refresh, employer } = useAppAuth();
  const userId = getEmployerUserId(employer.user);

  useEffect(() => {
    setEmployerOnboardingSyncUserId(userId);
    if (userId) {
      void hydrateEmployerOnboardingFromDb(userId);
    }
  }, [userId]);

  async function signOut() {
    setLastAuthRole("employer");
    applySignedOutRole("employer");
    setEmployerOnboardingSyncUserId(null);
    await signOutEmployer();
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
