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

import type { CustomerType, DifficultyLevel, PriceCatalog } from '../types';

const difficultyClass: Record<DifficultyLevel, string> = {
  NORMAL: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  DIFFICULT: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  SPECIAL: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const customerTypeClass: Record<CustomerType, string> = {
  NORMAL: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  VIP: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400',
  WHOLESALE: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTNER: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

function formatSizeRange(sizeFrom: string | null, sizeTo: string | null, unit: string | null): string | null {
  if (!sizeFrom && !sizeTo) return null;
  const from = sizeFrom ? parseFloat(sizeFrom).toString() : '?';
  const to = sizeTo ? parseFloat(sizeTo).toString() : '∞';
  return `${from} – ${to}${unit ? ` ${unit}` : ''}`;
}

interface PriceCatalogMobileCardProps {
  entry: PriceCatalog;
  onToggleStatus: (entry: PriceCatalog) => void;
  onDelete: (entry: PriceCatalog) => void;
}

export function PriceCatalogMobileCard({
  entry,
  onToggleStatus,
  onDelete,
}: PriceCatalogMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const sizeRange = formatSizeRange(entry.sizeFrom, entry.sizeTo, entry.unit);

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/price-catalog/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/price-catalog/${entry.id}`);
      }}
    >
      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{entry.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{entry.service.nameEn}</p>
        {sizeRange && (
          <p className="text-xs font-mono text-muted-foreground mt-0.5">{sizeRange}</p>
        )}
        <p className="text-sm font-mono mt-1">
          {parseFloat(entry.unitPrice).toFixed(2)}{' '}
          <span className="text-xs text-muted-foreground">{entry.currency}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="outline" className={difficultyClass[entry.difficultyLevel]}>
            {t(`difficultyLevels.${entry.difficultyLevel}`)}
          </Badge>
          {entry.customerType && (
            <Badge variant="outline" className={customerTypeClass[entry.customerType]}>
              {t(`customerTypes.${entry.customerType}`)}
            </Badge>
          )}
          <Badge
            variant={entry.isActive ? 'default' : 'outline'}
            className={
              entry.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(entry.isActive ? 'common.active' : 'common.inactive')}
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
              <Link href={`/admin/price-catalog/${entry.id}`}>
                {t('priceCatalog.entryDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/price-catalog/${entry.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(entry)}
              className={
                entry.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {entry.isActive
                ? t('priceCatalog.confirmDisableTitle')
                : t('priceCatalog.confirmEnableTitle')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(entry)}
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
