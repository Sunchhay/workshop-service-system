'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCustomerMutation } from '@/features/customers/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

interface QuickAddCustomerDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (customer: { id: string; name: string; phone: string }) => void;
}

export function QuickAddCustomerDialog({
  open,
  onOpenChange,
  onCreated,
}: QuickAddCustomerDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const result = await createCustomer({ name: name.trim(), phone: phone.trim() }).unwrap();
      onCreated({ id: result.data.id, name: result.data.name, phone: result.data.phone });
      setName('');
      setPhone('');
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('pos.quickAddCustomer')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('customers.name')} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('pos.customerNamePlaceholder')}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('pos.customerPhone')} *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('pos.customerPhonePlaceholder')}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {t('pos.addCustomer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
