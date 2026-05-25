'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateSaleMutation } from '../api';
import type { CreateSaleRequest, UpdateSaleRequest } from '../types';
import { SalesForm } from './SalesForm';

export function SalesCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createSale, { isLoading }] = useCreateSaleMutation();

  const handleSubmit = async (payload: CreateSaleRequest | UpdateSaleRequest) => {
    try {
      const result = await createSale(payload as CreateSaleRequest).unwrap();
      toast.success(t('sales.createSuccess'));
      router.replace(`/admin/sales/${result.data.id}`);
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
        <h2 className="text-xl font-semibold">{t('sales.createSale')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('sales.saleDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesForm
            mode="create"
            onSubmitDraft={handleSubmit}
            onSubmitComplete={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
