"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import {
  getDefaultOnboardingProgress,
  getEmployerUserKey,
  getOnboardingProgress,
  isOnboardingComplete,
  type OnboardingProgress,
} from "@/app/lib/employerOnboarding";

export function useEmployerOnboarding() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [progress, setProgress] = useState<OnboardingProgress>(
    getDefaultOnboardingProgress(),
  );
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || !userKey) {
      setProgress(getDefaultOnboardingProgress());
      setReady(!authLoading);
      return;
    }

    const next = await getOnboardingProgress(user, userKey);
    setProgress(next);
    setReady(true);
  }, [authLoading, user, userKey]);

  useEffect(() => {
    if (authLoading) return;
    setReady(false);
    void refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    function onChange() {
      void refresh();
    }

    window.addEventListener("myhiredito-employer-onboarding", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-onboarding", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const isComplete = ready && isOnboardingComplete(progress);

  return {
    user,
    userKey,
    progress,
    state: progress,
    loading: authLoading || !ready,
    isComplete,
    completedCount: progress.completedSteps.length,
    totalSteps: 3,
    needsAttention: ready && !isComplete,
    refresh,
  };
}
