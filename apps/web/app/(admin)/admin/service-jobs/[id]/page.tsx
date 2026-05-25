import { ServiceJobDetailPage } from '@/features/service-jobs/components/ServiceJobDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceJobDetailPage id={id} />;
}
