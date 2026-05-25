'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
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
import { useGetCustomersQuery } from '@/features/customers/api';
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useGetUsersQuery } from '@/features/users/api';
import type { User } from '@/features/users/types';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { useAppSelector } from '@/lib/store/hooks';

import type { CreateServiceJobRequest, ItemType, JobStatus, Priority, UpdateServiceJobRequest } from '../types';
import { JobSummary } from './JobSummary';
import { ServiceJobItemSection } from './ServiceJobItemSection';

const JOB_STATUSES: JobStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'];
const PRIORITIES: Priority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

const itemSchema = z.object({
  type: z.enum(['SERVICE', 'PRODUCT', 'CUSTOM']),
  serviceId: z.string(),
  priceCatalogId: z.string(),
  description: z.string().min(1),
  quantity: z.string(),
  unitPrice: z.string(),
  measurement: z.string(),
  notes: z.string(),
});

const schema = z.object({
  customerId: z.string().min(1),
  machineModelId: z.string(),
  partDescription: z.string().min(1),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  estimatedCompletionDate: z.string(),
  notes: z.string(),
  technicianNotes: z.string(),
  assignedToId: z.string(),
  items: z.array(itemSchema),
});

export type ServiceJobFormValues = z.infer<typeof schema>;

function mapItemToPayload(item: ServiceJobFormValues['items'][0]) {
  return {
    type: item.type as ItemType,
    serviceId: item.serviceId || undefined,
    priceCatalogId: item.priceCatalogId || undefined,
    description: item.description,
    quantity: parseFloat(item.quantity) || 1,
    unitPrice: parseFloat(item.unitPrice) || 0,
    measurement: item.measurement.trim() || undefined,
    notes: item.notes.trim() || undefined,
  };
}

interface ServiceJobFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ServiceJobFormValues>;
  onSubmit: (data: CreateServiceJobRequest | UpdateServiceJobRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ServiceJobForm({ mode, defaultValues, onSubmit, isLoading }: ServiceJobFormProps) {
  const { t } = useTranslation();
  const currentUser = useAppSelector((s) => s.auth.user);

  const { data: customersData } = useGetCustomersQuery({ isActive: true, limit: 100 });
  const customers = customersData?.data ?? [];

  const { data: machineModelsData } = useGetMachineModelsQuery({ isActive: true, limit: 100 });
  const machineModels = machineModelsData?.data ?? [];

  const { data: usersData } = useGetUsersQuery({ limit: 100 });
  const usersFromQuery = usersData?.data ?? [];
  // The /users endpoint excludes the current user, so add them back for assignment purposes
  const users: User[] = currentUser && !usersFromQuery.some((u) => u.id === currentUser.id)
    ? [{ id: currentUser.id, name: currentUser.name, email: currentUser.email, role: currentUser.role as User['role'], isActive: currentUser.isActive ?? true, createdAt: '', updatedAt: '' }, ...usersFromQuery]
    : usersFromQuery;

  const form = useForm<ServiceJobFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: defaultValues?.customerId ?? '',
      machineModelId: defaultValues?.machineModelId ?? '__none',
      partDescription: defaultValues?.partDescription ?? '',
      status: defaultValues?.status ?? 'PENDING',
      priority: defaultValues?.priority ?? 'NORMAL',
      estimatedCompletionDate: defaultValues?.estimatedCompletionDate ?? '',
      notes: defaultValues?.notes ?? '',
      technicianNotes: defaultValues?.technicianNotes ?? '',
      assignedToId: defaultValues?.assignedToId ?? '__none',
      items: defaultValues?.items ?? [],
    },
  });

  const handleSubmit = async (data: ServiceJobFormValues) => {
    const items = data.items.map(mapItemToPayload);

    if (mode === 'create') {
      const payload: CreateServiceJobRequest = {
        customerId: data.customerId,
        machineModelId: data.machineModelId !== '__none' ? data.machineModelId : undefined,
        partDescription: data.partDescription,
        status: data.status,
        priority: data.priority,
        estimatedCompletionDate: data.estimatedCompletionDate || undefined,
        notes: data.notes.trim() || undefined,
        technicianNotes: data.technicianNotes.trim() || undefined,
        assignedToId: data.assignedToId !== '__none' ? data.assignedToId : undefined,
        items,
      };
      await onSubmit(payload);
    } else {
      const payload: UpdateServiceJobRequest = {
        machineModelId: data.machineModelId !== '__none' ? data.machineModelId : null,
        partDescription: data.partDescription,
        priority: data.priority,
        estimatedCompletionDate: data.estimatedCompletionDate || null,
        notes: data.notes.trim() || undefined,
        technicianNotes: data.technicianNotes.trim() || undefined,
        assignedToId: data.assignedToId !== '__none' ? data.assignedToId : null,
        items,
      };
      await onSubmit(payload);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Customer */}
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('serviceJobs.customer')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === 'edit'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('serviceJobs.selectCustomer')} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} — {c.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Machine model + Part description */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="machineModelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.machineModel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('serviceJobs.noMachineModel')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">{t('serviceJobs.noMachineModel')}</SelectItem>
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

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.priority')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {t(`priorities.${p}`)}
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

          {/* Part description */}
          <FormField
            control={form.control}
            name="partDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('serviceJobs.partDescription')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('serviceJobs.partDescPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (show on both create and edit) + Est completion */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.status')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`jobStatuses.${s}`)}
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
              name="estimatedCompletionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.estimatedCompletionDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Assigned to */}
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('serviceJobs.assignedTo')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('serviceJobs.unassigned')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">{t('serviceJobs.unassigned')}</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('serviceJobs.notesPlaceholder')}
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicianNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceJobs.technicianNotes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('serviceJobs.techNotesPlaceholder')}
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Items */}
          <ServiceJobItemSection />

          {/* Job total */}
          <JobSummary />

          {form.formState.errors.root && (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}

          {/* Sticky save button */}
          <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? t('serviceJobs.createJob') : t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
