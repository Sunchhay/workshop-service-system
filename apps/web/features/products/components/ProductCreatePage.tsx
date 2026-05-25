'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateProductMutation } from '../api';
import type { CreateProductRequest, UpdateProductRequest } from '../types';
import { ProductForm } from './ProductForm';

export function ProductCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (payload: CreateProductRequest | UpdateProductRequest) => {
    try {
      const result = await createProduct(payload as CreateProductRequest).unwrap();
      toast.success(t('products.createSuccess'));
      router.replace(`/admin/products/${result.data.id}`);
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
        <h2 className="text-xl font-semibold">{t('products.createProduct')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('products.productDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
