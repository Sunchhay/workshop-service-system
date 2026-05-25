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

import type { CreateProductRequest, UpdateProductRequest } from '../types';

const productSchema = z.object({
  name: z.string().min(1),
  brand: z.string(),
  componentPartType: z.string(),
  size: z.string(),
  supplier: z.string(),
  category: z.string(),
  unit: z.string(),
  costPrice: z.string().min(1),
  sellingPrice: z.string().min(1),
  stockQuantity: z.string(),
  reorderLevel: z.string(),
  linkedReferenceBookId: z.string(),
  description: z.string(),
}).superRefine((data, ctx) => {
  const cost = parseFloat(data.costPrice);
  if (isNaN(cost) || cost < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'priceInvalid',
      path: ['costPrice'],
    });
  }
  const sell = parseFloat(data.sellingPrice);
  if (isNaN(sell) || sell < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'priceInvalid',
      path: ['sellingPrice'],
    });
  }
  if (data.stockQuantity) {
    const qty = parseInt(data.stockQuantity, 10);
    if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'stockInvalid',
        path: ['stockQuantity'],
      });
    }
  }
  if (data.reorderLevel) {
    const lvl = parseInt(data.reorderLevel, 10);
    if (isNaN(lvl) || lvl < 0 || !Number.isInteger(lvl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'reorderLevelInvalid',
        path: ['reorderLevel'],
      });
    }
  }
});

type FormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      brand: defaultValues?.brand ?? '',
      componentPartType: defaultValues?.componentPartType ?? '',
      size: defaultValues?.size ?? '',
      supplier: defaultValues?.supplier ?? '',
      category: defaultValues?.category ?? '',
      unit: defaultValues?.unit ?? 'piece',
      costPrice: defaultValues?.costPrice ?? '',
      sellingPrice: defaultValues?.sellingPrice ?? '',
      stockQuantity: defaultValues?.stockQuantity ?? '0',
      reorderLevel: defaultValues?.reorderLevel ?? '0',
      linkedReferenceBookId: defaultValues?.linkedReferenceBookId ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateProductRequest | UpdateProductRequest = {
      name: data.name,
      brand: data.brand || undefined,
      componentPartType: data.componentPartType || undefined,
      size: data.size || undefined,
      supplier: data.supplier || undefined,
      category: data.category || undefined,
      unit: data.unit || 'piece',
      costPrice: parseFloat(data.costPrice),
      sellingPrice: parseFloat(data.sellingPrice),
      stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity, 10) : 0,
      reorderLevel: data.reorderLevel ? parseInt(data.reorderLevel, 10) : 0,
      linkedReferenceBookId: data.linkedReferenceBookId || undefined,
      description: data.description || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Row 1: Name (full width) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('products.name')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('products.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 2: Brand + Part type */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.brand')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('products.brandPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="componentPartType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.componentPartType')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('products.partTypePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Size + Unit */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.size')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('products.sizePlaceholder')} {...field} />
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
                <FormLabel>{t('products.unit')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('products.unitPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Category + Supplier */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.category')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('products.categoryPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.supplier')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('products.supplierPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Cost price + Selling price */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('products.costPrice')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t('products.costPricePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('products.sellingPrice')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t('products.sellingPricePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 6: Stock quantity + Reorder level */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.stockQuantity')}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('products.reorderLevel')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder={t('products.reorderLevelPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 7: Linked reference book ID */}
        <FormField
          control={form.control}
          name="linkedReferenceBookId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('products.linkedReferenceBook')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('products.refBookPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 8: Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('products.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('products.descriptionPlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sticky save button */}
        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('products.createProduct') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
