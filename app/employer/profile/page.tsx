import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerProfileView } from "../../components/employer/EmployerProfileView";

export const metadata = {
  title: "Company Profile | MyHiredito",
  description: "Manage your company profile and verification.",
};

export default function EmployerProfilePage() {
  return (
    <EmployerAccountShell>
      <EmployerProfileView />
    </EmployerAccountShell>
  );
}
