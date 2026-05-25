import { SalesEditPage } from '@/features/sales/components/SalesEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SalesEditPage id={id} />;
}
