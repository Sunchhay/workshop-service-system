import { PriceCatalogDetailPage } from '@/features/price-catalog/components/PriceCatalogDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PriceCatalogDetailPage id={id} />;
}
