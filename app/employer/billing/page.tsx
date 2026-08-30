import { Suspense } from "react";
import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerBillingView } from "../../components/employer/EmployerBillingView";

export const metadata = {
  title: "Billing | MyHiredito",
  description: "Manage billing and payment methods.",
};

export default function EmployerBillingPage() {
  return (
    <EmployerAccountShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
            Loading billing...
          </div>
        }
      >
        <EmployerBillingView />
      </Suspense>
    </EmployerAccountShell>
  );
}
