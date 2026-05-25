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
  useDeleteServiceMutation,
  useGetServiceQuery,
  useUpdateServiceStatusMutation,
} from '../api';
import type { PriceType, Service } from '../types';
import { DeleteServiceDialog } from './dialogs/DeleteServiceDialog';
import { DisableServiceDialog } from './dialogs/DisableServiceDialog';

interface ServiceDetailPageProps {
  id: string;
}

const priceTypeClass: Record<PriceType, string> = {
  FIXED: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  CATALOG_BASED:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  CUSTOM:
    'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
};

function formatPrice(price: string | null): string {
  if (!price) return '—';
  const num = parseFloat(price);
  return isNaN(num) ? '—' : num.toFixed(2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ServiceDetailPage({ id }: ServiceDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetServiceQuery(id);
  const [updateStatus, { isLoading: isToggling }] =
    useUpdateServiceStatusMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const service = data?.data;

  const handleStatusConfirm = async () => {
    if (!service) return;
    try {
      await updateStatus({ id, isActive: !service.isActive }).unwrap();
      toast.success(
        service.isActive
          ? t('services.disabledSuccess')
          : t('services.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteService(id).unwrap();
      toast.success(t('services.deleteSuccess'));
      router.replace('/admin/services');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('services.serviceDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : service ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{service.nameEn}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      {service.code}
                    </Badge>
                  </div>
                  {service.nameKh && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.nameKh}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/services/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {/* Price type */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('services.priceType')}
                  </p>
                  <Badge
                    variant="outline"
                    className={priceTypeClass[service.priceType]}
                  >
                    {t(`priceTypes.${service.priceType}`)}
                  </Badge>
                </div>

                {/* Default price */}
                {service.priceType === 'FIXED' && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('services.defaultPrice')}
                    </p>
                    <p className="font-mono font-medium">
                      {formatPrice(service.defaultPrice)}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('services.statusLabel')}
                  </p>
                  <Badge
                    variant={service.isActive ? 'default' : 'outline'}
                    className={
                      service.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(service.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>

                {/* Category */}
                {service.category && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('services.category')}
                    </p>
                    <p>{service.category}</p>
                  </div>
                )}

                {/* Related component */}
                {service.relatedComponent && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('services.relatedComponent')}
                    </p>
                    <p>{service.relatedComponent}</p>
                  </div>
                )}

                {/* Description */}
                {service.description && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('services.description')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('services.createdAt')}
                  </p>
                  <p>{formatDate(service.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('services.updatedAt')}
                  </p>
                  <p>{formatDate(service.updatedAt)}</p>
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
                    service.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {service.isActive
                    ? t('services.confirmDisableTitle')
                    : t('services.confirmEnableTitle')}
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
          <DisableServiceDialog
            service={service as Service}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteServiceDialog
            service={service as Service}
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
