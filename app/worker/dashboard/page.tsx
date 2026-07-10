import { WorkerAccountShell } from "../../components/worker/WorkerAccountShell";
import { WorkerDashboardView } from "../../components/worker/WorkerDashboardView";

export const metadata = {
  title: "Worker Dashboard | MyHiredito",
  description: "Your worker dashboard on MyHiredito.",
};

export default function WorkerDashboardPage() {
  return (
    <WorkerAccountShell>
      <WorkerDashboardView />
    </WorkerAccountShell>
  );
}
