'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetServiceJobQuery, useUpdateServiceJobMutation } from '../api';
import type { CreateServiceJobRequest, UpdateServiceJobRequest } from '../types';
import { ServiceJobForm, type ServiceJobFormValues } from './ServiceJobForm';

export function ServiceJobEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetServiceJobQuery(id);
  const [updateServiceJob, { isLoading: isUpdating }] = useUpdateServiceJobMutation();

  const handleSubmit = async (payload: CreateServiceJobRequest | UpdateServiceJobRequest) => {
    try {
      await updateServiceJob({ id, data: payload as UpdateServiceJobRequest }).unwrap();
      toast.success(t('serviceJobs.updateSuccess'));
      router.replace(`/admin/service-jobs/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const job = data?.data;

  const defaultValues: Partial<ServiceJobFormValues> = job
    ? {
        customerId: job.customerId,
        machineModelId: job.machineModelId ?? '__none',
        partDescription: job.partDescription,
        status: job.status,
        priority: job.priority,
        estimatedCompletionDate: job.estimatedCompletionDate
          ? job.estimatedCompletionDate.slice(0, 10)
          : '',
        notes: job.notes ?? '',
        technicianNotes: job.technicianNotes ?? '',
        assignedToId: job.assignedToId ?? '__none',
        items: job.items.map((item) => ({
          type: item.type,
          serviceId: item.serviceId ?? '',
          priceCatalogId: item.priceCatalogId ?? '',
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          measurement: item.measurement ?? '',
          notes: item.notes ?? '',
        })),
      }
    : {};

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('serviceJobs.editJob')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('serviceJobs.jobDetail')}</CardTitle>
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
              <Skeleton className="h-20 w-full" />
            </div>
          ) : job ? (
            <ServiceJobForm
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
