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

import type { Supplier } from '../types';

interface SupplierMobileCardProps {
  supplier: Supplier;
  onToggleStatus: (supplier: Supplier) => void;
}

export function SupplierMobileCard({ supplier, onToggleStatus }: SupplierMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const initials = supplier.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/suppliers/${supplier.id}`);
      }}
    >
      {/* Avatar */}
      {supplier.imageUrl ? (
        <img
          src={supplier.imageUrl}
          alt={supplier.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {initials}
        </div>
      )}

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <span className="font-medium text-sm">{supplier.name}</span>
        {supplier.phone && (
          <p className="text-xs text-muted-foreground mt-0.5">{supplier.phone}</p>
        )}
        {supplier.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{supplier.note}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge
            variant={supplier.status === 'ACTIVE' ? 'default' : 'outline'}
            className={
              supplier.status === 'ACTIVE'
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(supplier.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
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
              <Link href={`/admin/suppliers/${supplier.id}`}>
                {t('suppliers.supplierDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(supplier)}
              className={
                supplier.status === 'ACTIVE'
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {supplier.status === 'ACTIVE'
                ? t('suppliers.confirmDisableTitle')
                : t('suppliers.confirmEnableTitle')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
