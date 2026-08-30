import { WorkerAccountShell } from "@/app/components/worker/WorkerAccountShell";
import { WorkerShiftTracker } from "@/app/components/worker/WorkerShiftTracker";

export const metadata = {
  title: "Time Tracker | MyHiredito",
  description: "Track your work hours with GPS-verified clock in/out, live timer, and timesheet.",
};

export default function WorkerTrackerPage() {
  return (
    <WorkerAccountShell>
      <WorkerShiftTracker />
    </WorkerAccountShell>
  );
}
