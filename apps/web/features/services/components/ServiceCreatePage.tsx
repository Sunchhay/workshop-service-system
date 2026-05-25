'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateServiceMutation } from '../api';
import type { CreateServiceRequest, UpdateServiceRequest } from '../types';
import { ServiceForm } from './ServiceForm';

export function ServiceCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createService, { isLoading }] = useCreateServiceMutation();

  const handleSubmit = async (
    data: CreateServiceRequest | UpdateServiceRequest,
  ) => {
    try {
      await createService(data as CreateServiceRequest).unwrap();
      toast.success(t('services.createSuccess'));
      router.replace('/admin/services');
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
        <h2 className="text-xl font-semibold">{t('services.createService')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('services.serviceDetail')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
