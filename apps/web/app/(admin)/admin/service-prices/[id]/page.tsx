import { ServicePriceDetailPage } from '@/features/service-prices/components/ServicePriceDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServicePriceDetailPage id={id} />;
}
