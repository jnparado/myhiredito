"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import {
  getEmployerJobsLocal,
  getEmployerUserKeyFromAuth,
  type EmployerJobPost,
} from "@/app/lib/employerJobs";

export function useEmployerJobs() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKeyFromAuth(user);
  const [jobs, setJobs] = useState<EmployerJobPost[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setJobs([]);
      setReady(!authLoading);
      return;
    }
    setJobs(getEmployerJobsLocal(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-employer-jobs", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-jobs", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const activeJobs = jobs.filter((j) => j.status === "active");

  return {
    user,
    userKey,
    jobs,
    activeJobs,
    activeCount: activeJobs.length,
    loading: authLoading || !ready,
    refresh,
  };
}
