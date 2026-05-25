import { ExpenseEditPage } from '@/features/expenses/components/ExpenseEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExpenseEditPage id={id} />;
}
