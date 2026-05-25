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

import { useGetUsersQuery, useUpdateUserStatusMutation } from '../api';
import type { User, UserRole } from '../types';
import { useAppSelector } from '@/lib/store/hooks';
import { DisableUserDialog } from './dialogs/DisableUserDialog';
import { UserMobileCard } from './UserMobileCard';
import { UserTable } from './UserTable';

const ROLES: UserRole[] = ['ADMIN', 'STAFF', 'TECHNICIAN', 'CASHIER'];
const LIMIT = 20;

type RoleFilter = UserRole | '__all';

export function UserPage() {
  const { t } = useTranslation();
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('__all');
  const [pendingRole, setPendingRole] = useState<RoleFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [updateUserStatus, { isLoading: isToggling }] =
    useUpdateUserStatusMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  const { data, isLoading, isFetching } = useGetUsersQuery({
    search: search || undefined,
    role: roleFilter === '__all' ? undefined : (roleFilter as UserRole),
    page,
    limit: LIMIT,
  });

  const users = (data?.data ?? []).filter((u) => u.id !== currentUserId);
  const meta = data?.meta;
  const activeFilterCount = roleFilter !== '__all' ? 1 : 0;

  const handleSheetOpen = (open: boolean) => {
    if (open) setPendingRole(roleFilter);
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setRoleFilter(pendingRole);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingRole('__all');
    setRoleFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    setStatusTarget(user);
    setDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateUserStatus({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t('users.disabledSuccess')
          : t('users.enabledSuccess'),
      );
      setDialogOpen(false);
      setStatusTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t('users.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/users/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('users.createUser')}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('users.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as RoleFilter)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('users.allRoles')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('users.allRoles')}</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {t(`roles.${role}`)}
                </SelectItem>
              ))}
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
                <p className="text-sm font-medium">{t('users.role')}</p>
                <Select
                  value={pendingRole}
                  onValueChange={(v) => setPendingRole(v as RoleFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('users.allRoles')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('users.allRoles')}</SelectItem>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`roles.${role}`)}
                      </SelectItem>
                    ))}
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
          <UserTable users={users} onToggleStatus={handleToggleStatus} />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {users.length === 0 ? (
            <AppEmptyState
              icon={Users}
              title={t('users.noUsers')}
              description={t('users.noUsersDesc')}
            />
          ) : (
            users.map((user) => (
              <UserMobileCard
                key={user.id}
                user={user}
                onToggleStatus={handleToggleStatus}
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

      {/* Disable/Enable dialog */}
      <DisableUserDialog
        user={statusTarget}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
    </div>
  );
}
