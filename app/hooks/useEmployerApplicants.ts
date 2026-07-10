"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { useEmployerJobs } from "./useEmployerJobs";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  ensureApplicants,
  getApplicantCount,
  getApplicants,
  getNewApplicantCount,
  type JobApplicant,
} from "@/app/lib/employerApplicants";
import { updateJobApplicantCount } from "@/app/lib/employerJobs";

export function useEmployerApplicants() {
  const { user, loading: authLoading } = useEmployerAuth();
  const { jobs } = useEmployerJobs();
  const userKey = getEmployerUserKey(user);
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setApplicants([]);
      setReady(!authLoading);
      return;
    }
    const list = ensureApplicants(userKey, jobs);
    setApplicants(list);

    jobs.forEach((job) => {
      const count = list.filter(
        (a) => a.jobId === job.id && a.status !== "rejected",
      ).length;
      if (job.applicants !== count) {
        updateJobApplicantCount(userKey, job.id, count);
      }
    });

    setReady(true);
  }, [authLoading, jobs, userKey]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-employer-applicants", onChange);
    window.addEventListener("myhiredito-employer-jobs", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-applicants", onChange);
      window.removeEventListener("myhiredito-employer-jobs", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    applicants,
    totalCount: userKey ? getApplicantCount(userKey) : 0,
    newCount: userKey ? getNewApplicantCount(userKey) : 0,
    loading: authLoading || !ready,
    refresh,
  };
}
