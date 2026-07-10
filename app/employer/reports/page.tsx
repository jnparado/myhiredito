import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerReportsView } from "../../components/employer/EmployerReportsView";

export const metadata = {
  title: "Reports | MyHiredito",
  description: "Hiring analytics and performance reports.",
};

export default function EmployerReportsPage() {
  return (
    <EmployerAccountShell>
      <EmployerReportsView />
    </EmployerAccountShell>
  );
}
