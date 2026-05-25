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
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateMachineModelRequest, UpdateMachineModelRequest } from '../types';

const schema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  category: z.string(),
  description: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface MachineModelFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateMachineModelRequest | UpdateMachineModelRequest) => Promise<void>;
  isLoading?: boolean;
}

export function MachineModelForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: MachineModelFormProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: defaultValues?.brand ?? '',
      model: defaultValues?.model ?? '',
      category: defaultValues?.category ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateMachineModelRequest | UpdateMachineModelRequest = {
      brand: data.brand,
      model: data.model,
      category: data.category.trim() || undefined,
      description: data.description.trim() || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Brand + Model */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('machineModels.brand')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.brandPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('machineModels.model')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.modelPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('machineModels.category')}</FormLabel>
              <FormControl>
                <Input placeholder={t('machineModels.categoryPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('machineModels.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('machineModels.descriptionPlaceholder')}
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

        {/* Sticky save button on mobile */}
        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('machineModels.createModel') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
