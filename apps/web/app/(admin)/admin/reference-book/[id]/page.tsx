import { ReferenceBookDetailPage } from '@/features/reference-book/components/ReferenceBookDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReferenceBookDetailPage id={id} />;
}
