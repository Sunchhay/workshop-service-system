'use client';

import { DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { AppSearchInput } from '@/components/app/AppSearchInput';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useDeleteProductSupplierPriceMutation, useGetProductSupplierPricesQuery } from '../api';
import type { ProductSupplierPrice } from '../types';
import { DeleteProductSupplierPriceDialog } from './dialogs/DeleteProductSupplierPriceDialog';
import { ProductSupplierPriceMobileCard } from './ProductSupplierPriceMobileCard';
import { ProductSupplierPriceTable } from './ProductSupplierPriceTable';

const LIMIT = 20;

export function ProductSupplierPricePage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ProductSupplierPrice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteEntry, { isLoading: isDeleting }] = useDeleteProductSupplierPriceMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetProductSupplierPricesQuery({
    search: search || undefined,
    page,
    limit: LIMIT,
  });

  const entries = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = (entry: ProductSupplierPrice) => {
    setDeleteTarget(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry(deleteTarget.id).unwrap();
      toast.success(t('productSupplierPrices.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t('productSupplierPrices.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/product-supplier-prices/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('productSupplierPrices.createEntry')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('productSupplierPrices.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className={`hidden md:block ${isFetching ? 'opacity-60' : ''}`}>
          <ProductSupplierPriceTable entries={entries} onDelete={handleDelete} />
        </div>
      )}

      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {entries.length === 0 ? (
            <AppEmptyState
              icon={DollarSign}
              title={t('productSupplierPrices.noEntries')}
              description={t('productSupplierPrices.noEntriesDesc')}
            />
          ) : (
            entries.map((entry) => (
              <ProductSupplierPriceMobileCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
              />
            ))
          )}
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

      <DeleteProductSupplierPriceDialog
        entry={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
