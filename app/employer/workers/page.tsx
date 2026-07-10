import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerWorkersView } from "../../components/employer/EmployerWorkersView";

export const metadata = {
  title: "Workers | MyHiredito",
  description: "Manage your worker roster and invitations.",
};

export default function EmployerWorkersPage() {
  return (
    <EmployerAccountShell>
      <EmployerWorkersView />
    </EmployerAccountShell>
  );
}
