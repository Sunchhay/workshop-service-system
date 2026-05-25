'use client';

import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
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
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { SalesFormValues } from './SalesForm';

function ItemRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { t } = useTranslation();
  const { control, setValue, getValues } = useFormContext<SalesFormValues>();

  const productId = useWatch({ control, name: `items.${index}.productId` });
  const quantity = useWatch({ control, name: `items.${index}.quantity` });
  const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` });
  const itemDiscount = useWatch({ control, name: `items.${index}.discountAmount` });

  const { data: productsData } = useGetProductsQuery({ isActive: true, limit: 200 });
  const products = productsData?.data ?? [];

  const selectedProduct = products.find((p) => p.id === productId);
  const qtyNum = parseFloat(quantity) || 0;
  const stockNum = selectedProduct?.stockQuantity ?? Infinity;
  const isOverStock = qtyNum > stockNum;

  // Auto-fill description and unit price when product changes
  useEffect(() => {
    if (productId) {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const currentDesc = getValues(`items.${index}.description`);
        if (!currentDesc) {
          setValue(`items.${index}.description`, prod.name, { shouldValidate: false });
        }
        const currentPrice = getValues(`items.${index}.unitPrice`);
        if (!currentPrice || currentPrice === '0') {
          setValue(`items.${index}.unitPrice`, prod.sellingPrice, { shouldValidate: false });
        }
      }
    }
  }, [productId, products, index, setValue, getValues]);

  const raw = qtyNum * (parseFloat(unitPrice) || 0);
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

      {/* Product select */}
      <FormField
        control={control}
        name={`items.${index}.productId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">
              {t('sales.product')} <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Select
                value={field.value || '__none'}
                onValueChange={(v) => {
                  field.onChange(v === '__none' ? '' : v);
                  // Reset description and price when product changes
                  setValue(`items.${index}.description`, '', { shouldValidate: false });
                  setValue(`items.${index}.unitPrice`, '0', { shouldValidate: false });
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('sales.selectProduct')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">{t('sales.selectProduct')}</SelectItem>
                  {products.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      {t('sales.noProductsAvailable')}
                    </div>
                  ) : (
                    products.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        <span>{prod.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({prod.code}) · ${prod.sellingPrice} · {prod.stockQuantity} {prod.unit}
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stock available info */}
      {selectedProduct && (
        <p className={`text-xs ${isOverStock ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isOverStock && <AlertTriangle className="inline h-3 w-3 mr-1" />}
          {selectedProduct.stockQuantity} {selectedProduct.unit} {t('sales.availableStock')}
          {isOverStock && ` · ${t('sales.stockWarning')}`}
        </p>
      )}

      {/* Description */}
      <FormField
        control={control}
        name={`items.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">{t('sales.description')}</FormLabel>
            <FormControl>
              <Input className="h-9" placeholder={t('sales.itemDescPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Qty + Price + Discount */}
      <div className="grid grid-cols-3 gap-2">
        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('sales.quantity')}</FormLabel>
              <FormControl>
                <Input
                  className={`h-9 ${isOverStock ? 'border-destructive' : ''}`}
                  type="number"
                  step="0.001"
                  min="0.001"
                  {...field}
                />
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
              <FormLabel className="text-xs">{t('sales.unitPrice')}</FormLabel>
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
              <FormLabel className="text-xs">{t('sales.itemDiscount')}</FormLabel>
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
        <span className="text-muted-foreground text-xs mr-2">{t('sales.totalPrice')}:</span>
        <span className="font-mono">${lineTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function SalesItemSection() {
  const { t } = useTranslation();
  const { control } = useFormContext<SalesFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const addItem = () => {
    append({
      productId: '',
      description: '',
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
        {t('sales.addItem')}
      </Button>
    </div>
  );
}
