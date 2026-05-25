'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateCustomerMutation } from '../api';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types';
import { CustomerForm } from './CustomerForm';

export function CustomerCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleSubmit = async (
    data: CreateCustomerRequest | UpdateCustomerRequest,
  ) => {
    try {
      await createCustomer(data as CreateCustomerRequest).unwrap();
      toast.success(t('customers.createSuccess'));
      router.replace('/admin/customers');
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
        <h2 className="text-xl font-semibold">{t('customers.createCustomer')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('customers.customerDetail')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
