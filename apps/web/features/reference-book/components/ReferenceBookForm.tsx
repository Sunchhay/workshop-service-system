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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type {
  CreateReferenceBookRequest,
  ReferenceSourceType,
  UpdateReferenceBookRequest,
  VerificationStatus,
} from '../types';
import { MeasurementFields } from './MeasurementFields';

const SOURCE_TYPES: ReferenceSourceType[] = [
  'MOM_NOTEBOOK',
  'SUPPLIER_INFO',
  'REAL_MEASUREMENT',
  'SERVICE_HISTORY',
  'SERVICE_MANUAL',
  'OTHER',
];

const VERIFICATION_STATUSES: VerificationStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'VERIFIED',
  'OLD_DATA',
];

const measurementSchema = z.object({
  label: z.string(),
  value: z.string(),
  unit: z.string(),
});

const schema = z.object({
  machineModelId: z.string(), // '__none' sentinel means null
  componentType: z.string(),
  partName: z.string().min(1),
  partCode: z.string(),
  standardSize: z.string(),
  wearLimit: z.string(),
  serviceLimit: z.string(),
  unit: z.string(),
  measurementDetails: z.array(measurementSchema),
  sourceType: z.enum(['MOM_NOTEBOOK', 'SUPPLIER_INFO', 'REAL_MEASUREMENT', 'SERVICE_HISTORY', 'SERVICE_MANUAL', 'OTHER']),
  verificationStatus: z.enum(['DRAFT', 'PENDING_REVIEW', 'VERIFIED', 'OLD_DATA']),
  notes: z.string(),
});

export type ReferenceBookFormValues = z.infer<typeof schema>;

interface ReferenceBookFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ReferenceBookFormValues>;
  onSubmit: (data: CreateReferenceBookRequest | UpdateReferenceBookRequest) => Promise<void>;
  isLoading?: boolean;
}

function parseDecimal(val: string): number | undefined | null {
  if (!val.trim()) return undefined;
  const n = parseFloat(val);
  return isNaN(n) ? undefined : n;
}

export function ReferenceBookForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ReferenceBookFormProps) {
  const { t } = useTranslation();

  const { data: machineModelsData } = useGetMachineModelsQuery({
    isActive: true,
    limit: 100,
  });
  const machineModels = machineModelsData?.data ?? [];

  const form = useForm<ReferenceBookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      machineModelId: defaultValues?.machineModelId ?? '__none',
      componentType: defaultValues?.componentType ?? '',
      partName: defaultValues?.partName ?? '',
      partCode: defaultValues?.partCode ?? '',
      standardSize: defaultValues?.standardSize ?? '',
      wearLimit: defaultValues?.wearLimit ?? '',
      serviceLimit: defaultValues?.serviceLimit ?? '',
      unit: defaultValues?.unit ?? 'mm',
      measurementDetails: defaultValues?.measurementDetails ?? [],
      sourceType: defaultValues?.sourceType ?? 'OTHER',
      verificationStatus: defaultValues?.verificationStatus ?? 'DRAFT',
      notes: defaultValues?.notes ?? '',
    },
  });

  const handleSubmit = async (data: ReferenceBookFormValues) => {
    const payload: CreateReferenceBookRequest | UpdateReferenceBookRequest = {
      machineModelId: data.machineModelId === '__none' ? null : data.machineModelId,
      componentType: data.componentType.trim() || undefined,
      partName: data.partName,
      partCode: data.partCode.trim() || undefined,
      standardSize: parseDecimal(data.standardSize) ?? undefined,
      wearLimit: parseDecimal(data.wearLimit) ?? undefined,
      serviceLimit: parseDecimal(data.serviceLimit) ?? undefined,
      unit: data.unit || 'mm',
      measurementDetails: data.measurementDetails.filter((r) => r.label.trim()),
      sourceType: data.sourceType,
      notes: data.notes.trim() || undefined,
      ...(mode === 'create' && { verificationStatus: data.verificationStatus }),
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Section: Identification */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Machine Model */}
          <FormField
            control={form.control}
            name="machineModelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.machineModel')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('referenceBook.noMachineModel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">
                        {t('referenceBook.noMachineModel')}
                      </SelectItem>
                      {machineModels.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.brand} {m.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Component Type */}
          <FormField
            control={form.control}
            name="componentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.componentType')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('referenceBook.componentTypePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Part Name */}
        <FormField
          control={form.control}
          name="partName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('referenceBook.partName')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('referenceBook.partNamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Part Code + Unit */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="partCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.partCode')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('referenceBook.partCodePlaceholder')} {...field} />
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
                <FormLabel>{t('referenceBook.unit')}</FormLabel>
                <FormControl>
                  <Input placeholder="mm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Size measurements */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="standardSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.standardSize')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={t('referenceBook.standardSizePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wearLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.wearLimit')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={t('referenceBook.wearLimitPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.serviceLimit')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={t('referenceBook.serviceLimitPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Dynamic measurement rows */}
        <MeasurementFields />

        <Separator />

        {/* Source + Verification status */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="sourceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.sourceType')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map((st) => (
                        <SelectItem key={st} value={st}>
                          {t(`sourceTypes.${st}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verificationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referenceBook.verificationStatus')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VERIFICATION_STATUSES.map((vs) => (
                        <SelectItem key={vs} value={vs}>
                          {t(`verificationStatuses.${vs}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('referenceBook.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('referenceBook.notesPlaceholder')}
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
            {mode === 'create' ? t('referenceBook.createRecord') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
