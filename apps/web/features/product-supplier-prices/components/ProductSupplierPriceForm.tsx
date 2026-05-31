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
import { useGetProductsQuery } from '@/features/products/api';
import { useGetSuppliersQuery } from '@/features/suppliers/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type {
  CreateProductSupplierPriceRequest,
  UpdateProductSupplierPriceRequest,
} from '../types';

const schema = z.object({
  productId: z.string().min(1),
  supplierId: z.string().min(1),
  buyingPrice: z.string().min(1),
  currency: z.string().optional(),
  lastUpdatedAt: z.string().optional(),
  note: z.string().optional(),
});

export type ProductSupplierPriceFormValues = z.infer<typeof schema>;

interface ProductSupplierPriceFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ProductSupplierPriceFormValues>;
  onSubmit: (
    data: CreateProductSupplierPriceRequest | UpdateProductSupplierPriceRequest,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function ProductSupplierPriceForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ProductSupplierPriceFormProps) {
  const { t } = useTranslation();

  const { data: productsData } = useGetProductsQuery({ limit: 200 });
  const { data: suppliersData } = useGetSuppliersQuery({ limit: 200 });

  const products = productsData?.data ?? [];
  const suppliers = suppliersData?.data ?? [];

  const form = useForm<ProductSupplierPriceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: defaultValues?.productId ?? '',
      supplierId: defaultValues?.supplierId ?? '',
      buyingPrice: defaultValues?.buyingPrice ?? '',
      currency: defaultValues?.currency ?? 'USD',
      lastUpdatedAt: defaultValues?.lastUpdatedAt ?? '',
      note: defaultValues?.note ?? '',
    },
  });

  const handleSubmit = async (data: ProductSupplierPriceFormValues) => {
    const price = parseFloat(data.buyingPrice);
    const payload: CreateProductSupplierPriceRequest | UpdateProductSupplierPriceRequest = {
      productId: data.productId,
      supplierId: data.supplierId,
      buyingPrice: price,
      currency: data.currency?.trim() || 'USD',
      lastUpdatedAt: data.lastUpdatedAt?.trim() || undefined,
      note: data.note?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Product + Supplier */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('productSupplierPrices.product')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('productSupplierPrices.selectProduct')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                        {p.nameEn ? ` · ${p.nameEn}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('productSupplierPrices.supplier')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('productSupplierPrices.selectSupplier')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buying Price + Currency */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="buyingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('productSupplierPrices.buyingPrice')}{' '}
                  <span className="text-destructive">*</span>
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('productSupplierPrices.currency')}</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Last Updated At */}
        <FormField
          control={form.control}
          name="lastUpdatedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('productSupplierPrices.lastUpdatedAt')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('productSupplierPrices.note')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('productSupplierPrices.notePlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create'
              ? t('productSupplierPrices.createEntry')
              : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
