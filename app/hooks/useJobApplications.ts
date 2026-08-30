"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import { WORKER_DEMO_EMAIL } from "@/app/lib/workerDemoAuth";
import { getWorkerDisplayName, getWorkerEmail } from "@/app/lib/workerAuth";
import {
  ensureDemoWorkerApplications,
  getApplicationLookupKeys,
  getJobApplicationsForKeys,
  type JobApplication,
} from "@/app/lib/jobApplications";

export function useJobApplications() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!user || !userKey) {
      setApplications([]);
      setReady(!authLoading);
      return;
    }
    const keys = getApplicationLookupKeys(user, userKey);
    const isDemoWorker =
      getWorkerEmail(user).toLowerCase() === WORKER_DEMO_EMAIL ||
      getWorkerDisplayName(user).toLowerCase() === "alex rivera";
    if (isDemoWorker) {
      ensureDemoWorkerApplications(userKey);
      if (userKey !== WORKER_DEMO_EMAIL) {
        ensureDemoWorkerApplications(WORKER_DEMO_EMAIL);
      }
    }
    setApplications(getJobApplicationsForKeys(keys));
    setReady(true);
  }, [authLoading, user, userKey]);

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
