"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEmployerOnboardingState,
  isEmployerOnboardingComplete,
  type EmployerOnboardingState,
} from "@/app/lib/employerOnboarding";

export function useEmployerOnboarding() {
  const [state, setState] = useState<EmployerOnboardingState | null>(null);

  const refresh = useCallback(() => {
    setState(getEmployerOnboardingState());
  }, []);

  useEffect(() => {
    refresh();

    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-employer-onboarding", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-onboarding", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const complete = state ? isEmployerOnboardingComplete(state) : false;

  return {
    state,
    loading: state === null,
    isComplete: complete,
    completedCount: state?.completedSteps.length ?? 0,
    totalSteps: 3,
    needsAttention: state ? !complete : false,
    refresh,
  };
}
