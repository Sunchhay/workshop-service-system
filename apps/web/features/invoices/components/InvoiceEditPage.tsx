'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetInvoiceQuery, useUpdateInvoiceMutation } from '../api';
import type { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types';
import type { InvoiceFormValues } from './InvoiceForm';
import { InvoiceForm } from './InvoiceForm';

export function InvoiceEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetInvoiceQuery(id);
  const [updateInvoice, { isLoading: isSaving }] = useUpdateInvoiceMutation();

  const invoice = data?.data;

  const defaultValues: Partial<InvoiceFormValues> | undefined = invoice
    ? {
        customerId: invoice.customerId,
        dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : '',
        notes: invoice.notes ?? '',
        discountAmount: invoice.discountAmount,
        taxAmount: invoice.taxAmount,
        items: invoice.items.map((item) => ({
          type: item.type,
          serviceId: item.serviceId ?? '',
          productId: item.productId ?? '',
          description: item.description,
          itemCode: item.itemCode ?? '',
          itemNameKh: item.itemNameKh ?? '',
          itemNameEn: item.itemNameEn ?? '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
        })),
      }
    : undefined;

  const handleSubmit = async (payload: CreateInvoiceRequest | UpdateInvoiceRequest) => {
    try {
      await updateInvoice({ id, data: payload as UpdateInvoiceRequest }).unwrap();
      toast.success(t('invoices.updateSuccess'));
      router.replace(`/admin/invoices/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('invoices.editInvoice')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('invoices.invoiceDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : invoice ? (
            <InvoiceForm
              mode="edit"
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
