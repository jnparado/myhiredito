import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import { MessageThread } from "../../../components/worker/MessageThread";

export function generateStaticParams() {
  return [
    { id: "conv-sunrise-care" },
    { id: "conv-metro-hospital" },
    { id: "conv-support" },
  ];
}

export default async function WorkerMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <WorkerAccountShell>
      <MessageThread conversationId={id} />
    </WorkerAccountShell>
  );
}
