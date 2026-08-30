import { WorkerAccountShell } from "@/app/components/worker/WorkerAccountShell";
import { WorkerShiftTracker } from "@/app/components/worker/WorkerShiftTracker";

export const metadata = {
  title: "Shift Tracker | MyHiredito",
  description: "Track your shifts, clock in, and view your schedule.",
};

export default function WorkerTrackerPage() {
  return (
    <WorkerAccountShell>
      <WorkerShiftTracker />
    </WorkerAccountShell>
  );
}
