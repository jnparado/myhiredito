"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { EmployerShell } from "./EmployerShell";

export function EmployerAccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, authenticated } = useEmployerAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/employer/login");
    }
  }, [authenticated, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f0f0] text-sm text-zinc-500">
        Loading your employer account...
      </div>
    );
  }

  return <EmployerShell user={user}>{children}</EmployerShell>;
}
