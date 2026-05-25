import { CustomerEditPage } from '@/features/customers/components/CustomerEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerEditPage id={id} />;
}
