import { JobsPageShell } from "@/app/components/worker/JobsPageShell";
import { WorkerApplicationsView } from "@/app/components/worker/WorkerApplicationsView";

export const metadata = {
  title: "Applications | MyHiredito",
  description: "Track your job applications on MyHiredito.",
};

export default function WorkerApplicationsPage() {
  return (
    <JobsPageShell loadingLabel="Loading applications...">
      <WorkerApplicationsView />
    </JobsPageShell>
  );
}
