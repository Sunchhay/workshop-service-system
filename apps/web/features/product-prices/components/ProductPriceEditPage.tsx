'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetProductPriceQuery, useUpdateProductPriceMutation } from '../api';
import type { CreateProductPriceRequest, UpdateProductPriceRequest } from '../types';
import { ProductPriceForm } from './ProductPriceForm';

interface ProductPriceEditPageProps {
  id: string;
}

export function ProductPriceEditPage({ id }: ProductPriceEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetProductPriceQuery(id);
  const [updateProductPrice, { isLoading: isUpdating }] =
    useUpdateProductPriceMutation();

  const handleSubmit = async (
    payload: CreateProductPriceRequest | UpdateProductPriceRequest,
  ) => {
    try {
      await updateProductPrice({ id, data: payload as UpdateProductPriceRequest }).unwrap();
      toast.success(t('productPrices.updateSuccess'));
      router.replace(`/admin/product-prices/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  const entry = data?.data;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('productPrices.editEntry')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('productPrices.entryDetail')}</CardTitle>
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
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : entry ? (
            <ProductPriceForm
              mode="edit"
              defaultValues={{
                productId: entry.productId,
                machineModelId: entry.machineModelId,
                imageUrl: entry.imageUrl ?? '',
                ownerPrice:
                  entry.ownerPrice != null
                    ? String(parseFloat(String(entry.ownerPrice)))
                    : '',
                mechanicPrice:
                  entry.mechanicPrice != null
                    ? String(parseFloat(String(entry.mechanicPrice)))
                    : '',
                note: entry.note ?? '',
                status: entry.status,
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
