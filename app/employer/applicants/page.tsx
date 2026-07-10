import { Suspense } from "react";
import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerApplicantsView } from "../../components/employer/EmployerApplicantsView";

export const metadata = {
  title: "Applicants | MyHiredito",
  description: "Review and manage job applicants.",
};

export default function EmployerApplicantsPage() {
  return (
    <EmployerAccountShell>
      <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading...</div>}>
        <EmployerApplicantsView />
      </Suspense>
    </EmployerAccountShell>
  );
}
