'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateProductPriceMutation } from '../api';
import type { CreateProductPriceRequest, UpdateProductPriceRequest } from '../types';
import { ProductPriceForm } from './ProductPriceForm';

export function ProductPriceCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createProductPrice, { isLoading }] = useCreateProductPriceMutation();

  const handleSubmit = async (
    data: CreateProductPriceRequest | UpdateProductPriceRequest,
  ) => {
    try {
      await createProductPrice(data as CreateProductPriceRequest).unwrap();
      toast.success(t('productPrices.createSuccess'));
      router.replace('/admin/product-prices');
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
        <h2 className="text-xl font-semibold">{t('productPrices.createEntry')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('productPrices.entryDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPriceForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
