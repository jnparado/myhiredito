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

  const refresh = useCallback(() => {
    if (!userKey) {
      setProgress(getDefaultOnboardingProgress());
      setReady(!authLoading);
      return;
    }

    setProgress(getOnboardingProgress(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-worker-onboarding", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-worker-onboarding", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    progress,
    loading: authLoading || !ready,
    refresh,
  };
}
