"use client";

import { OnboardingAlert } from "./OnboardingAlert";
import { WorkerHomeComposer } from "./WorkerHomeComposer";
import { WorkerHomeRightRail } from "./WorkerHomeRightRail";
import { WorkerJobFeed } from "./WorkerJobFeed";
import { WorkerProfileSidebar } from "./WorkerProfileSidebar";

export function WorkerDashboardView() {
  return (
    <div className="mx-auto max-w-[1128px] px-3 py-4 sm:px-4 sm:py-6">
      <OnboardingAlert />

      <div className="grid gap-4 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        <div className="hidden lg:block">
          <WorkerProfileSidebar />
        </div>

        <main className="min-w-0 space-y-2">
          <WorkerHomeComposer />
          <WorkerJobFeed />
        </main>

        <div className="hidden lg:block">
          <WorkerHomeRightRail />
        </div>
      </div>

      <div className="mt-4 space-y-2 lg:hidden">
        <WorkerProfileSidebar />
        <WorkerHomeRightRail />
      </div>
    </div>
  );
}
