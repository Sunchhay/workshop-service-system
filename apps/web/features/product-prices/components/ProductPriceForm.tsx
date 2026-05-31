'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Loader2 } from 'lucide-react';
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
import { useGetProductsQuery } from '@/features/products/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateProductPriceRequest, UpdateProductPriceRequest } from '../types';

const schema = z
  .object({
    productId: z.string().min(1),
    machineModelId: z.string().min(1),
    imageUrl: z.string().optional(),
    ownerPrice: z.string().optional(),
    mechanicPrice: z.string().optional(),
    note: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  })
  .superRefine((data, ctx) => {
    const owner = data.ownerPrice?.trim();
    const mechanic = data.mechanicPrice?.trim();
    if (!owner && !mechanic) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'atLeastOnePrice',
        path: ['ownerPrice'],
      });
    }
    if (owner) {
      const n = parseFloat(owner);
      if (isNaN(n) || n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'invalidPrice',
          path: ['ownerPrice'],
        });
      }
    }
    if (mechanic) {
      const n = parseFloat(mechanic);
      if (isNaN(n) || n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'invalidPrice',
          path: ['mechanicPrice'],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

interface ProductPriceFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateProductPriceRequest | UpdateProductPriceRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ProductPriceForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ProductPriceFormProps) {
  const { t } = useTranslation();

  const { data: productsData } = useGetProductsQuery({ limit: 200 });
  const { data: modelsData } = useGetMachineModelsQuery({ limit: 200 });

  const products = productsData?.data ?? [];
  const machineModels = modelsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: defaultValues?.productId ?? '',
      machineModelId: defaultValues?.machineModelId ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      ownerPrice: defaultValues?.ownerPrice ?? '',
      mechanicPrice: defaultValues?.mechanicPrice ?? '',
      note: defaultValues?.note ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
    },
  });

  const imageUrl = form.watch('imageUrl');

  const handleSubmit = async (data: FormValues) => {
    const ownerPriceNum = data.ownerPrice?.trim()
      ? parseFloat(data.ownerPrice.trim())
      : undefined;
    const mechanicPriceNum = data.mechanicPrice?.trim()
      ? parseFloat(data.mechanicPrice.trim())
      : undefined;

    const payload: CreateProductPriceRequest | UpdateProductPriceRequest = {
      productId: data.productId,
      machineModelId: data.machineModelId,
      imageUrl: data.imageUrl?.trim() || undefined,
      ownerPrice: ownerPriceNum,
      mechanicPrice: mechanicPriceNum,
      note: data.note?.trim() || undefined,
      status: data.status,
    };
    await onSubmit(payload);
  };

  const getPriceError = (msg: string | undefined) => {
    if (!msg) return undefined;
    if (msg === 'atLeastOnePrice') return t('productPrices.atLeastOnePrice');
    if (msg === 'invalidPrice') return t('productPrices.invalidPrice');
    return msg;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Product + Machine Model */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('productPrices.product')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('productPrices.selectProduct')} />
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
            name="machineModelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('productPrices.machineModel')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('productPrices.selectMachineModel')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

        {/* Owner Price + Mechanic Price */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="ownerPrice"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t('productPrices.ownerPrice')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {getPriceError(fieldState.error.message)}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mechanicPrice"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t('productPrices.mechanicPrice')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {getPriceError(fieldState.error.message)}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('productPrices.imageUrl')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('productPrices.imageUrlPlaceholder')}
                  {...field}
                />
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

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('productPrices.statusLabel')}</FormLabel>
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

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('productPrices.note')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('productPrices.notePlaceholder')}
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

        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('productPrices.createEntry') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
