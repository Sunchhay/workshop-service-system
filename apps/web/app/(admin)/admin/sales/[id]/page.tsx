import { SalesDetailPage } from '@/features/sales/components/SalesDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SalesDetailPage id={id} />;
}
