'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CartItem, UpdateCartItemRequest } from '../../types';

const schema = z.object({
  machineModelId: z.string().optional(),
  unitPrice: z.string().min(1),
  quantity: z.string().min(1),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditCartItemDialogProps {
  item: CartItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: UpdateCartItemRequest) => Promise<void>;
  isLoading?: boolean;
}

export function EditCartItemDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: EditCartItemDialogProps) {
  const { t } = useTranslation();

  const { data: machineModelsData } = useGetMachineModelsQuery({
    status: 'ACTIVE',
    limit: 200,
  });
  const machineModels = machineModelsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { machineModelId: '__none', unitPrice: '', quantity: '1', note: '' },
  });

  useEffect(() => {
    if (open && item) {
      form.reset({
        machineModelId: item.machineModelId ?? '__none',
        unitPrice: String(item.unitPrice),
        quantity: String(item.quantity),
        note: item.note ?? '',
      });
    }
  }, [open, item, form]);

  const handleSubmit = async (data: FormValues) => {
    await onConfirm({
      machineModelId: data.machineModelId === '__none' ? undefined : data.machineModelId,
      unitPrice: parseFloat(data.unitPrice),
      quantity: parseFloat(data.quantity),
      note: data.note?.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cart.editItem')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="machineModelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.machineModel')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cart.noMachineModel')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none">{t('cart.noMachineModel')}</SelectItem>
                      {machineModels.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.modelName}
                          {m.brand ? ` · ${m.brand}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cart.unitPrice')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cart.quantity')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0.001" step="0.001" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.note')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('cart.notePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
