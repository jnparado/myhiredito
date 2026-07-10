"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getWorkerOnboardingState,
  isWorkerOnboardingComplete,
  type WorkerOnboardingState,
} from "@/app/lib/workerOnboarding";

export function useWorkerOnboarding() {
  const [state, setState] = useState<WorkerOnboardingState | null>(null);

  const refresh = useCallback(() => {
    setState(getWorkerOnboardingState());
  }, []);

  useEffect(() => {
    refresh();

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

  const complete = state ? isWorkerOnboardingComplete(state) : false;
  const completedCount = state?.completedSteps.length ?? 0;

  return {
    state,
    loading: state === null,
    isComplete: complete,
    completedCount,
    totalSteps: 3,
    needsAttention: state ? !complete : false,
    refresh,
  };
}
