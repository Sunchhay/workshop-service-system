'use client';

import { ArrowLeft, ImageIcon, Pencil, Trash2 } from 'lucide-react';
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
  useDeleteProductPriceMutation,
  useGetProductPriceQuery,
  useUpdateProductPriceStatusMutation,
} from '../api';
import type { ProductPrice } from '../types';
import { DeleteProductPriceDialog } from './dialogs/DeleteProductPriceDialog';
import { DisableProductPriceDialog } from './dialogs/DisableProductPriceDialog';

interface ProductPriceDetailPageProps {
  id: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? '—' : n.toFixed(2);
}

export function ProductPriceDetailPage({ id }: ProductPriceDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetProductPriceQuery(id);
  const [updateStatus, { isLoading: isToggling }] =
    useUpdateProductPriceStatusMutation();
  const [deleteProductPrice, { isLoading: isDeleting }] =
    useDeleteProductPriceMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const entry = data?.data;

  const handleStatusConfirm = async () => {
    if (!entry) return;
    try {
      await updateStatus({
        id,
        data: { status: entry.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
      }).unwrap();
      toast.success(
        entry.status === 'ACTIVE'
          ? t('productPrices.disabledSuccess')
          : t('productPrices.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProductPrice(id).unwrap();
      toast.success(t('productPrices.deleteSuccess'));
      router.replace('/admin/product-prices');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('productPrices.entryDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
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
                <div className="flex items-start gap-4">
                  {/* Image */}
                  {entry.imageUrl ? (
                    <img
                      src={entry.imageUrl}
                      alt={entry.product.name}
                      className="w-16 h-16 rounded-lg object-cover border shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center shrink-0">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{entry.product.name}</CardTitle>
                    {entry.product.nameEn && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.product.nameEn}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {entry.product.code}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/product-prices/${id}/edit`}>
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
                    {t('productPrices.statusLabel')}
                  </p>
                  <Badge
                    variant={entry.status === 'ACTIVE' ? 'default' : 'outline'}
                    className={
                      entry.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(
                      entry.status === 'ACTIVE'
                        ? 'common.active'
                        : 'common.inactive',
                    )}
                  </Badge>
                </div>

                {/* Machine Model */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productPrices.machineModel')}
                  </p>
                  <p className="font-medium">{entry.machineModel.modelName}</p>
                  {entry.machineModel.brand && (
                    <p className="text-xs text-muted-foreground">
                      {entry.machineModel.brand}
                    </p>
                  )}
                </div>

                {/* Machine Type */}
                {entry.machineModel.machineType && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productPrices.machineType')}
                    </p>
                    <p>{entry.machineModel.machineType}</p>
                  </div>
                )}

                {/* Category */}
                {entry.product.category && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productPrices.category')}
                    </p>
                    <p>{entry.product.category}</p>
                  </div>
                )}

                {/* Unit */}
                {entry.product.unit && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productPrices.unit')}
                    </p>
                    <p>{entry.product.unit}</p>
                  </div>
                )}

                {/* Owner Price */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productPrices.ownerPrice')}
                  </p>
                  <p className="font-mono font-medium">
                    {formatPrice(entry.ownerPrice)}
                  </p>
                </div>

                {/* Mechanic Price */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productPrices.mechanicPrice')}
                  </p>
                  <p className="font-mono font-medium">
                    {formatPrice(entry.mechanicPrice)}
                  </p>
                </div>

                {/* Note */}
                {entry.note && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productPrices.note')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {entry.note}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productPrices.createdAt')}
                  </p>
                  <p>{formatDate(entry.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productPrices.updatedAt')}
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
                    entry.status === 'ACTIVE'
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {entry.status === 'ACTIVE'
                    ? t('productPrices.confirmDisableTitle')
                    : t('productPrices.confirmEnableTitle')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t('productPrices.confirmDeleteTitle')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <DisableProductPriceDialog
            productPrice={entry as ProductPrice}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteProductPriceDialog
            productPrice={entry as ProductPrice}
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
