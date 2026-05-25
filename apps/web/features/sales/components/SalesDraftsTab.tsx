'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useCancelSaleMutation,
  useCompleteSaleMutation,
  useDeleteSaleMutation,
  useGetSalesQuery,
} from '../api';
import type { Sale } from '../types';
import { CancelSaleDialog } from './dialogs/CancelSaleDialog';
import { CompleteSaleDialog } from './dialogs/CompleteSaleDialog';
import { DeleteSaleDialog } from './dialogs/DeleteSaleDialog';
import { SalesMobileCard } from './SalesMobileCard';
import { SalesTable } from './SalesTable';

const LIMIT = 20;

export function SalesDraftsTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const [completeTarget, setCompleteTarget] = useState<Sale | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Sale | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [completeSale, { isLoading: isCompleting }] = useCompleteSaleMutation();
  const [cancelSale, { isLoading: isCancelling }] = useCancelSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const { data, isLoading, isFetching } = useGetSalesQuery({
    status: 'DRAFT',
    page,
    limit: LIMIT,
  });

  useEffect(() => { setPage(1); }, []);

  const sales = data?.data ?? [];
  const meta = data?.meta;

  const handleCompleteConfirm = async () => {
    if (!completeTarget) return;
    try {
      await completeSale(completeTarget.id).unwrap();
      toast.success(t('sales.completeSuccess'));
      setCompleteDialogOpen(false);
      setCompleteTarget(null);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await cancelSale({ id: cancelTarget.id }).unwrap();
      toast.success(t('sales.cancelSuccess'));
      setCancelDialogOpen(false);
      setCancelTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSale(deleteTarget.id).unwrap();
      toast.success(t('sales.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const openComplete = (sale: Sale) => { setCompleteTarget(sale); setCompleteDialogOpen(true); };
  const openCancel = (sale: Sale) => { setCancelTarget(sale); setCancelDialogOpen(true); };
  const openDelete = (sale: Sale) => { setDeleteTarget(sale); setDeleteDialogOpen(true); };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && sales.length === 0 && (
        <AppEmptyState
          icon={ShoppingBag}
          title={t('sales.noDrafts')}
          description={t('sales.noDraftsDesc')}
        />
      )}

      {!isLoading && sales.length > 0 && (
        <div className={`hidden md:block ${isFetching ? 'opacity-60' : ''}`}>
          <SalesTable
            sales={sales}
            onComplete={openComplete}
            onCancel={openCancel}
            onDelete={openDelete}
          />
        </div>
      )}

      {!isLoading && sales.length > 0 && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {sales.map((sale) => (
            <SalesMobileCard
              key={sale.id}
              sale={sale}
              onComplete={openComplete}
              onCancel={openCancel}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} / {meta.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              {t('common.back')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isFetching}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      <CompleteSaleDialog
        sale={completeTarget}
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        onConfirm={handleCompleteConfirm}
        isLoading={isCompleting}
      />
      <CancelSaleDialog
        sale={cancelTarget}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />
      <DeleteSaleDialog
        sale={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
