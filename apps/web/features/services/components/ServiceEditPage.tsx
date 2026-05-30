'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetServiceQuery, useUpdateServiceMutation } from '../api';
import type { CreateServiceRequest, UpdateServiceRequest } from '../types';
import { ServiceForm } from './ServiceForm';

interface ServiceEditPageProps {
  id: string;
}

export function ServiceEditPage({ id }: ServiceEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetServiceQuery(id);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const handleSubmit = async (
    payload: CreateServiceRequest | UpdateServiceRequest,
  ) => {
    try {
      await updateService({ id, data: payload as UpdateServiceRequest }).unwrap();
      toast.success(t('services.updateSuccess'));
      router.replace(`/admin/services/${id}`);
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
        <h2 className="text-xl font-semibold">{t('services.editService')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('services.serviceDetail')}
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : data?.data ? (
            <ServiceForm
              mode="edit"
              defaultValues={{
                code: data.data.code,
                nameEn: data.data.nameEn,
                nameKh: data.data.nameKh ?? '',
                imageUrl: data.data.imageUrl ?? '',
                category: data.data.category ?? '',
                relatedComponent: data.data.relatedComponent ?? '',
                description: data.data.description ?? '',
                isActive: data.data.isActive,
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
