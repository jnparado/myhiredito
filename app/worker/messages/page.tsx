import { WorkerAccountShell } from "../../components/worker/WorkerAccountShell";
import { MessagesInbox } from "../../components/worker/MessagesInbox";

export const metadata = {
  title: "Messages | MyHiredito",
  description: "Chat with employers and recruiters on MyHiredito.",
};

export default function WorkerMessagesPage() {
  return (
    <WorkerAccountShell>
      <MessagesInbox />
    </WorkerAccountShell>
  );
}
