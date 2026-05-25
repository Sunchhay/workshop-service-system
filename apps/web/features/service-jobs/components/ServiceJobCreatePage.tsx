'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateServiceJobMutation } from '../api';
import type { CreateServiceJobRequest, UpdateServiceJobRequest } from '../types';
import { ServiceJobForm } from './ServiceJobForm';

export function ServiceJobCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createServiceJob, { isLoading }] = useCreateServiceJobMutation();

  const handleSubmit = async (data: CreateServiceJobRequest | UpdateServiceJobRequest) => {
    try {
      const result = await createServiceJob(data as CreateServiceJobRequest).unwrap();
      toast.success(t('serviceJobs.createSuccess'));
      router.replace(`/admin/service-jobs/${result.data.id}`);
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
        <h2 className="text-xl font-semibold">{t('serviceJobs.createJob')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('serviceJobs.jobDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceJobForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
