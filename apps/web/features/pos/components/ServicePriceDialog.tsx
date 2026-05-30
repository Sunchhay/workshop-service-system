'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface ServiceRef {
  id?: string;
  nameKh?: string | null;
  nameEn?: string | null;
  code?: string;
}

interface ServicePriceDialogProps {
  service: ServiceRef | null;
  suggestedPrice?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (price: number) => void;
}

export function ServicePriceDialog({
  service,
  suggestedPrice,
  open,
  onOpenChange,
  onConfirm,
}: ServicePriceDialogProps) {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPrice(suggestedPrice != null ? suggestedPrice.toFixed(2) : '');
      setError('');
    }
  }, [open, suggestedPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(price);
    if (!Number.isFinite(val) || val <= 0) {
      setError('សូមបញ្ចូលតម្លៃសេវាកម្ម។');
      return;
    }
    onConfirm(val);
    onOpenChange(false);
  };

  const displayName = service?.nameKh ?? service?.nameEn ?? 'សេវាកម្ម';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">{displayName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="svc-price">តម្លៃសេវាកម្ម ($)</Label>
            <Input
              id="svc-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError('');
              }}
              placeholder="0.00"
              autoFocus
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            {suggestedPrice != null && (
              <p className="text-xs text-muted-foreground">
                តម្លៃណែនាំ: ${suggestedPrice.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              បោះបង់
            </Button>
            <Button type="submit" className="flex-1">
              បន្ថែម
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
