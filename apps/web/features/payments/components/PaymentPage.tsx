'use client';

import { SlidersHorizontal, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

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

import { useGetPaymentsQuery } from '../api';
import type { PaymentMethod } from '../types';
import { PaymentMobileCard } from './PaymentMobileCard';
import { PaymentTable } from './PaymentTable';

const METHODS: PaymentMethod[] = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];
const LIMIT = 20;
type MethodFilter = PaymentMethod | '__all';

export function PaymentPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('__all');
  const [pendingMethod, setPendingMethod] = useState<MethodFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [methodFilter]);

  const { data, isLoading, isFetching } = useGetPaymentsQuery({
    search: search || undefined,
    method: methodFilter === '__all' ? undefined : methodFilter,
    page,
    limit: LIMIT,
  });

  const payments = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount = methodFilter !== '__all' ? 1 : 0;

  const handleSheetOpen = (open: boolean) => {
    if (open) setPendingMethod(methodFilter);
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setMethodFilter(pendingMethod);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingMethod('__all');
    setMethodFilter('__all');
    setFilterSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('payments.title')}</h2>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('payments.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filter */}
        <div className="hidden md:flex gap-3">
          <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('payments.allMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('payments.allMethods')}</SelectItem>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
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
                <p className="text-sm font-medium">{t('payments.method')}</p>
                <Select value={pendingMethod} onValueChange={(v) => setPendingMethod(v as MethodFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('payments.allMethods')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('payments.allMethods')}</SelectItem>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
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
          <PaymentTable payments={payments} />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {payments.length === 0 ? (
            <AppEmptyState
              icon={Wallet}
              title={t('payments.noPayments')}
              description={t('payments.noPaymentsDesc')}
            />
          ) : (
            payments.map((pay) => (
              <PaymentMobileCard key={pay.id} payment={pay} />
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
    </div>
  );
}
