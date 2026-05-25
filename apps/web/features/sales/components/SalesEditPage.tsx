'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSaleQuery, useUpdateSaleMutation } from '../api';
import type { CreateSaleRequest, UpdateSaleRequest } from '../types';
import type { SalesFormValues } from './SalesForm';
import { SalesForm } from './SalesForm';

export function SalesEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetSaleQuery(id);
  const [updateSale, { isLoading: isSaving }] = useUpdateSaleMutation();

  const sale = data?.data;

  const defaultValues: Partial<SalesFormValues> | undefined = sale
    ? {
        customerId: sale.customerId ?? '',
        soldAt: sale.soldAt ? sale.soldAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        discountAmount: sale.discountAmount,
        notes: sale.notes ?? '',
        items: sale.items.map((item) => ({
          productId: item.productId,
          description: item.description ?? '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
        })),
      }
    : undefined;

  const handleSubmit = async (payload: CreateSaleRequest | UpdateSaleRequest) => {
    try {
      await updateSale({ id, data: payload as UpdateSaleRequest }).unwrap();
      toast.success(t('sales.updateSuccess'));
      router.replace(`/admin/sales/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('sales.editSale')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('sales.saleDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : sale ? (
            <SalesForm
              mode="edit"
              defaultValues={defaultValues}
              onSubmitComplete={handleSubmit}
              isLoading={isSaving}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
