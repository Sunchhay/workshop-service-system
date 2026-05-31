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

import type { Supplier } from '../types';

interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleStatus: (supplier: Supplier) => void;
}

export function SupplierTable({ suppliers, onToggleStatus }: SupplierTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">{t('suppliers.imageUrl')}</TableHead>
            <TableHead>{t('suppliers.name')}</TableHead>
            <TableHead>{t('suppliers.phone')}</TableHead>
            <TableHead>{t('suppliers.note')}</TableHead>
            <TableHead>{t('suppliers.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                {t('suppliers.noSuppliers')}
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
              >
                <TableCell>
                  {supplier.imageUrl ? (
                    <img
                      src={supplier.imageUrl}
                      alt={supplier.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{supplier.name}</p>
                </TableCell>
                <TableCell>
                  <p className="text-muted-foreground">{supplier.phone ?? '—'}</p>
                </TableCell>
                <TableCell>
                  <p className="text-muted-foreground text-sm truncate max-w-48">
                    {supplier.note ?? '—'}
                  </p>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
