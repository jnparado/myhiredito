"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { StripeBankDetails } from "@/app/lib/stripe/bank";

export function useStripeBankReturn(
  onConnected: (bank: StripeBankDetails) => void | Promise<void>,
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "cancel">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);
  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  useEffect(() => {
    const stripe = searchParams.get("stripe");
    const sessionId = searchParams.get("session_id");

    if (stripe === "cancel") {
      setStatus("cancel");
      return;
    }

    if (stripe !== "success" || !sessionId || handled.current) return;
    handled.current = true;
    setStatus("saving");

    void (async () => {
      try {
        const response = await fetch(
          `/api/stripe/bank-setup?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await response.json()) as {
          bank?: StripeBankDetails;
          error?: string;
        };
        if (!response.ok || !data.bank) {
          throw new Error(data.error || "Could not save the connected bank.");
        }
        await onConnectedRef.current(data.bank);
        router.replace(pathname);
        setStatus("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save bank.");
        setStatus("error");
      }
    })();
  }, [pathname, router, searchParams]);

  return { status, error };
}
