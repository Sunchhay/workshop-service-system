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

import { useGetSupplierQuery, useUpdateSupplierStatusMutation } from '../api';
import type { Supplier } from '../types';
import { DisableSupplierDialog } from './dialogs/DisableSupplierDialog';

interface SupplierDetailPageProps {
  id: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function SupplierDetailPage({ id }: SupplierDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetSupplierQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdateSupplierStatusMutation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const supplier = data?.data;

  const handleStatusConfirm = async () => {
    if (!supplier) return;
    try {
      const isActive = supplier.status === 'ACTIVE';
      await updateStatus({
        id,
        data: { status: isActive ? 'INACTIVE' : 'ACTIVE' },
      }).unwrap();
      toast.success(
        isActive ? t('suppliers.disabledSuccess') : t('suppliers.enabledSuccess'),
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
        <h2 className="text-xl font-semibold">{t('suppliers.supplierDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : supplier ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {supplier.imageUrl ? (
                    <img
                      src={supplier.imageUrl}
                      alt={supplier.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <CardTitle>{supplier.name}</CardTitle>
                    {supplier.phone && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {supplier.phone}
                      </p>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/suppliers/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('suppliers.statusLabel')}
                  </p>
                  <Badge
                    variant={supplier.status === 'ACTIVE' ? 'default' : 'outline'}
                    className={
                      supplier.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(supplier.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('suppliers.createdAt')}
                  </p>
                  <p>{formatDate(supplier.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('suppliers.updatedAt')}
                  </p>
                  <p>{formatDate(supplier.updatedAt)}</p>
                </div>
                {supplier.note && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('suppliers.note')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {supplier.note}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className={
                  supplier.status === 'ACTIVE'
                    ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                    : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                }
              >
                {supplier.status === 'ACTIVE'
                  ? t('suppliers.confirmDisableTitle')
                  : t('suppliers.confirmEnableTitle')}
              </Button>
            </CardContent>
          </Card>

          <DisableSupplierDialog
            supplier={supplier as Supplier}
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
