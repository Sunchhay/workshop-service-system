import { ProductPriceEditPage } from '@/features/product-prices/components/ProductPriceEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPriceEditPage id={id} />;
}
