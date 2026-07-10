"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  getEmployerActivity,
  type EmployerActivity,
} from "@/app/lib/employerActivity";

export function useEmployerActivity() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [activity, setActivity] = useState<EmployerActivity[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setActivity([]);
      setReady(!authLoading);
      return;
    }
    setActivity(getEmployerActivity(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-employer-activity", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-activity", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    activity,
    loading: authLoading || !ready,
    refresh,
  };
}
