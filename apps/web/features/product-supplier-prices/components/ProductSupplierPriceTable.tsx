'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import type { ProductSupplierPrice } from '../types';

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? '—' : n.toFixed(2);
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface ProductSupplierPriceTableProps {
  entries: ProductSupplierPrice[];
  onDelete: (entry: ProductSupplierPrice) => void;
}

export function ProductSupplierPriceTable({
  entries,
  onDelete,
}: ProductSupplierPriceTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('productSupplierPrices.product')}</TableHead>
            <TableHead>{t('productSupplierPrices.supplier')}</TableHead>
            <TableHead>{t('productSupplierPrices.buyingPrice')}</TableHead>
            <TableHead>{t('productSupplierPrices.currency')}</TableHead>
            <TableHead>{t('productSupplierPrices.lastUpdatedAt')}</TableHead>
            <TableHead>{t('productSupplierPrices.note')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                {t('productSupplierPrices.noEntries')}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/product-supplier-prices/${entry.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{entry.product.name}</p>
                    {entry.product.nameEn && (
                      <p className="text-xs text-muted-foreground">{entry.product.nameEn}</p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">
                      {entry.product.code}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{entry.supplier.name}</p>
                    {entry.supplier.phone && (
                      <p className="text-xs text-muted-foreground">{entry.supplier.phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatPrice(entry.buyingPrice)}
                </TableCell>
                <TableCell className="text-sm">{entry.currency || 'USD'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(entry.lastUpdatedAt)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                  {entry.note || '—'}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/product-supplier-prices/${entry.id}`}>
                          {t('productSupplierPrices.entryDetail')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/product-supplier-prices/${entry.id}/edit`}>
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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
