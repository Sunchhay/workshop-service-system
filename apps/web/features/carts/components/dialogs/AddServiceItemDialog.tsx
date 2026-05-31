'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useGetServicesQuery } from '@/features/services/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { AddCartItemRequest } from '../../types';

const schema = z.object({
  serviceId: z.string().min(1),
  machineModelId: z.string().optional(),
  unitPrice: z.string().min(1),
  quantity: z.string().min(1),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddServiceItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: AddCartItemRequest) => Promise<void>;
  isLoading?: boolean;
}

export function AddServiceItemDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: AddServiceItemDialogProps) {
  const { t } = useTranslation();

  const { data: servicesData } = useGetServicesQuery({ status: 'ACTIVE', limit: 200 });
  const { data: machineModelsData } = useGetMachineModelsQuery({
    status: 'ACTIVE',
    limit: 200,
  });

  const services = servicesData?.data ?? [];
  const machineModels = machineModelsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serviceId: '', machineModelId: '__none', unitPrice: '', quantity: '1', note: '' },
  });

  const handleSubmit = async (data: FormValues) => {
    await onConfirm({
      itemType: 'SERVICE',
      serviceId: data.serviceId,
      machineModelId: data.machineModelId === '__none' ? undefined : data.machineModelId,
      unitPrice: parseFloat(data.unitPrice),
      quantity: parseFloat(data.quantity),
      note: data.note?.trim() || undefined,
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) form.reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cart.addService')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('cart.service')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cart.selectService')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                          {s.nameEn ? ` · ${s.nameEn}` : ''}
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
                  <FormLabel>{t('cart.machineModel')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cart.noMachineModel')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none">{t('cart.noMachineModel')}</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cart.unitPrice')} <span className="text-destructive">*</span>
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cart.quantity')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0.001" step="0.001" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.note')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('cart.notePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
