'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
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
import { Separator } from '@/components/ui/separator';
import { useGetProductsQuery } from '@/features/products/api';
import { useGetServicesQuery } from '@/features/services/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { getProductDisplayName, getServiceDisplayName } from '@/lib/display-name';

import type { InvoiceFormValues } from './InvoiceForm';

const ITEM_TYPES = ['SERVICE', 'PRODUCT', 'CUSTOM'] as const;

function ItemRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { t } = useTranslation();
  const form = useFormContext<InvoiceFormValues>();
  const { control, setValue, getValues } = form;

  const itemType = useWatch({ control, name: `items.${index}.type` });
  const serviceId = useWatch({ control, name: `items.${index}.serviceId` });
  const productId = useWatch({ control, name: `items.${index}.productId` });
  const quantity = useWatch({ control, name: `items.${index}.quantity` });
  const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` });
  const itemDiscount = useWatch({ control, name: `items.${index}.discountAmount` });

  const { data: servicesData } = useGetServicesQuery({ isActive: true, limit: 100 });
  const services = servicesData?.data ?? [];

  const { data: productsData } = useGetProductsQuery({ isActive: true, limit: 100 });
  const products = productsData?.data ?? [];

  // Auto-fill description + snapshot fields from service
  useEffect(() => {
    if (itemType === 'SERVICE' && serviceId) {
      const svc = services.find((s) => s.id === serviceId);
      if (svc) {
        const current = getValues(`items.${index}.description`);
        if (!current) setValue(`items.${index}.description`, getServiceDisplayName(svc), { shouldValidate: false });
        setValue(`items.${index}.itemCode`, svc.code, { shouldValidate: false });
        setValue(`items.${index}.itemNameKh`, svc.nameKh ?? '', { shouldValidate: false });
        setValue(`items.${index}.itemNameEn`, svc.nameEn, { shouldValidate: false });
      }
    }
  }, [serviceId, itemType, services, index, setValue, getValues]);

  // Auto-fill description + snapshot fields from product
  useEffect(() => {
    if (itemType === 'PRODUCT' && productId) {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const current = getValues(`items.${index}.description`);
        if (!current) setValue(`items.${index}.description`, getProductDisplayName(prod), { shouldValidate: false });
        const currentPrice = getValues(`items.${index}.unitPrice`);
        if (!currentPrice) setValue(`items.${index}.unitPrice`, prod.sellingPrice, { shouldValidate: false });
        setValue(`items.${index}.itemCode`, prod.code, { shouldValidate: false });
        setValue(`items.${index}.itemNameKh`, prod.nameKh ?? prod.name, { shouldValidate: false });
        setValue(`items.${index}.itemNameEn`, prod.nameEn ?? '', { shouldValidate: false });
      }
    }
  }, [productId, itemType, products, index, setValue, getValues]);

  const raw = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);
  const discountVal = parseFloat(itemDiscount) || 0;
  const lineTotal = Math.max(0, raw - discountVal);

  return (
    <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Type select */}
      <FormField
        control={control}
        name={`items.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">{t('invoices.itemType')}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  setValue(`items.${index}.serviceId`, '', { shouldValidate: false });
                  setValue(`items.${index}.productId`, '', { shouldValidate: false });
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map((t_) => (
                    <SelectItem key={t_} value={t_}>
                      {t(`itemTypes.${t_}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Service select */}
      {itemType === 'SERVICE' && (
        <FormField
          control={control}
          name={`items.${index}.serviceId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('invoices.service')}</FormLabel>
              <FormControl>
                <Select value={field.value || '__none'} onValueChange={(v) => field.onChange(v === '__none' ? '' : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t('invoices.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">{t('invoices.selectService')}</SelectItem>
                    {services.map((svc) => (
                      <SelectItem key={svc.id} value={svc.id}>
                        {getServiceDisplayName(svc)}
                        {svc.nameKh && <span className="text-muted-foreground ml-1 text-xs">({svc.code})</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Product select */}
      {itemType === 'PRODUCT' && (
        <FormField
          control={control}
          name={`items.${index}.productId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('invoices.product')}</FormLabel>
              <FormControl>
                <Select value={field.value || '__none'} onValueChange={(v) => field.onChange(v === '__none' ? '' : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t('invoices.selectProduct')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">{t('invoices.selectProduct')}</SelectItem>
                    {products.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {getProductDisplayName(prod)}
                        <span className="text-muted-foreground ml-1 text-xs">({prod.code})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Description */}
      <FormField
        control={control}
        name={`items.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">
              {t('invoices.description')} <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input className="h-9" placeholder={t('invoices.itemDescPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Qty + Unit price + Discount */}
      <div className="grid grid-cols-3 gap-2">
        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('invoices.quantity')}</FormLabel>
              <FormControl>
                <Input className="h-9" type="number" step="0.001" min="0.001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.unitPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('invoices.unitPrice')}</FormLabel>
              <FormControl>
                <Input className="h-9" type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.discountAmount`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('invoices.itemDiscount')}</FormLabel>
              <FormControl>
                <Input className="h-9" type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Line total */}
      <div className="flex justify-end text-sm font-medium">
        <span className="text-muted-foreground text-xs mr-2">{t('invoices.totalPrice')}:</span>
        <span className="font-mono">${lineTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function InvoiceItemSection() {
  const { t } = useTranslation();
  const { control } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const addItem = () => {
    append({
      type: 'SERVICE',
      serviceId: '',
      productId: '',
      description: '',
      itemCode: '',
      itemNameKh: '',
      itemNameEn: '',
      quantity: '1',
      unitPrice: '0',
      discountAmount: '0',
    });
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <ItemRow key={field.id} index={index} onRemove={() => remove(index)} />
      ))}

      {fields.length > 0 && <Separator />}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        {t('invoices.addItem')}
      </Button>
    </div>
  );
}
