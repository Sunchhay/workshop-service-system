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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

function formatSizeRange(sizeFrom: string | null, sizeTo: string | null): string {
  if (!sizeFrom && !sizeTo) return '—';
  const from = sizeFrom ? parseFloat(sizeFrom).toString() : '?';
  const to = sizeTo ? parseFloat(sizeTo).toString() : '∞';
  return `${from} – ${to}`;
}

interface PriceCatalogTableProps {
  entries: PriceCatalog[];
  onToggleStatus: (entry: PriceCatalog) => void;
  onDelete: (entry: PriceCatalog) => void;
}

export function PriceCatalogTable({
  entries,
  onToggleStatus,
  onDelete,
}: PriceCatalogTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('priceCatalog.service')}</TableHead>
            <TableHead>{t('priceCatalog.label')}</TableHead>
            <TableHead>{t('priceCatalog.sizeRange')}</TableHead>
            <TableHead>{t('priceCatalog.difficultyLevel')}</TableHead>
            <TableHead>{t('priceCatalog.customerType')}</TableHead>
            <TableHead>{t('priceCatalog.unitPrice')}</TableHead>
            <TableHead>{t('priceCatalog.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                {t('priceCatalog.noEntries')}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/price-catalog/${entry.id}`)}
              >
                {/* Service */}
                <TableCell>
                  <div>
                    <p className="font-medium">{entry.service.nameEn}</p>
                    <p className="text-xs text-muted-foreground font-mono">{entry.service.code}</p>
                  </div>
                </TableCell>
                {/* Label */}
                <TableCell>
                  <p className="text-sm max-w-[200px] truncate">{entry.label}</p>
                </TableCell>
                {/* Size range */}
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {formatSizeRange(entry.sizeFrom, entry.sizeTo)}
                  {entry.unit && <span className="ml-1 text-xs">{entry.unit}</span>}
                </TableCell>
                {/* Difficulty */}
                <TableCell>
                  <Badge variant="outline" className={difficultyClass[entry.difficultyLevel]}>
                    {t(`difficultyLevels.${entry.difficultyLevel}`)}
                  </Badge>
                </TableCell>
                {/* Customer type */}
                <TableCell>
                  {entry.customerType ? (
                    <Badge variant="outline" className={customerTypeClass[entry.customerType]}>
                      {t(`customerTypes.${entry.customerType}`)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {t('priceCatalog.allCustomerTypes')}
                    </span>
                  )}
                </TableCell>
                {/* Price */}
                <TableCell className="font-mono text-sm">
                  {parseFloat(entry.unitPrice).toFixed(2)}{' '}
                  <span className="text-muted-foreground text-xs">{entry.currency}</span>
                </TableCell>
                {/* Status */}
                <TableCell>
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
                </TableCell>
                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
