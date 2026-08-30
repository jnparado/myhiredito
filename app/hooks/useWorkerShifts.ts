"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import {
  ensureWorkerShifts,
  localDateStamp,
  type WorkerShift,
} from "@/app/lib/workerShifts";

export function useWorkerShifts() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [shifts, setShifts] = useState<WorkerShift[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setShifts([]);
      setReady(!authLoading);
      return;
    }
    setShifts(ensureWorkerShifts(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-worker-shifts", onChange);
    window.addEventListener("storage", onChange);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("myhiredito-worker-shifts");
      channel.onmessage = onChange;
    } catch {
      channel = null;
    }

    return () => {
      window.removeEventListener("myhiredito-worker-shifts", onChange);
      window.removeEventListener("storage", onChange);
      channel?.close();
    };
  }, [refresh]);

  const activeShift =
    shifts.find((shift) => shift.status === "clocked-in") ?? null;
  const today = localDateStamp();
  const nextShift =
    shifts.find(
      (shift) =>
        ["scheduled", "confirmed", "en-route"].includes(shift.status) &&
        shift.shiftDate >= today,
    ) ?? null;

  return {
    userKey,
    shifts,
    activeShift,
    nextShift,
    loading: authLoading || !ready,
    refresh,
  };
}
