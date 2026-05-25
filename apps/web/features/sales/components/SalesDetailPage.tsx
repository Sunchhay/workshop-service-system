'use client';

import { ArrowLeft, CheckCircle, Pencil, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCancelSaleMutation, useCompleteSaleMutation, useDeleteSaleMutation, useGetSaleQuery } from '../api';
import type { SaleStatus } from '../types';
import { CancelSaleDialog } from './dialogs/CancelSaleDialog';
import { CompleteSaleDialog } from './dialogs/CompleteSaleDialog';
import { DeleteSaleDialog } from './dialogs/DeleteSaleDialog';

const statusClass: Record<SaleStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function fmt(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function SalesDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetSaleQuery(id);
  const [completeSale, { isLoading: isCompleting }] = useCompleteSaleMutation();
  const [cancelSale, { isLoading: isCancelling }] = useCancelSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const sale = data?.data;

  const handleCompleteConfirm = async () => {
    try {
      await completeSale(id).unwrap();
      toast.success(t('sales.completeSuccess'));
      setCompleteDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const handleCancelConfirm = async () => {
    try {
      await cancelSale({ id }).unwrap();
      toast.success(t('sales.cancelSuccess'));
      setCancelDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSale(id).unwrap();
      toast.success(t('sales.deleteSuccess'));
      router.replace('/admin/sales');
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
        <h2 className="text-xl font-semibold">{t('sales.saleDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : sale ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-mono">{sale.saleNumber}</CardTitle>
                  <Badge variant="outline" className={statusClass[sale.status]}>
                    {t(`saleStatuses.${sale.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {sale.customer
                    ? `${sale.customer.name}${sale.customer.phone ? ` · ${sale.customer.phone}` : ''}`
                    : t('sales.walkIn')}
                </p>
              </div>
              {sale.status === 'DRAFT' && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/sales/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('sales.soldAt')}</p>
                <p>{formatDate(sale.soldAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('sales.createdBy')}</p>
                <p>{sale.createdBy.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('sales.createdAt')}</p>
                <p>{formatDate(sale.createdAt)}</p>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.notes')}</p>
                  <p className="whitespace-pre-line text-muted-foreground">{sale.notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Items table */}
            <div>
              <p className="text-sm font-medium mb-3">{t('sales.items')}</p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('sales.product')}</TableHead>
                      <TableHead className="text-right w-16">{t('sales.quantity')}</TableHead>
                      <TableHead className="text-right w-28">{t('sales.unitPrice')}</TableHead>
                      <TableHead className="text-right w-28">{t('sales.itemDiscount')}</TableHead>
                      <TableHead className="text-right w-28">{t('sales.totalPrice')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="text-sm font-medium">
                            {item.description ?? item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.product.code}</p>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {fmt(item.quantity)} {item.product.unit}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          ${fmt(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {parseFloat(item.discountAmount) > 0
                            ? `-$${fmt(item.discountAmount)}`
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-medium">
                          ${fmt(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('sales.subtotal')}</span>
                  <span className="font-mono">${fmt(sale.subtotal)}</span>
                </div>
                {parseFloat(sale.discountAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sales.discountAmount')}</span>
                    <span className="font-mono text-destructive">-${fmt(sale.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t('sales.totalAmount')}</span>
                  <span className="font-mono">${fmt(sale.totalAmount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {sale.status === 'DRAFT' && (
                <Button
                  size="sm"
                  onClick={() => setCompleteDialogOpen(true)}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  {t('sales.completeSale')}
                </Button>
              )}
              {sale.status !== 'CANCELLED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  {t('sales.confirmCancelTitle')}
                </Button>
              )}
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
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}

      {sale && (
        <>
          <CompleteSaleDialog
            sale={sale}
            open={completeDialogOpen}
            onOpenChange={setCompleteDialogOpen}
            onConfirm={handleCompleteConfirm}
            isLoading={isCompleting}
          />
          <CancelSaleDialog
            sale={sale}
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            onConfirm={handleCancelConfirm}
            isLoading={isCancelling}
          />
          <DeleteSaleDialog
            sale={sale}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
}
