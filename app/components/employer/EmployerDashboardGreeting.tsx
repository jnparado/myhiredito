"use client";

import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
} from "@/app/lib/employerAuth";

export function EmployerDashboardGreeting() {
  const { user, loading } = useEmployerAuth();

  if (loading) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-zinc-800 sm:text-4xl">
          Welcome back,
        </h1>
        <p className="mt-1 text-base text-zinc-500">
          Manage hiring and staffing from your employer dashboard
        </p>
      </div>
    );
  }

  const name = user ? getEmployerDisplayName(user).split(" ")[0] : "there";
  const company = user ? getEmployerCompanyName(user) : "your business";

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-normal text-zinc-800 sm:text-4xl">
        Welcome back, {name}
      </h1>
      <p className="mt-1 text-base text-zinc-500">
        {company} — manage jobs, applicants, and verified workers
      </p>
    </div>
  );
}
