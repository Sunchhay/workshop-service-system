'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateExpenseRequest, ExpenseCategory, ExpensePaymentMethod, UpdateExpenseRequest } from '../types';

const CATEGORIES: ExpenseCategory[] = ['SUPPLIES', 'UTILITIES', 'RENT', 'SALARY', 'MAINTENANCE', 'OTHER'];
const METHODS: ExpensePaymentMethod[] = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];

const expenseSchema = z.object({
  category: z.enum(['SUPPLIES', 'UTILITIES', 'RENT', 'SALARY', 'MAINTENANCE', 'OTHER']),
  description: z.string().min(1, 'descriptionRequired'),
  amount: z.string().refine((v) => parseFloat(v) > 0, 'amountInvalid'),
  method: z.enum(['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER']),
  expenseDate: z.string().min(1, 'expenseDateRequired'),
  referenceNo: z.string(),
  notes: z.string(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Props {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ExpenseFormValues>;
  onSubmit: (data: CreateExpenseRequest | UpdateExpenseRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ExpenseForm({ mode, defaultValues, onSubmit, isLoading }: Props) {
  const { t } = useTranslation();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: defaultValues?.category ?? 'OTHER',
      description: defaultValues?.description ?? '',
      amount: defaultValues?.amount ?? '',
      method: defaultValues?.method ?? 'CASH',
      expenseDate: defaultValues?.expenseDate ?? new Date().toISOString().slice(0, 10),
      referenceNo: defaultValues?.referenceNo ?? '',
      notes: defaultValues?.notes ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      category: values.category as ExpenseCategory,
      description: values.description,
      amount: parseFloat(values.amount),
      method: values.method as ExpensePaymentMethod,
      expenseDate: values.expenseDate,
      referenceNo: values.referenceNo || undefined,
      notes: values.notes || undefined,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description — full width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('expenses.description')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.descriptionPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category + Method */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.category')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{t(`expenseCategories.${c}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.method')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {METHODS.map((m) => (
                        <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.amount')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.expenseDate')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Reference No */}
        <FormField
          control={form.control}
          name="referenceNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.referenceNo')}</FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.referenceNoPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('expenses.notesPlaceholder')}
                  className="min-h-[70px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sticky save button — mobile bottom, desktop inline */}
        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('expenses.createExpense') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
