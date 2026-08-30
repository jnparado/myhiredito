"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  getTeamTrackingSnapshots,
  type TeamWorkerTracking,
} from "@/app/lib/employerTeamTracking";
import {
  WORKER_SHIFTS_CHANNEL,
  WORKER_SHIFTS_EVENT,
} from "@/app/lib/workerShifts";

export function useEmployerTeamTracking() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [snapshots, setSnapshots] = useState<TeamWorkerTracking[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setSnapshots([]);
      setReady(!authLoading);
      return;
    }
    setSnapshots(getTeamTrackingSnapshots(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener(WORKER_SHIFTS_EVENT, onChange);
    window.addEventListener("myhiredito-employer-workers", onChange);
    window.addEventListener("myhiredito-employer-applicants", onChange);
    window.addEventListener("storage", onChange);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(WORKER_SHIFTS_CHANNEL);
      channel.onmessage = onChange;
    } catch {
      channel = null;
    }

    return () => {
      window.removeEventListener(WORKER_SHIFTS_EVENT, onChange);
      window.removeEventListener("myhiredito-employer-workers", onChange);
      window.removeEventListener("myhiredito-employer-applicants", onChange);
      window.removeEventListener("storage", onChange);
      channel?.close();
    };
  }, [refresh]);

  const liveCount = snapshots.filter((item) => item.activeShift).length;

  return {
    userKey,
    snapshots,
    liveCount,
    loading: authLoading || !ready,
    refresh,
  };
}
