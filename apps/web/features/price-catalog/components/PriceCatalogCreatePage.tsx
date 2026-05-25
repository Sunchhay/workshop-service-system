'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreatePriceCatalogMutation } from '../api';
import type { CreatePriceCatalogRequest, UpdatePriceCatalogRequest } from '../types';
import { PriceCatalogForm } from './PriceCatalogForm';

export function PriceCatalogCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createPriceCatalog, { isLoading }] = useCreatePriceCatalogMutation();

  const handleSubmit = async (data: CreatePriceCatalogRequest | UpdatePriceCatalogRequest) => {
    try {
      await createPriceCatalog(data as CreatePriceCatalogRequest).unwrap();
      toast.success(t('priceCatalog.createSuccess'));
      router.replace('/admin/price-catalog');
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
        <h2 className="text-xl font-semibold">{t('priceCatalog.createEntry')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('priceCatalog.entryDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceCatalogForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
