import { InvoiceEditPage } from '@/features/invoices/components/InvoiceEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoiceEditPage id={id} />;
}
