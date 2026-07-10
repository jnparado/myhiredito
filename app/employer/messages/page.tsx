import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerMessagesInbox } from "../../components/employer/EmployerMessagesInbox";

export const metadata = {
  title: "Messages | MyHiredito",
  description: "Chat with applicants and workers on MyHiredito.",
};

export default function EmployerMessagesPage() {
  return (
    <EmployerAccountShell>
      <EmployerMessagesInbox />
    </EmployerAccountShell>
  );
}
