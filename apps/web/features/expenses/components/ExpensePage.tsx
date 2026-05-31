'use client';

import { Plus, Receipt, SlidersHorizontal } from 'lucide-react';
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

import { useGetExpensesQuery, useVoidExpenseMutation } from '../api';
import type { Expense, ExpenseStatus, PaymentMethod } from '../types';
import { VoidExpenseDialog } from './dialogs/VoidExpenseDialog';
import { ExpenseMobileCard } from './ExpenseMobileCard';
import { ExpenseTable } from './ExpenseTable';

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];
const LIMIT = 20;

type StatusFilter = ExpenseStatus | '__all';
type MethodFilter = PaymentMethod | '__all';

export function ExpensePage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('__all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [pendingMethod, setPendingMethod] = useState<MethodFilter>('__all');
  const [pendingDateFrom, setPendingDateFrom] = useState('');
  const [pendingDateTo, setPendingDateTo] = useState('');

  const [voidTarget, setVoidTarget] = useState<Expense | null>(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [voidExpense, { isLoading: isVoiding }] = useVoidExpenseMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [statusFilter, methodFilter, dateFrom, dateTo]);

  const { data, isLoading, isFetching } = useGetExpensesQuery({
    search: search || undefined,
    expenseStatus: statusFilter === '__all' ? undefined : (statusFilter as ExpenseStatus),
    paymentMethod: methodFilter === '__all' ? undefined : (methodFilter as PaymentMethod),
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: LIMIT,
  });

  const expenses = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount = [
    statusFilter !== '__all',
    methodFilter !== '__all',
    !!dateFrom,
    !!dateTo,
  ].filter(Boolean).length;

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingStatus(statusFilter);
      setPendingMethod(methodFilter);
      setPendingDateFrom(dateFrom);
      setPendingDateTo(dateTo);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus);
    setMethodFilter(pendingMethod);
    setDateFrom(pendingDateFrom);
    setDateTo(pendingDateTo);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all');
    setPendingMethod('__all');
    setPendingDateFrom('');
    setPendingDateTo('');
    setStatusFilter('__all');
    setMethodFilter('__all');
    setDateFrom('');
    setDateTo('');
    setFilterSheetOpen(false);
  };

  const openVoid = (expense: Expense) => { setVoidTarget(expense); setVoidDialogOpen(true); };

  const handleVoidConfirm = async (voidReason: string) => {
    if (!voidTarget) return;
    try {
      await voidExpense({ id: voidTarget.id, data: { voidReason } }).unwrap();
      toast.success(t('expenses.voidSuccess'));
      setVoidDialogOpen(false);
      setVoidTarget(null);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const inputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('expenses.title')}</h2>
        <Button asChild size="sm">
          <Link href="/admin/expenses/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('expenses.createExpense')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('expenses.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('expenses.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('expenses.allStatuses')}</SelectItem>
              <SelectItem value="PAID">{t('expenses.statusPaid')}</SelectItem>
              <SelectItem value="UNPAID">{t('expenses.statusUnpaid')}</SelectItem>
              <SelectItem value="VOIDED">{t('expenses.statusVoided')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('expenses.allPaymentMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('expenses.allPaymentMethods')}</SelectItem>
              {PAYMENT_METHODS.map((m) => (
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
                <p className="text-sm font-medium">{t('expenses.expenseStatus')}</p>
                <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as StatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('expenses.allStatuses')}</SelectItem>
                    <SelectItem value="PAID">{t('expenses.statusPaid')}</SelectItem>
                    <SelectItem value="UNPAID">{t('expenses.statusUnpaid')}</SelectItem>
                    <SelectItem value="VOIDED">{t('expenses.statusVoided')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('expenses.paymentMethod')}</p>
                <Select value={pendingMethod} onValueChange={(v) => setPendingMethod(v as MethodFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.allPaymentMethods')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('expenses.allPaymentMethods')}</SelectItem>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('common.dateFrom')}</p>
                  <input
                    type="date"
                    value={pendingDateFrom}
                    onChange={(e) => setPendingDateFrom(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('common.dateTo')}</p>
                  <input
                    type="date"
                    value={pendingDateTo}
                    onChange={(e) => setPendingDateTo(e.target.value)}
                    className={inputClass}
                  />
                </div>
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
          <ExpenseTable expenses={expenses} onVoid={openVoid} />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {expenses.length === 0 ? (
            <AppEmptyState
              icon={Receipt}
              title={t('expenses.noExpenses')}
              description={t('expenses.noExpensesDesc')}
            />
          ) : (
            expenses.map((expense) => (
              <ExpenseMobileCard key={expense.id} expense={expense} onVoid={openVoid} />
            ))
          )}
        </div>
      )}

      {/* Pagination + total */}
      {meta && (
        <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
          <div className="flex items-center gap-4">
            {meta.totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} / {meta.total}
              </p>
            )}
            {meta.totalAmount && parseFloat(meta.totalAmount) > 0 && (
              <p className="text-sm text-muted-foreground">
                {t('expenses.totalExpenses')}:{' '}
                <span className="font-mono font-semibold text-foreground">
                  ${parseFloat(meta.totalAmount).toFixed(2)}
                </span>
              </p>
            )}
          </div>
          {meta.totalPages > 1 && (
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
          )}
        </div>
      )}

      <VoidExpenseDialog
        expense={voidTarget}
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onConfirm={handleVoidConfirm}
        isLoading={isVoiding}
      />
    </div>
  );
}
