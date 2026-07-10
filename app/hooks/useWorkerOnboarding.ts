"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import {
  getDefaultOnboardingProgress,
  getOnboardingProgress,
  getWorkerUserKey,
  type OnboardingProgress,
} from "@/app/lib/workerOnboarding";

export function useWorkerOnboarding() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [progress, setProgress] = useState<OnboardingProgress>(
    getDefaultOnboardingProgress(),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user || !userKey) {
      setProgress(getDefaultOnboardingProgress());
      setReady(!authLoading);
      return;
    }

    try {
      setError(null);
      const next = await getOnboardingProgress(user, userKey);
      setProgress(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load onboarding.");
      setProgress(getDefaultOnboardingProgress());
    } finally {
      setReady(true);
    }
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

    window.addEventListener("myhiredito-worker-onboarding", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-worker-onboarding", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    user,
    userKey,
    progress,
    loading: authLoading || !ready,
    error,
    refresh,
  };
}
