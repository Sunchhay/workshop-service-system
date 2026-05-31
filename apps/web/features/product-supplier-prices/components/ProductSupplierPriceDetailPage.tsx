'use client';

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useDeleteProductSupplierPriceMutation,
  useGetProductSupplierPriceQuery,
} from '../api';
import { DeleteProductSupplierPriceDialog } from './dialogs/DeleteProductSupplierPriceDialog';

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? '—' : n.toFixed(2);
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ProductSupplierPriceDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetProductSupplierPriceQuery(id);
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteProductSupplierPriceMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const entry = data?.data;

  const handleDeleteConfirm = async () => {
    try {
      await deleteEntry(id).unwrap();
      toast.success(t('productSupplierPrices.deleteSuccess'));
      router.replace('/admin/product-supplier-prices');
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
        <h2 className="text-xl font-semibold">
          {t('productSupplierPrices.entryDetail')}
        </h2>
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
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/product-supplier-prices/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t('productSupplierPrices.buyingPrice')}
                </p>
                <p className="text-2xl font-mono font-bold">
                  {formatPrice(entry.buyingPrice)}{' '}
                  <span className="text-base font-normal text-muted-foreground">
                    {entry.currency || 'USD'}
                  </span>
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productSupplierPrices.supplier')}
                  </p>
                  <p className="font-medium">{entry.supplier.name}</p>
                  {entry.supplier.phone && (
                    <p className="text-xs text-muted-foreground">{entry.supplier.phone}</p>
                  )}
                </div>

                {entry.product.category && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productSupplierPrices.category')}
                    </p>
                    <p>{entry.product.category}</p>
                  </div>
                )}

                {entry.product.unit && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productSupplierPrices.unit')}
                    </p>
                    <p>{entry.product.unit}</p>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productSupplierPrices.lastUpdatedAt')}
                  </p>
                  <p>{formatDate(entry.lastUpdatedAt)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productSupplierPrices.createdAt')}
                  </p>
                  <p>{formatDate(entry.createdAt)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('productSupplierPrices.updatedAt')}
                  </p>
                  <p>{formatDate(entry.updatedAt)}</p>
                </div>
              </div>

              {entry.note && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('productSupplierPrices.note')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">{entry.note}</p>
                  </div>
                </>
              )}

              <Separator />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                {t('productSupplierPrices.confirmDeleteTitle')}
              </Button>
            </CardContent>
          </Card>

          <DeleteProductSupplierPriceDialog
            entry={entry}
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
