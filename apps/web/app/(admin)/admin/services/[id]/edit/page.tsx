import { ServiceEditPage } from '@/features/services/components/ServiceEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceEditPage id={id} />;
}
