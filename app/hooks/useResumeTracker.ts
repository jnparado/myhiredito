"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import {
  getResumeTracker,
  type ResumeTrackerRecord,
} from "@/app/lib/resumeTracker";

const EMPTY: ResumeTrackerRecord = {
  lastPostedAt: null,
  postCount: 0,
  lastPostType: null,
  lastPostPreview: null,
};

export function useResumeTracker() {
  const { user } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [tracker, setTracker] = useState<ResumeTrackerRecord>(EMPTY);

  const refresh = useCallback(() => {
    setTracker(userKey ? getResumeTracker(userKey) : EMPTY);
  }, [userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-resume-tracker", onChange);
    window.addEventListener("myhiredito-worker-activity", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-resume-tracker", onChange);
      window.removeEventListener("myhiredito-worker-activity", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return { userKey, tracker };
}
