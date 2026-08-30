import { JobsBrowser } from "./JobsBrowser";
import { FindWorkHeader } from "./FindWorkHeader";
import { JobsPageShell } from "../../components/worker/JobsPageShell";

export const metadata = {
  title: "Browse Jobs | MyHiredito",
  description: "Find on-demand and ongoing work opportunities near you.",
};

export default function JobsPage() {
  return (
    <JobsPageShell>
      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
        <FindWorkHeader />
        <JobsBrowser />
      </div>
    </JobsPageShell>
  );
}
