'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Customer, CustomerType } from '../types';

const typeClass: Record<CustomerType, string> = {
  NORMAL: 'text-muted-foreground',
  VIP: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  WHOLESALE:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  PARTNER:
    'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

interface CustomerMobileCardProps {
  customer: Customer;
  onToggleStatus: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerMobileCard({
  customer,
  onToggleStatus,
  onDelete,
}: CustomerMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/customers/${customer.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/customers/${customer.id}`);
      }}
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {initials}
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{customer.name}</span>
          <Badge variant="outline" className="font-mono text-xs px-1.5">
            {customer.code}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{customer.phone}</p>
        {customer.email && (
          <p className="text-xs text-muted-foreground truncate">
            {customer.email}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="outline" className={typeClass[customer.customerType]}>
            {t(`customerTypes.${customer.customerType}`)}
          </Badge>
          <Badge
            variant={customer.isActive ? 'default' : 'outline'}
            className={
              customer.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(customer.isActive ? 'common.active' : 'common.inactive')}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/customers/${customer.id}`}>
                {t('customers.customerDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/customers/${customer.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(customer)}
              className={
                customer.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {customer.isActive
                ? t('customers.confirmDisableTitle')
                : t('customers.confirmEnableTitle')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(customer)}
              className="text-destructive focus:text-destructive"
            >
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
