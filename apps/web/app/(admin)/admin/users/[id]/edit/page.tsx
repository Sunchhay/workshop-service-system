import { UserEditPage } from '@/features/users/components/UserEditPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserEditPage id={id} />;
}
