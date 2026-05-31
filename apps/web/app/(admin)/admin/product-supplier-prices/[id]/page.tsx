import { ProductSupplierPriceDetailPage } from '@/features/product-supplier-prices/components/ProductSupplierPriceDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductSupplierPriceDetailPage id={id} />;
}
