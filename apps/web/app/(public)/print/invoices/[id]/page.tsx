import { InvoicePreview } from '@/features/invoices/components/print/InvoicePreview';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoicePreview id={id} />;
}
