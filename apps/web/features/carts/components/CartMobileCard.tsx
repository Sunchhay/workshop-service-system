'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface CartMobileCardProps {
  cart: Cart;
  onDiscard: (cart: Cart) => void;
}

export function CartMobileCard({ cart, onDiscard }: CartMobileCardProps) {
  const { t } = useTranslation();

  const total = (cart.items ?? []).reduce(
    (sum, item) => sum + parseFloat(String(item.total)),
    0,
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/admin/carts/${cart.id}`} className="block p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {cart.customer ? (
                <>
                  <p className="font-semibold text-sm truncate">{cart.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{cart.customer.phone}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{t('cart.noCustomer')}</p>
              )}
              {cart.mechanic && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('cart.mechanic')}: {cart.mechanic.name}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{(cart.items ?? []).length} {t('cart.items')}</span>
                <span className="font-mono font-medium text-foreground">
                  ${formatCurrency(total)}
                </span>
              </div>
            </div>
            <div className="shrink-0" onClick={(e) => e.preventDefault()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/carts/${cart.id}`}>{t('common.view')}</Link>
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
            </div>
          </div>

          <div className="mt-3">
            <Badge variant="outline" className={statusClass[cart.status]}>
              {t(`cartStatuses.${cart.status}`)}
            </Badge>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
