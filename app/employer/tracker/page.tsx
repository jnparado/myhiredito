import { Suspense } from "react";
import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerTeamTrackerPageClient } from "../../components/employer/EmployerTeamTrackerPageClient";

export const metadata = {
  title: "Team Tracker | MyHiredito",
  description:
    "See your workers’ live clock-in status, tracked hours, and timesheets.",
};

export default function EmployerTrackerPage() {
  return (
    <EmployerAccountShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
            Loading team tracker...
          </div>
        }
      >
        <EmployerTeamTrackerPageClient />
      </Suspense>
    </EmployerAccountShell>
  );
}
