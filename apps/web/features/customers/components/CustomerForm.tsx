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

import type {
  CreateCustomerRequest,
  CustomerType,
  UpdateCustomerRequest,
} from '../types';

const CUSTOMER_TYPES: CustomerType[] = ['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER'];

const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.union([z.string().email(), z.literal('')]),
  address: z.string(),
  customerType: z.enum(['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER']),
  notes: z.string(),
});

type FormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CustomerForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: CustomerFormProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      address: defaultValues?.address ?? '',
      customerType: defaultValues?.customerType ?? 'NORMAL',
      notes: defaultValues?.notes ?? '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateCustomerRequest | UpdateCustomerRequest = {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      address: data.address || undefined,
      customerType: data.customerType,
      notes: data.notes || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('customers.name')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('customers.namePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('customers.phone')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t('customers.phonePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('customers.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="off"
                    placeholder={t('customers.emailPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('customers.customerType')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`customerTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customers.address')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('customers.addressPlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customers.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('customers.notesPlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('customers.createCustomer') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
