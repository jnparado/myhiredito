"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import {
  getJobApplications,
  type JobApplication,
} from "@/app/lib/jobApplications";

export function useJobApplications() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setApplications([]);
      setReady(!authLoading);
      return;
    }
    setApplications(getJobApplications(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-job-applications", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-job-applications", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    applications,
    loading: authLoading || !ready,
    refresh,
  };
}
