import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerBillingView } from "../../components/employer/EmployerBillingView";

export const metadata = {
  title: "Billing | MyHiredito",
  description: "Manage billing and payment methods.",
};

export default function EmployerBillingPage() {
  return (
    <EmployerAccountShell>
      <EmployerBillingView />
    </EmployerAccountShell>
  );
}
