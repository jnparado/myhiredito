"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  getEmployerWorkers,
  type EmployerWorker,
} from "@/app/lib/employerWorkers";

export function useEmployerWorkers() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [workers, setWorkers] = useState<EmployerWorker[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setWorkers([]);
      setReady(!authLoading);
      return;
    }
    setWorkers(getEmployerWorkers(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-employer-workers", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-workers", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    workers,
    loading: authLoading || !ready,
    refresh,
  };
}
