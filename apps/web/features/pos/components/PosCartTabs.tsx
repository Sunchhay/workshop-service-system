'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { PosCart } from '../types';

interface PosCartTabsProps {
  carts: PosCart[];
  activeCartId: string | null;
  onSelectCart: (id: string) => void;
  onCreateCart: () => Promise<unknown>;
  onDeleteCart: (id: string) => Promise<void>;
}

export function PosCartTabs({
  carts,
  activeCartId,
  onSelectCart,
  onCreateCart,
  onDeleteCart,
}: PosCartTabsProps) {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await onCreateCart();
    } catch {
      toast.error(t('common.error'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await onDeleteCart(deleteId);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 shrink-0">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className={cn(
              'flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-colors border',
              cart.id === activeCartId
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted border-transparent hover:border-border',
            )}
            onClick={() => onSelectCart(cart.id)}
          >
            <span className="max-w-[100px] truncate font-medium">{cart.cartName}</span>
            {cart.items?.length > 0 && (
              <span
                className={cn(
                  'text-[10px] rounded-full px-1.5 py-0.5 font-mono',
                  cart.id === activeCartId ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary',
                )}
              >
                {cart.items.length}
              </span>
            )}
            {carts.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(cart.id);
                }}
                className={cn(
                  'rounded hover:bg-black/10 p-0.5',
                  cart.id === activeCartId ? 'text-primary-foreground/70' : 'text-muted-foreground',
                )}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCreate}
          disabled={creating}
          className="shrink-0 h-8 px-2"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t('pos.newCart')}
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pos.deleteCart')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pos.noCartDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
