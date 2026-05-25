'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetMachineModelQuery, useUpdateMachineModelMutation } from '../api';
import type { CreateMachineModelRequest, UpdateMachineModelRequest } from '../types';
import { MachineModelForm } from './MachineModelForm';

interface MachineModelEditPageProps {
  id: string;
}

export function MachineModelEditPage({ id }: MachineModelEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetMachineModelQuery(id);
  const [updateMachineModel, { isLoading: isUpdating }] = useUpdateMachineModelMutation();

  const handleSubmit = async (
    payload: CreateMachineModelRequest | UpdateMachineModelRequest,
  ) => {
    try {
      await updateMachineModel({
        id,
        data: payload as UpdateMachineModelRequest,
      }).unwrap();
      toast.success(t('machineModels.updateSuccess'));
      router.replace(`/admin/machine-models/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  const model = data?.data;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('machineModels.editModel')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('machineModels.modelDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : model ? (
            <MachineModelForm
              mode="edit"
              defaultValues={{
                brand: model.brand,
                model: model.model,
                category: model.category ?? '',
                description: model.description ?? '',
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
