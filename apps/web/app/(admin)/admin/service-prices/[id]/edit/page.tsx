import { ServicePriceEditPage } from '@/features/service-prices/components/ServicePriceEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServicePriceEditPage id={id} />;
}
