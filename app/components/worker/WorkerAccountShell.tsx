"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { WorkerShell } from "./WorkerShell";

export function WorkerAccountShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, authenticated } = useWorkerAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/worker/login");
    }
  }, [authenticated, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f0f0] text-sm text-zinc-500">
        Loading your account...
      </div>
    );
  }

  return <WorkerShell user={user}>{children}</WorkerShell>;
}
