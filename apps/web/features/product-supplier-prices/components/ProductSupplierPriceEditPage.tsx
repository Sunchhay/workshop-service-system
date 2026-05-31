'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useGetProductSupplierPriceQuery,
  useUpdateProductSupplierPriceMutation,
} from '../api';
import type {
  CreateProductSupplierPriceRequest,
  UpdateProductSupplierPriceRequest,
} from '../types';
import { ProductSupplierPriceForm } from './ProductSupplierPriceForm';

export function ProductSupplierPriceEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetProductSupplierPriceQuery(id);
  const [updateEntry, { isLoading: isUpdating }] = useUpdateProductSupplierPriceMutation();

  const entry = data?.data;

  const handleSubmit = async (
    payload: CreateProductSupplierPriceRequest | UpdateProductSupplierPriceRequest,
  ) => {
    try {
      await updateEntry({ id, data: payload as UpdateProductSupplierPriceRequest }).unwrap();
      toast.success(t('productSupplierPrices.updateSuccess'));
      router.replace(`/admin/product-supplier-prices/${id}`);
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
        <h2 className="text-xl font-semibold">{t('productSupplierPrices.editEntry')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('productSupplierPrices.entryDetail')}
          </CardTitle>
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
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : entry ? (
            <ProductSupplierPriceForm
              mode="edit"
              defaultValues={{
                productId: entry.productId,
                supplierId: entry.supplierId,
                buyingPrice: String(parseFloat(String(entry.buyingPrice))),
                currency: entry.currency || 'USD',
                lastUpdatedAt: entry.lastUpdatedAt?.slice(0, 10) ?? '',
                note: entry.note ?? '',
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
