import { ProductEditPage } from '@/features/products/components/ProductEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditPage id={id} />;
}
