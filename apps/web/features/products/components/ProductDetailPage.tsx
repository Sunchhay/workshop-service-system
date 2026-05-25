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
  useAdjustProductStockMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductStatusMutation,
} from '../api';
import type { AdjustStockRequest, Product } from '../types';
import { AdjustStockDialog } from './dialogs/AdjustStockDialog';
import { DeleteProductDialog } from './dialogs/DeleteProductDialog';
import { DisableProductDialog } from './dialogs/DisableProductDialog';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDecimal(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function isLowStock(p: Product) {
  return p.stockQuantity <= p.reorderLevel;
}

export function ProductDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetProductQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdateProductStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustProductStockMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  const product = data?.data;

  const handleStatusConfirm = async () => {
    if (!product) return;
    try {
      await updateStatus({ id, isActive: !product.isActive }).unwrap();
      toast.success(
        product.isActive
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

  const handleStockConfirm = async (stockData: AdjustStockRequest) => {
    try {
      await adjustStock({ id, data: stockData }).unwrap();
      toast.success(t('products.stockAdjusted'));
      setStockDialogOpen(false);
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
                  {product.brand && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.brand}
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

              {/* Stock status */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge
                  variant="outline"
                  className={
                    isLowStock(product)
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400'
                      : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                  }
                >
                  {product.stockQuantity} {product.unit}
                  {isLowStock(product) && ` · ${t('products.lowStock')}`}
                </Badge>
                <Badge
                  variant={product.isActive ? 'default' : 'outline'}
                  className={
                    product.isActive
                      ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                      : 'text-muted-foreground'
                  }
                >
                  {t(product.isActive ? 'common.active' : 'common.inactive')}
                </Badge>
              </div>

              <Separator />

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {product.componentPartType && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.componentPartType')}
                    </p>
                    <p>{product.componentPartType}</p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.size')}
                    </p>
                    <p>{product.size}</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.category')}
                    </p>
                    <p>{product.category}</p>
                  </div>
                )}
                {product.supplier && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.supplier')}
                    </p>
                    <p>{product.supplier}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.unit')}
                  </p>
                  <p>{product.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.reorderLevel')}
                  </p>
                  <p>{product.reorderLevel}</p>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.costPrice')}
                  </p>
                  <p className="font-mono font-medium">
                    ${formatDecimal(product.costPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('products.sellingPrice')}
                  </p>
                  <p className="font-mono font-medium">
                    ${formatDecimal(product.sellingPrice)}
                  </p>
                </div>
              </div>

              {/* Linked reference book */}
              {product.linkedReferenceBook && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.linkedReferenceBook')}
                    </p>
                    <Link
                      href={`/admin/reference-book/${product.linkedReferenceBook.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.linkedReferenceBook.partName}
                      {product.linkedReferenceBook.partCode && (
                        <span className="text-muted-foreground text-xs ml-2">
                          ({product.linkedReferenceBook.partCode})
                        </span>
                      )}
                    </Link>
                  </div>
                </>
              )}

              {/* Description */}
              {product.description && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('products.description')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                  onClick={() => setStockDialogOpen(true)}
                >
                  {t('products.adjustStock')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={
                    product.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {product.isActive
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
          <AdjustStockDialog
            product={product as Product}
            open={stockDialogOpen}
            onOpenChange={setStockDialogOpen}
            onConfirm={handleStockConfirm}
            isLoading={isAdjusting}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
