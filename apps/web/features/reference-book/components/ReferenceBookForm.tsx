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
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateReferenceBookRequest, UpdateReferenceBookRequest } from '../types';

const schema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  machineModelId: z.string().optional(),
  summary: z.string().optional(),
  imageUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type ReferenceBookFormValues = z.infer<typeof schema>;

interface ReferenceBookFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ReferenceBookFormValues>;
  onSubmit: (data: CreateReferenceBookRequest | UpdateReferenceBookRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ReferenceBookForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ReferenceBookFormProps) {
  const { t } = useTranslation();

  const { data: machineModelsData } = useGetMachineModelsQuery({ status: 'ACTIVE', limit: 200 });
  const machineModels = machineModelsData?.data ?? [];

  const form = useForm<ReferenceBookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      category: defaultValues?.category ?? '',
      machineModelId: defaultValues?.machineModelId ?? '__none',
      summary: defaultValues?.summary ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      fileUrl: defaultValues?.fileUrl ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
    },
  });

  const imageUrl = form.watch('imageUrl');

  const handleSubmit = async (data: ReferenceBookFormValues) => {
    const payload: CreateReferenceBookRequest | UpdateReferenceBookRequest = {
      title: data.title,
      category: data.category?.trim() || undefined,
      machineModelId: data.machineModelId === '__none' ? null : data.machineModelId || undefined,
      summary: data.summary?.trim() || undefined,
      imageUrl: data.imageUrl?.trim() || undefined,
      fileUrl: data.fileUrl?.trim() || undefined,
      status: data.status,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('referenceBook.title_field')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('referenceBook.titlePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category + Machine Model */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.category')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('referenceBook.categoryPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="machineModelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.machineModel')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('referenceBook.noMachineModel')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none">{t('referenceBook.noMachineModel')}</SelectItem>
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
        </div>

        {/* Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('referenceBook.summary')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('referenceBook.summaryPlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('referenceBook.imageUrl')}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
              {imageUrl?.trim() && (
                <div className="mt-2 w-24 h-24 rounded-lg border overflow-hidden bg-muted">
                  <img
                    src={imageUrl.trim()}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        {/* File URL */}
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('referenceBook.fileUrl')}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('referenceBook.statusLabel')}</FormLabel>
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

        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('referenceBook.createRecord') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
