'use client';

import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetUserQuery, useUpdateUserStatusMutation } from '../api';
import type { User, UserRole } from '../types';
import { DisableUserDialog } from './dialogs/DisableUserDialog';

interface UserDetailPageProps {
  id: string;
}

const roleClass: Record<UserRole, string> = {
  ADMIN: '',
  STAFF: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  TECHNICIAN:
    'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
  CASHIER:
    'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetUserQuery(id);
  const [updateUserStatus, { isLoading: isToggling }] =
    useUpdateUserStatusMutation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const user = data?.data;

  const handleStatusConfirm = async () => {
    if (!user) return;
    try {
      await updateUserStatus({
        id: user.id,
        isActive: !user.isActive,
      }).unwrap();
      toast.success(
        user.isActive ? t('users.disabledSuccess') : t('users.enabledSuccess'),
      );
      setDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('users.userDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
      ) : user ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('users.role')}
                  </p>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'outline'}
                    className={roleClass[user.role]}
                  >
                    {t(`roles.${user.role}`)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('users.statusLabel')}
                  </p>
                  <Badge
                    variant={user.isActive ? 'default' : 'outline'}
                    className={
                      user.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(user.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('users.createdAt')}
                  </p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('users.updatedAt')}
                  </p>
                  <p>{formatDate(user.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <Button
                variant={user.isActive ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setDialogOpen(true)}
                className={
                  !user.isActive
                    ? 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                    : ''
                }
              >
                {user.isActive
                  ? t('users.confirmDisableTitle')
                  : t('users.confirmEnableTitle')}
              </Button>
            </CardContent>
          </Card>

          <DisableUserDialog
            user={user as User}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
