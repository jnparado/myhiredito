"use client";

import { useCallback, useEffect, useState } from "react";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import {
  getWorkerActivity,
  type WorkerActivity,
} from "@/app/lib/workerActivity";
import { useWorkerAuth } from "./useWorkerAuth";

export function useWorkerActivity() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [activity, setActivity] = useState<WorkerActivity[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setActivity([]);
      setReady(!authLoading);
      return;
    }
    setActivity(getWorkerActivity(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-worker-activity", onChange);
    window.addEventListener("myhiredito-employer-activity", onChange);
    window.addEventListener("myhiredito-published-jobs", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-worker-activity", onChange);
      window.removeEventListener("myhiredito-employer-activity", onChange);
      window.removeEventListener("myhiredito-published-jobs", onChange);
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
