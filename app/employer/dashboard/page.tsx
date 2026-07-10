import { Suspense } from "react";
import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerHomeView } from "../../components/employer/EmployerHomeView";

export const metadata = {
  title: "Employer Home | MyHiredito",
  description: "Post jobs, review applicants, and manage hiring on MyHiredito.",
};

export default function EmployerDashboardPage() {
  return (
    <EmployerAccountShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
            Loading your employer home...
          </div>
        }
      >
        <EmployerHomeView />
      </Suspense>
    </EmployerAccountShell>
  );
}
