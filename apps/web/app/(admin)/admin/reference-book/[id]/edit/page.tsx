import { ReferenceBookEditPage } from '@/features/reference-book/components/ReferenceBookEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReferenceBookEditPage id={id} />;
}
