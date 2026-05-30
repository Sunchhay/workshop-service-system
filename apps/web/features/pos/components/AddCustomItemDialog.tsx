'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { AddCartItemRequest } from '../types';

interface AddCustomItemDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (item: AddCartItemRequest) => void;
}

export function AddCustomItemDialog({ open, onOpenChange, onAdd }: AddCustomItemDialogProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const qty = parseFloat(quantity) || 1;
    const price = parseFloat(unitPrice) || 0;
    onAdd({
      type: 'CUSTOM',
      itemNameKh: description.trim(),
      description: description.trim(),
      quantity: qty,
      unitPrice: price,
      discountAmount: 0,
    });
    setDescription('');
    setUnitPrice('');
    setQuantity('1');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('pos.customItemTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('pos.customItemName')} *</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('pos.customItemNamePlaceholder')}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('pos.quantity')}</Label>
              <Input
                type="number"
                step="0.001"
                min="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('pos.unitPrice')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('pos.addItem')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
