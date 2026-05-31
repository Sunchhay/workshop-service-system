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

import type { CreateMachineModelRequest, UpdateMachineModelRequest } from '../types';

const schema = z.object({
  code: z.string().min(1),
  modelName: z.string().min(1),
  brand: z.string().optional(),
  machineType: z.string().optional(),
  year: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
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
      code: defaultValues?.code ?? '',
      modelName: defaultValues?.modelName ?? '',
      brand: defaultValues?.brand ?? '',
      machineType: defaultValues?.machineType ?? '',
      year: defaultValues?.year ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      description: defaultValues?.description ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateMachineModelRequest | UpdateMachineModelRequest = {
      code: data.code,
      modelName: data.modelName,
      brand: data.brand?.trim() || undefined,
      machineType: data.machineType?.trim() || undefined,
      year: data.year?.trim() || undefined,
      imageUrl: data.imageUrl?.trim() || undefined,
      description: data.description?.trim() || undefined,
      status: data.status,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Code + Model Name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('machineModels.code')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.codePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('machineModels.modelName')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.modelNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Brand + Machine Type */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('machineModels.brand')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.brandPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="machineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('machineModels.machineType')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.machineTypePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Year + Image URL */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('machineModels.year')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.yearPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('machineModels.imageUrl')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('machineModels.imageUrlPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('machineModels.statusLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t('common.active')}</SelectItem>
                  <SelectItem value="INACTIVE">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>
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
