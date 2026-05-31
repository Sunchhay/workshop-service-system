'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

interface VoidSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (voidReason: string) => Promise<void>;
  isLoading?: boolean;
}

export function VoidSaleDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: VoidSaleDialogProps) {
  const { t } = useTranslation();
  const [voidReason, setVoidReason] = useState('');
  const [error, setError] = useState('');

  const handleOpenChange = (val: boolean) => {
    if (!val) { setVoidReason(''); setError(''); }
    onOpenChange(val);
  };

  const handleConfirm = async () => {
    if (!voidReason.trim()) { setError(t('sales.voidReasonRequired')); return; }
    await onConfirm(voidReason.trim());
    setVoidReason('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('sales.confirmVoidTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('sales.confirmVoidDesc')}</p>
          <div className="space-y-1.5">
            <Label>
              {t('sales.voidReason')} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder={t('sales.voidReasonPlaceholder')}
              className="min-h-[80px] resize-none"
              value={voidReason}
              onChange={(e) => { setVoidReason(e.target.value); setError(''); }}
              disabled={isLoading}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30"
            variant="outline"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('sales.voidSale')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
