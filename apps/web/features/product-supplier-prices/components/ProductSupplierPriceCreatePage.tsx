'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateProductSupplierPriceMutation } from '../api';
import type {
  CreateProductSupplierPriceRequest,
  UpdateProductSupplierPriceRequest,
} from '../types';
import { ProductSupplierPriceForm } from './ProductSupplierPriceForm';

export function ProductSupplierPriceCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createEntry, { isLoading }] = useCreateProductSupplierPriceMutation();

  const handleSubmit = async (
    data: CreateProductSupplierPriceRequest | UpdateProductSupplierPriceRequest,
  ) => {
    try {
      const result = await createEntry(
        data as CreateProductSupplierPriceRequest,
      ).unwrap();
      toast.success(t('productSupplierPrices.createSuccess'));
      router.replace(`/admin/product-supplier-prices/${result.data.id}`);
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
        <h2 className="text-xl font-semibold">
          {t('productSupplierPrices.createEntry')}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('productSupplierPrices.entryDetail')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSupplierPriceForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
