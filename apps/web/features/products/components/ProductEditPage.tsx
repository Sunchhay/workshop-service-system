'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetProductQuery, useUpdateProductMutation } from '../api';
import type { UpdateProductRequest } from '../types';
import { ProductForm } from './ProductForm';

export function ProductEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetProductQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (payload: UpdateProductRequest) => {
    try {
      await updateProduct({ id, data: payload }).unwrap();
      toast.success(t('products.updateSuccess'));
      router.replace(`/admin/products/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  const product = data?.data;

  const defaultValues = product
    ? {
        name: product.name,
        brand: product.brand ?? '',
        componentPartType: product.componentPartType ?? '',
        size: product.size ?? '',
        supplier: product.supplier ?? '',
        category: product.category ?? '',
        unit: product.unit,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        stockQuantity: String(product.stockQuantity),
        reorderLevel: String(product.reorderLevel),
        linkedReferenceBookId: product.linkedReferenceBookId ?? '',
        description: product.description ?? '',
      }
    : undefined;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('products.editProduct')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('products.productDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <Skeleton className="h-11 w-full" />
              <div className="grid grid-cols-2 gap-5">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
            </div>
          ) : product ? (
            <ProductForm
              mode="edit"
              defaultValues={defaultValues}
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
