import { ProductSupplierPriceEditPage } from '@/features/product-supplier-prices/components/ProductSupplierPriceEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductSupplierPriceEditPage id={id} />;
}
