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

import { useDeleteExpenseMutation, useGetExpensesQuery } from '../api';
import type { Expense, ExpenseCategory, ExpensePaymentMethod } from '../types';
import { DeleteExpenseDialog } from './dialogs/DeleteExpenseDialog';
import { ExpenseMobileCard } from './ExpenseMobileCard';
import { ExpenseTable } from './ExpenseTable';

const CATEGORIES: ExpenseCategory[] = ['SUPPLIES', 'UTILITIES', 'RENT', 'SALARY', 'MAINTENANCE', 'OTHER'];
const METHODS: ExpensePaymentMethod[] = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];
const LIMIT = 20;
type CategoryFilter = ExpenseCategory | '__all';
type MethodFilter = ExpensePaymentMethod | '__all';

export function ExpensePage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('__all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('__all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Pending filter state for mobile sheet
  const [pendingCategory, setPendingCategory] = useState<CategoryFilter>('__all');
  const [pendingMethod, setPendingMethod] = useState<MethodFilter>('__all');
  const [pendingDateFrom, setPendingDateFrom] = useState('');
  const [pendingDateTo, setPendingDateTo] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [categoryFilter, methodFilter, dateFrom, dateTo]);

  const { data, isLoading, isFetching } = useGetExpensesQuery({
    search: search || undefined,
    category: categoryFilter === '__all' ? undefined : categoryFilter,
    method: methodFilter === '__all' ? undefined : methodFilter,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: LIMIT,
  });

  const expenses = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount = [
    categoryFilter !== '__all',
    methodFilter !== '__all',
    !!dateFrom,
    !!dateTo,
  ].filter(Boolean).length;

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingCategory(categoryFilter);
      setPendingMethod(methodFilter);
      setPendingDateFrom(dateFrom);
      setPendingDateTo(dateTo);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setCategoryFilter(pendingCategory);
    setMethodFilter(pendingMethod);
    setDateFrom(pendingDateFrom);
    setDateTo(pendingDateTo);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingCategory('__all');
    setPendingMethod('__all');
    setPendingDateFrom('');
    setPendingDateTo('');
    setCategoryFilter('__all');
    setMethodFilter('__all');
    setDateFrom('');
    setDateTo('');
    setFilterSheetOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id).unwrap();
      toast.success(t('expenses.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const openDelete = (expense: Expense) => { setDeleteTarget(expense); setDeleteDialogOpen(true); };

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
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('expenses.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('expenses.allCategories')}</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{t(`expenseCategories.${c}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('expenses.allMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('expenses.allMethods')}</SelectItem>
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
                <p className="text-sm font-medium">{t('expenses.category')}</p>
                <Select value={pendingCategory} onValueChange={(v) => setPendingCategory(v as CategoryFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('expenses.allCategories')}</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{t(`expenseCategories.${c}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('expenses.method')}</p>
                <Select value={pendingMethod} onValueChange={(v) => setPendingMethod(v as MethodFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.allMethods')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('expenses.allMethods')}</SelectItem>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('common.dateFrom') ?? 'From'}</p>
                  <input
                    type="date"
                    value={pendingDateFrom}
                    onChange={(e) => setPendingDateFrom(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('common.dateTo') ?? 'To'}</p>
                  <input
                    type="date"
                    value={pendingDateTo}
                    onChange={(e) => setPendingDateTo(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          <ExpenseTable expenses={expenses} onDelete={openDelete} />
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
              <ExpenseMobileCard
                key={expense.id}
                expense={expense}
                onDelete={openDelete}
              />
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

      <DeleteExpenseDialog
        expense={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
