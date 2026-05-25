import { PaymentDetailPage } from '@/features/payments/components/PaymentDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaymentDetailPage id={id} />;
}
