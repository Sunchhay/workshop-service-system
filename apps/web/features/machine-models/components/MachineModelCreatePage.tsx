'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateMachineModelMutation } from '../api';
import type { CreateMachineModelRequest, UpdateMachineModelRequest } from '../types';
import { MachineModelForm } from './MachineModelForm';

export function MachineModelCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createMachineModel, { isLoading }] = useCreateMachineModelMutation();

  const handleSubmit = async (
    data: CreateMachineModelRequest | UpdateMachineModelRequest,
  ) => {
    try {
      await createMachineModel(data as CreateMachineModelRequest).unwrap();
      toast.success(t('machineModels.createSuccess'));
      router.replace('/admin/machine-models');
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
        <h2 className="text-xl font-semibold">{t('machineModels.createModel')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('machineModels.modelDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MachineModelForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
