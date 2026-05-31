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
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductStatusMutation,
} from '../api';
import type { Product, RecordStatus } from '../types';
import { DeleteProductDialog } from './dialogs/DeleteProductDialog';
import { DisableProductDialog } from './dialogs/DisableProductDialog';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ProductDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetProductQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdateProductStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const product = data?.data;

  const handleStatusConfirm = async () => {
    if (!product) return;
    try {
      const nextStatus: RecordStatus =
        product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateStatus({ id, data: { status: nextStatus } }).unwrap();
      toast.success(
        product.status === 'ACTIVE'
          ? t('products.disabledSuccess')
          : t('products.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id).unwrap();
      toast.success(t('products.deleteSuccess'));
      router.replace('/admin/products');
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
        <h2 className="text-xl font-semibold">{t('products.productDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : product ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{product.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      {product.code}
                    </Badge>
                  </div>
                  {product.nameEn && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.nameEn}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${id}/edit`}>
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
                    {t('products.statusLabel')}
                  </p>
                  <Badge
                    variant={product.status === 'ACTIVE' ? 'default' : 'outline'}
                    className={
                      product.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(product.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>

                {/* Category */}
                {product.category && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.category')}
                    </p>
                    <p>{product.category}</p>
                  </div>
                )}

                {/* Unit */}
                {product.unit && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.unit')}
                    </p>
                    <p>{product.unit}</p>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.description')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.createdAt')}
                  </p>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.updatedAt')}
                  </p>
                  <p>{formatDate(product.updatedAt)}</p>
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
                    product.status === 'ACTIVE'
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {product.status === 'ACTIVE'
                    ? t('products.confirmDisableTitle')
                    : t('products.confirmEnableTitle')}
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

          <DisableProductDialog
            product={product as Product}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteProductDialog
            product={product as Product}
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
