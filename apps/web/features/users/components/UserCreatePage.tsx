'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateUserMutation } from '../api';
import type { CreateUserRequest, UpdateUserRequest } from '../types';
import { UserForm } from './UserForm';

export function UserCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      await createUser(data as CreateUserRequest).unwrap();
      toast.success(t('users.createSuccess'));
      router.replace('/admin/users');
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
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('users.createUser')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('users.userDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
