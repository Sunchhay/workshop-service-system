'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Expense } from '../../types';

interface VoidExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (voidReason: string) => Promise<void>;
  isLoading: boolean;
}

export function VoidExpenseDialog({
  expense,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: VoidExpenseDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  if (!expense) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason.trim());
    setReason('');
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setReason('');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('expenses.confirmVoidTitle')}</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{expense.expenseNo}</span>
            {' — '}
            {t('expenses.confirmVoidDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="void-reason">{t('expenses.voidReason')}</Label>
          <Textarea
            id="void-reason"
            placeholder={t('expenses.voidReasonPlaceholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('expenses.confirmVoidTitle')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
