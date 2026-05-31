'use client';

import { ImageIcon, MoreHorizontal } from 'lucide-react';
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

import type { ProductPrice } from '../types';

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? '—' : n.toFixed(2);
}

interface ProductPriceTableProps {
  entries: ProductPrice[];
  onToggleStatus: (entry: ProductPrice) => void;
  onDelete: (entry: ProductPrice) => void;
}

export function ProductPriceTable({
  entries,
  onToggleStatus,
  onDelete,
}: ProductPriceTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">{t('productPrices.image')}</TableHead>
            <TableHead>{t('productPrices.product')}</TableHead>
            <TableHead>{t('productPrices.machineModel')}</TableHead>
            <TableHead>{t('productPrices.ownerPrice')}</TableHead>
            <TableHead>{t('productPrices.mechanicPrice')}</TableHead>
            <TableHead>{t('productPrices.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-10"
              >
                {t('productPrices.noEntries')}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/product-prices/${entry.id}`)}
              >
                {/* Image */}
                <TableCell>
                  {entry.imageUrl ? (
                    <img
                      src={entry.imageUrl}
                      alt={entry.product.name}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border bg-muted flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                {/* Product */}
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{entry.product.name}</p>
                    {entry.product.nameEn && (
                      <p className="text-xs text-muted-foreground">
                        {entry.product.nameEn}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">
                      {entry.product.code}
                    </p>
                  </div>
                </TableCell>
                {/* Machine Model */}
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {entry.machineModel.modelName}
                    </p>
                    {entry.machineModel.brand && (
                      <p className="text-xs text-muted-foreground">
                        {entry.machineModel.brand}
                      </p>
                    )}
                  </div>
                </TableCell>
                {/* Owner Price */}
                <TableCell className="font-mono text-sm">
                  {formatPrice(entry.ownerPrice)}
                </TableCell>
                {/* Mechanic Price */}
                <TableCell className="font-mono text-sm">
                  {formatPrice(entry.mechanicPrice)}
                </TableCell>
                {/* Status */}
                <TableCell>
                  <Badge
                    variant={entry.status === 'ACTIVE' ? 'default' : 'outline'}
                    className={
                      entry.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(
                      entry.status === 'ACTIVE'
                        ? 'common.active'
                        : 'common.inactive',
                    )}
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
                        <Link href={`/admin/product-prices/${entry.id}`}>
                          {t('productPrices.entryDetail')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/product-prices/${entry.id}/edit`}>
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(entry)}
                        className={
                          entry.status === 'ACTIVE'
                            ? 'text-destructive focus:text-destructive'
                            : 'text-green-600 focus:text-green-600'
                        }
                      >
                        {entry.status === 'ACTIVE'
                          ? t('productPrices.confirmDisableTitle')
                          : t('productPrices.confirmEnableTitle')}
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
