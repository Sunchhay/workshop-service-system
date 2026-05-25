'use client';

import { FileText, Plus, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { AppSearchInput } from '@/components/app/AppSearchInput';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoicesQuery,
} from '../api';
import type { Invoice, InvoiceStatus } from '../types';
import { CancelInvoiceDialog } from './dialogs/CancelInvoiceDialog';
import { DeleteInvoiceDialog } from './dialogs/DeleteInvoiceDialog';
import { InvoiceMobileCard } from './InvoiceMobileCard';
import { InvoiceTable } from './InvoiceTable';

const STATUSES: InvoiceStatus[] = ['DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'CANCELLED'];
const LIMIT = 20;
type StatusFilter = InvoiceStatus | '__all';

export function InvoicePage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [cancelTarget, setCancelTarget] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cancelInvoice, { isLoading: isCancelling }] = useCancelInvoiceMutation();
  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [statusFilter]);

  const { data, isLoading, isFetching } = useGetInvoicesQuery({
    search: search || undefined,
    status: statusFilter === '__all' ? undefined : statusFilter,
    page,
    limit: LIMIT,
  });

  const invoices = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount = statusFilter !== '__all' ? 1 : 0;

  const handleSheetOpen = (open: boolean) => {
    if (open) setPendingStatus(statusFilter);
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all');
    setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleCancelConfirm = async (reason?: string) => {
    if (!cancelTarget) return;
    try {
      await cancelInvoice({ id: cancelTarget.id, reason }).unwrap();
      toast.success(t('invoices.cancelSuccess'));
      setCancelDialogOpen(false);
      setCancelTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInvoice(deleteTarget.id).unwrap();
      toast.success(t('invoices.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('invoices.title')}</h2>
        <Button asChild size="sm">
          <Link href="/admin/invoices/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('invoices.createInvoice')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('invoices.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filter */}
        <div className="hidden md:flex gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('invoices.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('invoices.allStatuses')}</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{t(`invoiceStatuses.${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="flex md:hidden relative shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>{t('common.filters')}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('invoices.status')}</p>
                <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as StatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('invoices.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('invoices.allStatuses')}</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{t(`invoiceStatuses.${s}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1">{t('common.reset')}</Button>
              <Button onClick={handleApplyFilters} className="flex-1">{t('common.apply')}</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && (
        <div className={`hidden md:block ${isFetching ? 'opacity-60' : ''}`}>
          <InvoiceTable
            invoices={invoices}
            onCancel={(inv) => { setCancelTarget(inv); setCancelDialogOpen(true); }}
            onDelete={(inv) => { setDeleteTarget(inv); setDeleteDialogOpen(true); }}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {invoices.length === 0 ? (
            <AppEmptyState
              icon={FileText}
              title={t('invoices.noInvoices')}
              description={t('invoices.noInvoicesDesc')}
            />
          ) : (
            invoices.map((inv) => (
              <InvoiceMobileCard
                key={inv.id}
                invoice={inv}
                onCancel={(i) => { setCancelTarget(i); setCancelDialogOpen(true); }}
                onDelete={(i) => { setDeleteTarget(i); setDeleteDialogOpen(true); }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} / {meta.total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isFetching}>
              {t('common.back')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages || isFetching}>
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      <CancelInvoiceDialog
        invoice={cancelTarget}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />
      <DeleteInvoiceDialog
        invoice={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
