import { EmployerAccountShell } from "../../../components/employer/EmployerAccountShell";
import { EmployerMessageThread } from "../../../components/employer/EmployerMessageThread";

export function generateStaticParams() {
  return [
    { id: "conv-alex-rivera" },
    { id: "conv-maria-santos" },
    { id: "conv-employer-support" },
  ];
}

export default async function EmployerMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <EmployerAccountShell>
      <EmployerMessageThread conversationId={id} />
    </EmployerAccountShell>
  );
}
