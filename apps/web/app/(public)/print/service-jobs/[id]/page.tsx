import { ServiceWorkSheetPreview } from '@/features/service-jobs/components/print/ServiceWorkSheetPreview';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceWorkSheetPreview id={id} />;
}
