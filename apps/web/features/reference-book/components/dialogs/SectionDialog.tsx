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
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ReferenceBookSection } from '../../types';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: ReferenceBookSection | null;
  onConfirm: (data: { name: string; description?: string; sortOrder?: number }) => Promise<void>;
  isLoading?: boolean;
}

export function SectionDialog({
  open,
  onOpenChange,
  section,
  onConfirm,
  isLoading,
}: SectionDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!section;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', sortOrder: '' },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: section?.name ?? '',
        description: section?.description ?? '',
        sortOrder: section?.sortOrder != null ? String(section.sortOrder) : '',
      });
    }
  }, [open, section, form]);

  const handleSubmit = async (data: FormValues) => {
    const sortOrderNum = data.sortOrder?.trim() ? parseInt(data.sortOrder.trim(), 10) : undefined;
    await onConfirm({
      name: data.name,
      description: data.description?.trim() || undefined,
      sortOrder: sortOrderNum,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('referenceBook.editSection') : t('referenceBook.addSection')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('referenceBook.sectionName')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('referenceBook.sectionNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('referenceBook.sectionDescription')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('referenceBook.sectionDescriptionPlaceholder')}
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
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
