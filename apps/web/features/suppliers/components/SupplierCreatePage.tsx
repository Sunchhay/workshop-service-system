'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateSupplierMutation } from '../api';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types';
import { SupplierForm } from './SupplierForm';

export function SupplierCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createSupplier, { isLoading }] = useCreateSupplierMutation();

  const handleSubmit = async (data: CreateSupplierRequest | UpdateSupplierRequest) => {
    try {
      await createSupplier(data as CreateSupplierRequest).unwrap();
      toast.success(t('suppliers.createSuccess'));
      router.replace('/admin/suppliers');
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
        <h2 className="text-xl font-semibold">{t('suppliers.createSupplier')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('suppliers.supplierDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
