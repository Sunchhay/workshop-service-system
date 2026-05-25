import { MachineModelDetailPage } from '@/features/machine-models/components/MachineModelDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MachineModelDetailPage id={id} />;
}
