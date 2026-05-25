'use client';

import { Package, Plus, SlidersHorizontal } from 'lucide-react';
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
  useAdjustProductStockMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductStatusMutation,
} from '../api';
import type { AdjustStockRequest, Product } from '../types';
import { AdjustStockDialog } from './dialogs/AdjustStockDialog';
import { DeleteProductDialog } from './dialogs/DeleteProductDialog';
import { DisableProductDialog } from './dialogs/DisableProductDialog';
import { ProductMobileCard } from './ProductMobileCard';
import { ProductTable } from './ProductTable';

const LIMIT = 20;

type StatusFilter = 'true' | 'false' | '__all';
type LowStockFilter = 'true' | '__all';

export function ProductPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [lowStockFilter, setLowStockFilter] = useState<LowStockFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [pendingLowStock, setPendingLowStock] = useState<LowStockFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [stockTarget, setStockTarget] = useState<Product | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] = useUpdateProductStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustProductStockMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, lowStockFilter]);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: search || undefined,
    isActive: statusFilter === '__all' ? undefined : statusFilter === 'true',
    lowStock: lowStockFilter === 'true' ? true : undefined,
    page,
    limit: LIMIT,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount =
    (statusFilter !== '__all' ? 1 : 0) + (lowStockFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingStatus(statusFilter);
      setPendingLowStock(lowStockFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus);
    setLowStockFilter(pendingLowStock);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all');
    setPendingLowStock('__all');
    setStatusFilter('__all');
    setLowStockFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (p: Product) => {
    setStatusTarget(p);
    setStatusDialogOpen(true);
  };

  const handleDelete = (p: Product) => {
    setDeleteTarget(p);
    setDeleteDialogOpen(true);
  };

  const handleAdjustStock = (p: Product) => {
    setStockTarget(p);
    setStockDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({ id: statusTarget.id, isActive: !statusTarget.isActive }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t('products.disabledSuccess')
          : t('products.enabledSuccess'),
      );
      setStatusDialogOpen(false);
      setStatusTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      toast.success(t('products.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleStockConfirm = async (data: AdjustStockRequest) => {
    if (!stockTarget) return;
    try {
      await adjustStock({ id: stockTarget.id, data }).unwrap();
      toast.success(t('products.stockAdjusted'));
      setStockDialogOpen(false);
      setStockTarget(null);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t('products.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/products/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('products.createProduct')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('products.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('products.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('products.allStatuses')}</SelectItem>
              <SelectItem value="true">{t('common.active')}</SelectItem>
              <SelectItem value="false">{t('common.inactive')}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={lowStockFilter}
            onValueChange={(v) => setLowStockFilter(v as LowStockFilter)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('products.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('products.allStatuses')}</SelectItem>
              <SelectItem value="true">{t('products.showLowStockOnly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex md:hidden relative shrink-0"
            >
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
                <p className="text-sm font-medium">{t('products.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('products.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('products.allStatuses')}</SelectItem>
                    <SelectItem value="true">{t('common.active')}</SelectItem>
                    <SelectItem value="false">{t('common.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('products.stockQuantity')}</p>
                <Select
                  value={pendingLowStock}
                  onValueChange={(v) => setPendingLowStock(v as LowStockFilter)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('products.allStatuses')}</SelectItem>
                    <SelectItem value="true">{t('products.showLowStockOnly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1"
              >
                {t('common.reset')}
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                {t('common.apply')}
              </Button>
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
          <ProductTable
            products={products}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onAdjustStock={handleAdjustStock}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {products.length === 0 ? (
            <AppEmptyState
              icon={Package}
              title={t('products.noProducts')}
              description={t('products.noProductsDesc')}
            />
          ) : (
            products.map((product) => (
              <ProductMobileCard
                key={product.id}
                product={product}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onAdjustStock={handleAdjustStock}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} /{' '}
            {meta.total}
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

      {/* Dialogs */}
      <DisableProductDialog
        product={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeleteProductDialog
        product={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
      <AdjustStockDialog
        product={stockTarget}
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        onConfirm={handleStockConfirm}
        isLoading={isAdjusting}
      />
    </div>
  );
}
