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
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ReferenceBookItem } from '../../types';

const schema = z.object({
  label: z.string().min(1),
  value: z.string().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
  sortOrder: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ReferenceBookItem | null;
  onConfirm: (data: {
    label: string;
    value?: string;
    unit?: string;
    note?: string;
    sortOrder?: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function ItemDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading,
}: ItemDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!item;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { label: '', value: '', unit: '', note: '', sortOrder: '' },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        label: item?.label ?? '',
        value: item?.value ?? '',
        unit: item?.unit ?? '',
        note: item?.note ?? '',
        sortOrder: item?.sortOrder != null ? String(item.sortOrder) : '',
      });
    }
  }, [open, item, form]);

  const handleSubmit = async (data: FormValues) => {
    const sortOrderNum = data.sortOrder?.trim() ? parseInt(data.sortOrder.trim(), 10) : undefined;
    await onConfirm({
      label: data.label,
      value: data.value?.trim() || undefined,
      unit: data.unit?.trim() || undefined,
      note: data.note?.trim() || undefined,
      sortOrder: sortOrderNum,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('referenceBook.editItem') : t('referenceBook.addItem')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('referenceBook.itemLabel')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('referenceBook.itemLabelPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('referenceBook.itemValue')}</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('referenceBook.itemUnit')}</FormLabel>
                    <FormControl>
                      <Input placeholder="mm" {...field} />
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
                  <FormLabel>{t('referenceBook.itemNote')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('referenceBook.itemNotePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('referenceBook.sortOrder')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
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
