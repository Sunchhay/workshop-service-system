'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetCustomerQuery, useUpdateCustomerMutation } from '../api';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types';
import { CustomerForm } from './CustomerForm';

interface CustomerEditPageProps {
  id: string;
}

export function CustomerEditPage({ id }: CustomerEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetCustomerQuery(id);
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const handleSubmit = async (
    payload: CreateCustomerRequest | UpdateCustomerRequest,
  ) => {
    try {
      await updateCustomer({ id, data: payload as UpdateCustomerRequest }).unwrap();
      toast.success(t('customers.updateSuccess'));
      router.replace(`/admin/customers/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('customers.editCustomer')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('customers.customerDetail')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : data?.data ? (
            <CustomerForm
              mode="edit"
              defaultValues={{
                name: data.data.name,
                phone: data.data.phone,
                email: data.data.email ?? '',
                address: data.data.address ?? '',
                customerType: data.data.customerType,
                notes: data.data.notes ?? '',
              }}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
