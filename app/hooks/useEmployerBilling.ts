"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  getBillingState,
  type BillingState,
} from "@/app/lib/employerBilling";

export function useEmployerBilling() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setBilling(null);
      setReady(!authLoading);
      return;
    }
    setBilling(getBillingState(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }
    window.addEventListener("myhiredito-employer-billing", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-billing", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    billing,
    loading: authLoading || !ready,
    refresh,
  };
}
