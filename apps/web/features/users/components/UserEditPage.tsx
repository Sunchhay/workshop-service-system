'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetUserQuery, useUpdateUserMutation } from '../api';
import type { CreateUserRequest, UpdateUserRequest } from '../types';
import { UserForm } from './UserForm';

interface UserEditPageProps {
  id: string;
}

export function UserEditPage({ id }: UserEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetUserQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleSubmit = async (payload: CreateUserRequest | UpdateUserRequest) => {
    try {
      await updateUser({ id, data: payload as UpdateUserRequest }).unwrap();
      toast.success(t('users.updateSuccess'));
      router.replace(`/admin/users/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('users.editUser')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('users.userDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          ) : data?.data ? (
            <UserForm
              mode="edit"
              defaultValues={{
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
              }}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
