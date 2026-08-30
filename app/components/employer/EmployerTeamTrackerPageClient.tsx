"use client";

import { useSearchParams } from "next/navigation";
import { EmployerTeamTracker } from "@/app/components/employer/EmployerTeamTracker";

export function EmployerTeamTrackerPageClient() {
  const searchParams = useSearchParams();
  return <EmployerTeamTracker focusWorkerId={searchParams.get("worker")} />;
}
