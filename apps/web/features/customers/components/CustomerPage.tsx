'use client';

import { Plus, SlidersHorizontal, Users } from 'lucide-react';
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
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
} from '../api';
import type { Customer, CustomerType } from '../types';
import { DeleteCustomerDialog } from './dialogs/DeleteCustomerDialog';
import { DisableCustomerDialog } from './dialogs/DisableCustomerDialog';
import { CustomerMobileCard } from './CustomerMobileCard';
import { CustomerTable } from './CustomerTable';

const CUSTOMER_TYPES: CustomerType[] = ['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER'];
const LIMIT = 20;

type TypeFilter = CustomerType | '__all';
type StatusFilter = 'true' | 'false' | '__all';

export function CustomerPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('__all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [pendingType, setPendingType] = useState<TypeFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] =
    useUpdateCustomerStatusMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetCustomersQuery({
    search: search || undefined,
    customerType: typeFilter === '__all' ? undefined : (typeFilter as CustomerType),
    isActive:
      statusFilter === '__all' ? undefined : statusFilter === 'true',
    page,
    limit: LIMIT,
  });

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount =
    (typeFilter !== '__all' ? 1 : 0) + (statusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingType(typeFilter);
      setPendingStatus(statusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setTypeFilter(pendingType);
    setStatusFilter(pendingStatus);
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingType('__all');
    setPendingStatus('__all');
    setTypeFilter('__all');
    setStatusFilter('__all');
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (customer: Customer) => {
    setStatusTarget(customer);
    setStatusDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeleteTarget(customer);
    setDeleteDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t('customers.disabledSuccess')
          : t('customers.enabledSuccess'),
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
      await deleteCustomer(deleteTarget.id).unwrap();
      toast.success(t('customers.deleteSuccess'));
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
        <h2 className="hidden md:block text-xl font-semibold">
          {t('customers.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/customers/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('customers.createCustomer')}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('customers.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select
            value={typeFilter}
            onValueChange={(v) => { setTypeFilter(v as TypeFilter); setPage(1); }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('customers.allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('customers.allTypes')}</SelectItem>
              {CUSTOMER_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`customerTypes.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1); }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('customers.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('customers.allStatuses')}</SelectItem>
              <SelectItem value="true">{t('common.active')}</SelectItem>
              <SelectItem value="false">{t('common.inactive')}</SelectItem>
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
                <p className="text-sm font-medium">{t('customers.customerType')}</p>
                <Select
                  value={pendingType}
                  onValueChange={(v) => setPendingType(v as TypeFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('customers.allTypes')}</SelectItem>
                    {CUSTOMER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`customerTypes.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('customers.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('customers.allStatuses')}</SelectItem>
                    <SelectItem value="true">{t('common.active')}</SelectItem>
                    <SelectItem value="false">{t('common.inactive')}</SelectItem>
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

      {/* Loading skeleton */}
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
          <CustomerTable
            customers={customers}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {customers.length === 0 ? (
            <AppEmptyState
              icon={Users}
              title={t('customers.noCustomers')}
              description={t('customers.noCustomersDesc')}
            />
          ) : (
            customers.map((customer) => (
              <CustomerMobileCard
                key={customer.id}
                customer={customer}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
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
              onClick={() =>
                setPage((p) => Math.min(meta.totalPages, p + 1))
              }
              disabled={page >= meta.totalPages || isFetching}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <DisableCustomerDialog
        customer={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeleteCustomerDialog
        customer={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
