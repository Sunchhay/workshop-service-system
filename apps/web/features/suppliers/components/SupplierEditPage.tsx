'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSupplierQuery, useUpdateSupplierMutation } from '../api';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types';
import { SupplierForm } from './SupplierForm';

interface SupplierEditPageProps {
  id: string;
}

export function SupplierEditPage({ id }: SupplierEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetSupplierQuery(id);
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const handleSubmit = async (payload: CreateSupplierRequest | UpdateSupplierRequest) => {
    try {
      await updateSupplier({ id, data: payload as UpdateSupplierRequest }).unwrap();
      toast.success(t('suppliers.updateSuccess'));
      router.replace(`/admin/suppliers/${id}`);
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
        <h2 className="text-xl font-semibold">{t('suppliers.editSupplier')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('suppliers.supplierDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : data?.data ? (
            <SupplierForm
              mode="edit"
              defaultValues={{
                name: data.data.name,
                phone: data.data.phone ?? '',
                imageUrl: data.data.imageUrl ?? '',
                note: data.data.note ?? '',
                status: data.data.status,
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
