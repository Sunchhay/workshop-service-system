'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import type { Cart, CartStatus } from '../types';

const statusClass: Record<CartStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CHECKED_OUT: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
};

function formatCurrency(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

interface CartTableProps {
  carts: Cart[];
  onDiscard: (cart: Cart) => void;
}

export function CartTable({ carts, onDiscard }: CartTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (carts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
        {t('cart.noCarts')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('cart.customer')}</TableHead>
            <TableHead>{t('cart.mechanic')}</TableHead>
            <TableHead className="text-right">{t('cart.itemsCount')}</TableHead>
            <TableHead className="text-right">{t('cart.grandTotal')}</TableHead>
            <TableHead>{t('cart.status')}</TableHead>
            <TableHead>{t('cart.createdAt')}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((cart) => {
            const total = (cart.items ?? []).reduce(
              (sum, item) => sum + parseFloat(String(item.total)),
              0,
            );
            return (
              <TableRow
                key={cart.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/carts/${cart.id}`)}
              >
                <TableCell>
                  {cart.customer ? (
                    <>
                      <p className="font-medium text-sm">{cart.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{cart.customer.phone}</p>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {cart.mechanic ? (
                    <p className="text-sm">{cart.mechanic.name}</p>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {(cart.items ?? []).length}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-medium">
                  ${formatCurrency(total)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[cart.status]}>
                    {t(`cartStatuses.${cart.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(cart.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  className="text-right"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/carts/${cart.id}`)}
                      >
                        {t('common.view')}
                      </DropdownMenuItem>
                      {cart.status === 'ACTIVE' && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDiscard(cart)}
                        >
                          {t('cart.discard')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
