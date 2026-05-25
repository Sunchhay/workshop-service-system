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
import { Textarea } from '@/components/ui/textarea';
import { useGetServicesQuery } from '@/features/services/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useSuggestPriceCatalogQuery } from '@/features/price-catalog/api';
import type { ServiceJobFormValues } from './ServiceJobForm';

function ItemRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext<ServiceJobFormValues>();
  const { control, setValue, getValues } = form;

  const itemType = useWatch({ control, name: `items.${index}.type` });
  const serviceId = useWatch({ control, name: `items.${index}.serviceId` });
  const quantity = useWatch({ control, name: `items.${index}.quantity` });
  const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` });

  const { data: servicesData } = useGetServicesQuery({ isActive: true, limit: 100 });
  const services = servicesData?.data ?? [];

  const { data: priceCatalogData } = useSuggestPriceCatalogQuery(
    { serviceId: serviceId ?? '' },
    { skip: !serviceId || itemType !== 'SERVICE' },
  );
  const priceCatalogs = priceCatalogData?.data ?? [];

  // Auto-fill description from service name
  useEffect(() => {
    if (itemType === 'SERVICE' && serviceId) {
      const svc = services.find((s) => s.id === serviceId);
      if (svc) {
        const current = getValues(`items.${index}.description`);
        if (!current || current === '') {
          setValue(`items.${index}.description`, svc.nameEn, { shouldValidate: false });
        }
      }
    }
  }, [serviceId, itemType, services, index, setValue, getValues]);

  const totalPrice =
    (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);

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

      {/* Type + Service */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          control={control}
          name={`items.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('serviceJobs.itemType')}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICE">{t('itemTypes.SERVICE')}</SelectItem>
                    <SelectItem value="CUSTOM">{t('itemTypes.CUSTOM')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {itemType === 'SERVICE' && (
          <FormField
            control={control}
            name={`items.${index}.serviceId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t('serviceJobs.service')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ?? '__none'}
                    onValueChange={(v) => {
                      field.onChange(v === '__none' ? '' : v);
                      setValue(`items.${index}.priceCatalogId`, '');
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t('serviceJobs.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">—</SelectItem>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nameEn}
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
      </div>

      {/* Price catalog (when service selected + catalog available) */}
      {itemType === 'SERVICE' && serviceId && priceCatalogs.length > 0 && (
        <FormField
          control={control}
          name={`items.${index}.priceCatalogId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('serviceJobs.priceCatalog')}</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? '__none'}
                  onValueChange={(v) => {
                    const selected = priceCatalogs.find((pc) => pc.id === v);
                    field.onChange(v === '__none' ? '' : v);
                    if (selected) {
                      setValue(`items.${index}.unitPrice`, selected.unitPrice, {
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t('serviceJobs.selectPriceTier')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {priceCatalogs.map((pc) => (
                      <SelectItem key={pc.id} value={pc.id}>
                        {pc.label} — ${parseFloat(pc.unitPrice).toFixed(2)}
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
              {t('serviceJobs.description')} <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className="h-9"
                placeholder={t('serviceJobs.itemDescPlaceholder')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Qty + Unit Price */}
      <div className="grid grid-cols-3 gap-3">
        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t('serviceJobs.quantity')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  min="0.001"
                  className="h-9"
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
              <FormLabel className="text-xs">{t('serviceJobs.unitPrice')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="h-9"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p className="text-xs font-medium mb-2">{t('serviceJobs.totalPrice')}</p>
          <p className="font-mono text-sm h-9 flex items-center">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Measurement */}
      <FormField
        control={control}
        name={`items.${index}.measurement`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">{t('serviceJobs.measurement')}</FormLabel>
            <FormControl>
              <Input
                className="h-9"
                placeholder={t('serviceJobs.measurementPlaceholder')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Item notes */}
      <FormField
        control={control}
        name={`items.${index}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">{t('serviceJobs.itemNotes')}</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[56px] resize-none text-sm"
                placeholder={t('serviceJobs.notesPlaceholder')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function ServiceJobItemSection() {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control } = useFormContext<ServiceJobFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t('serviceJobs.items')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              type: 'SERVICE',
              serviceId: '',
              priceCatalogId: '',
              description: '',
              quantity: '1',
              unitPrice: '0',
              measurement: '',
              notes: '',
            })
          }
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t('serviceJobs.addItem')}
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
          {t('serviceJobs.noItems')}
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItemRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}
