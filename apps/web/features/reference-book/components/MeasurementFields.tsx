'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n/TranslationContext';

export function MeasurementFields() {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, register, formState: { errors } } = useFormContext<any>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'measurementDetails',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t('referenceBook.measurementDetails')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ label: '', value: '', unit: 'mm' })}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t('referenceBook.addMeasurement')}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          {t('referenceBook.noMeasurements')}
        </p>
      ) : (
        <div className="space-y-2">
          {/* Header row — desktop only */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_80px_36px] gap-2 px-1">
            <p className="text-xs text-muted-foreground">{t('referenceBook.measureLabel')}</p>
            <p className="text-xs text-muted-foreground">{t('referenceBook.measureValue')}</p>
            <p className="text-xs text-muted-foreground">{t('referenceBook.measureUnit')}</p>
            <span />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_36px] sm:grid-cols-[1fr_1fr_80px_36px] gap-2 items-start"
            >
              {/* Mobile: label + value stacked */}
              <div className="sm:contents space-y-2 sm:space-y-0">
                <Input
                  placeholder={t('referenceBook.measureLabel')}
                  {...register(`measurementDetails.${index}.label`)}
                />
                <Input
                  placeholder={t('referenceBook.measureValue')}
                  {...register(`measurementDetails.${index}.value`)}
                  className="sm:block"
                />
                <Input
                  placeholder="mm"
                  {...register(`measurementDetails.${index}.unit`)}
                  className="sm:block"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-destructive shrink-0 mt-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Show top-level error for measurement array if any */}
      {errors.measurementDetails && (
        <p className="text-xs text-destructive">
          {String((errors.measurementDetails as { message?: string })?.message ?? '')}
        </p>
      )}
    </div>
  );
}
