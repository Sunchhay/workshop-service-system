'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Cart, UpdateCartItemRequest, UpdateCartRequest } from '../types';
import { PosInvoicePanel } from './PosInvoicePanel';

interface MobileInvoiceBarProps {
  cart: Cart;
  onPatchCart: (patch: Partial<UpdateCartRequest>) => void;
  onUpdateItem: (itemId: string, patch: Partial<UpdateCartItemRequest>) => void;
  onRemoveItem: (itemId: string) => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

export function MobileInvoiceBar({
  cart,
  onPatchCart,
  onUpdateItem,
  onRemoveItem,
  saveStatus,
}: MobileInvoiceBarProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const validItems = (cart.items ?? []).filter(
    (item) => !!item && typeof item === 'object' && !Array.isArray(item),
  );
  const cartDiscount = parseFloat(String(cart.discountAmount)) || 0;
  const subtotal = validItems.reduce((sum, item) => {
    const qty = Number(item.quantity);
    const price = Number(item.unitPrice);
    const discount = Number(item.discountAmount);
    const safe = Number.isFinite(qty) && Number.isFinite(price) && Number.isFinite(discount);
    return sum + (safe ? Math.max(0, qty * price - discount) : 0);
  }, 0);
  const actualTotal = Math.max(0, subtotal - cartDiscount);

  return (
    <>
      {/* Sticky bar above mobile bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 z-30 md:hidden bg-background border-t shadow-lg px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ShoppingCart className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate">
            {validItems.length} {t('pos.itemsCount')}
          </span>
        </div>
        <span className="font-mono font-bold text-base shrink-0">${actualTotal.toFixed(2)}</span>
        <Button size="sm" onClick={() => setOpen(true)}>
          {t('pos.reviewCart')}
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[90vh] flex flex-col">
          <SheetHeader className="shrink-0 pb-3 border-b">
            <SheetTitle>{t('pos.title')}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden py-3">
            <PosInvoicePanel
              cart={cart}
              onPatchCart={onPatchCart}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              saveStatus={saveStatus}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
