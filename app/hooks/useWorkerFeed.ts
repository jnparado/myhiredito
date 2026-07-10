"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildWorkerFeed,
  type WorkerFeedItem,
} from "@/app/lib/workerFeed";
import { useWorkerActivity } from "./useWorkerActivity";

export function useWorkerFeed() {
  const { userKey, activity, loading: activityLoading } = useWorkerActivity();
  const [feed, setFeed] = useState<WorkerFeedItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setFeed(buildWorkerFeed(userKey, activity));
    setReady(true);
  }, [activity, userKey]);

  useEffect(() => {
    if (!activityLoading) refresh();
  }, [activityLoading, refresh]);

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
    feed,
    loading: activityLoading || !ready,
    refresh,
  };
}
