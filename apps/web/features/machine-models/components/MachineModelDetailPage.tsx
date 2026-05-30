'use client';

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useDeleteMachineModelMutation,
  useGetMachineModelQuery,
  useUpdateMachineModelStatusMutation,
} from '../api';
import type { MachineModel } from '../types';
import { DeleteMachineModelDialog } from './dialogs/DeleteMachineModelDialog';
import { DisableMachineModelDialog } from './dialogs/DisableMachineModelDialog';

interface MachineModelDetailPageProps {
  id: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function MachineModelDetailPage({ id }: MachineModelDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetMachineModelQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdateMachineModelStatusMutation();
  const [deleteMachineModel, { isLoading: isDeleting }] = useDeleteMachineModelMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const model = data?.data;

  const handleStatusConfirm = async () => {
    if (!model) return;
    try {
      await updateStatus({ id, isActive: !model.isActive }).unwrap();
      toast.success(
        model.isActive
          ? t('machineModels.disabledSuccess')
          : t('machineModels.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMachineModel(id).unwrap();
      toast.success(t('machineModels.deleteSuccess'));
      router.replace('/admin/machine-models');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header — desktop only */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('machineModels.modelDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : model ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle>
                    {model.brand} {model.model}
                  </CardTitle>
                  {model.category && (
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400"
                      >
                        {model.category}
                      </Badge>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/machine-models/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {/* Status */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.statusLabel')}
                  </p>
                  <Badge
                    variant={model.isActive ? 'default' : 'outline'}
                    className={
                      model.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(model.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>

                {/* Brand */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.brand')}
                  </p>
                  <p className="font-medium">{model.brand}</p>
                </div>

                {/* Model */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.model')}
                  </p>
                  <p className="font-medium">{model.model}</p>
                </div>

                {/* Category */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.category')}
                  </p>
                  <p>{model.category ?? '—'}</p>
                </div>

                {/* Description */}
                {model.description && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('machineModels.description')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {model.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.createdAt')}
                  </p>
                  <p>{formatDate(model.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('machineModels.updatedAt')}
                  </p>
                  <p>{formatDate(model.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Placeholder section for future relations */}
              <div className="space-y-3">
                <div className="rounded-lg border border-dashed p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t('machineModels.relatedReference')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('machineModels.noRelatedReference')}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={
                    model.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {model.isActive
                    ? t('machineModels.confirmDisableTitle')
                    : t('machineModels.confirmEnableTitle')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dialogs */}
          <DisableMachineModelDialog
            model={model as MachineModel}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteMachineModelDialog
            model={model as MachineModel}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
