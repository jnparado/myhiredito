import { WorkerAccountShell } from "@/app/components/worker/WorkerAccountShell";
import { WorkerApplicationsView } from "@/app/components/worker/WorkerApplicationsView";

export const metadata = {
  title: "Applications | MyHiredito",
  description: "Track your job applications on MyHiredito.",
};

export default function WorkerApplicationsPage() {
  return (
    <WorkerAccountShell>
      <WorkerApplicationsView />
    </WorkerAccountShell>
  );
}
