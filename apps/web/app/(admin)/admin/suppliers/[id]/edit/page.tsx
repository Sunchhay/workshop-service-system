import { SupplierEditPage } from '@/features/suppliers/components/SupplierEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SupplierEditPage id={id} />;
}
