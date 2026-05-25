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
  useDeletePriceCatalogMutation,
  useGetPriceCatalogQuery,
  useUpdatePriceCatalogStatusMutation,
} from '../api';
import type { CustomerType, DifficultyLevel, PriceCatalog } from '../types';
import { DeletePriceCatalogDialog } from './dialogs/DeletePriceCatalogDialog';
import { DisablePriceCatalogDialog } from './dialogs/DisablePriceCatalogDialog';

interface PriceCatalogDetailPageProps {
  id: string;
}

const difficultyClass: Record<DifficultyLevel, string> = {
  NORMAL: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  DIFFICULT: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  SPECIAL: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const customerTypeClass: Record<CustomerType, string> = {
  NORMAL: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  VIP: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400',
  WHOLESALE: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTNER: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PriceCatalogDetailPage({ id }: PriceCatalogDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetPriceCatalogQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdatePriceCatalogStatusMutation();
  const [deletePriceCatalog, { isLoading: isDeleting }] = useDeletePriceCatalogMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const entry = data?.data;

  const handleStatusConfirm = async () => {
    if (!entry) return;
    try {
      await updateStatus({ id, isActive: !entry.isActive }).unwrap();
      toast.success(
        entry.isActive
          ? t('priceCatalog.disabledSuccess')
          : t('priceCatalog.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePriceCatalog(id).unwrap();
      toast.success(t('priceCatalog.deleteSuccess'));
      router.replace('/admin/price-catalog');
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
        <h2 className="text-xl font-semibold">{t('priceCatalog.entryDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : entry ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle>{entry.label}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.service.nameEn}{' '}
                    <span className="font-mono text-xs">({entry.service.code})</span>
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/price-catalog/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {/* Unit price */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.unitPrice')}
                  </p>
                  <p className="font-mono font-medium">
                    {parseFloat(entry.unitPrice).toFixed(2)}{' '}
                    <span className="text-muted-foreground text-xs">{entry.currency}</span>
                  </p>
                </div>

                {/* Difficulty */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.difficultyLevel')}
                  </p>
                  <Badge variant="outline" className={difficultyClass[entry.difficultyLevel]}>
                    {t(`difficultyLevels.${entry.difficultyLevel}`)}
                  </Badge>
                </div>

                {/* Customer type */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.customerType')}
                  </p>
                  {entry.customerType ? (
                    <Badge variant="outline" className={customerTypeClass[entry.customerType]}>
                      {t(`customerTypes.${entry.customerType}`)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      {t('priceCatalog.allCustomerTypes')}
                    </span>
                  )}
                </div>

                {/* Size range */}
                {(entry.sizeFrom || entry.sizeTo) && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('priceCatalog.sizeRange')}
                    </p>
                    <p className="font-mono">
                      {entry.sizeFrom ? parseFloat(entry.sizeFrom) : '?'}
                      {' – '}
                      {entry.sizeTo ? parseFloat(entry.sizeTo) : '∞'}
                      {entry.unit && (
                        <span className="ml-1 text-muted-foreground text-xs">
                          {entry.unit}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.statusLabel')}
                  </p>
                  <Badge
                    variant={entry.isActive ? 'default' : 'outline'}
                    className={
                      entry.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(entry.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>

                {/* Effective date */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.effectiveDate')}
                  </p>
                  <p>{formatDate(entry.effectiveDate)}</p>
                </div>

                {/* Expiry date */}
                {entry.expiredDate && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('priceCatalog.expiredDate')}
                    </p>
                    <p>{formatDate(entry.expiredDate)}</p>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('priceCatalog.notes')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">{entry.notes}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.createdAt')}
                  </p>
                  <p>{formatDate(entry.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('priceCatalog.updatedAt')}
                  </p>
                  <p>{formatDate(entry.updatedAt)}</p>
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
                    entry.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {entry.isActive
                    ? t('priceCatalog.confirmDisableTitle')
                    : t('priceCatalog.confirmEnableTitle')}
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
          <DisablePriceCatalogDialog
            entry={entry as PriceCatalog}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeletePriceCatalogDialog
            entry={entry as PriceCatalog}
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
