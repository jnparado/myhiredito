import { WorkerAccountShell } from "../../components/worker/WorkerAccountShell";
import { ConnectView } from "../../components/worker/ConnectView";

export const metadata = {
  title: "Your Circle | MyHiredito",
  description: "Discover workers and employers on MyHiredito.",
};

export default function WorkerConnectPage() {
  return (
    <WorkerAccountShell>
      <ConnectView />
    </WorkerAccountShell>
  );
}
