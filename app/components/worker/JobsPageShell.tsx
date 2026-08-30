"use client";

import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { MarketingNav } from "../marketing/MarketingNav";
import { WorkerShell } from "./WorkerShell";

export function JobsPageShell({ children }: { children: React.ReactNode }) {
  const { loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50">
        <MarketingNav />
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Loading jobs...
        </div>
      </div>
    );
  }

  return <WorkerShell>{children}</WorkerShell>;
}
