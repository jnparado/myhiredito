"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmployerOnboardingAlert } from "./EmployerOnboardingAlert";
import { EmployerHomeRightRail } from "./EmployerHomeRightRail";
import { EmployerJobFeed } from "./EmployerJobFeed";
import {
  EmployerPostJobComposer,
  EmployerPostJobModal,
} from "./EmployerPostJobComposer";
import { EmployerProfileSidebar } from "./EmployerProfileSidebar";

export function EmployerHomeView() {
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("post") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-[1128px] px-3 py-4 sm:px-4 sm:py-6">
      <EmployerOnboardingAlert />

      <div className="grid gap-4 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        <div className="hidden lg:block">
          <EmployerProfileSidebar />
        </div>

        <main className="min-w-0 space-y-2">
          <EmployerPostJobComposer onOpenModal={() => setModalOpen(true)} />
          <EmployerJobFeed />
        </main>

        <div className="hidden lg:block">
          <EmployerHomeRightRail />
        </div>
      </div>

      <div className="mt-4 space-y-2 lg:hidden">
        <EmployerProfileSidebar />
        <EmployerHomeRightRail />
      </div>

      <EmployerPostJobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
