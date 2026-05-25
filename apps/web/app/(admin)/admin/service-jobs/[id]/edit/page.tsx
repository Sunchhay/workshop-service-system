import { ServiceJobEditPage } from '@/features/service-jobs/components/ServiceJobEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceJobEditPage id={id} />;
}
