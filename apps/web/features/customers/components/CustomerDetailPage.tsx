'use client';

import { ArrowLeft, Clock, CreditCard, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerStatusMutation,
} from '../api';
import type { Customer, CustomerType } from '../types';
import { DeleteCustomerDialog } from './dialogs/DeleteCustomerDialog';
import { DisableCustomerDialog } from './dialogs/DisableCustomerDialog';

interface CustomerDetailPageProps {
  id: string;
}

const typeClass: Record<CustomerType, string> = {
  NORMAL: 'text-muted-foreground',
  VIP: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  WHOLESALE:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  PARTNER:
    'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function CustomerDetailPage({ id }: CustomerDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetCustomerQuery(id);
  const [updateStatus, { isLoading: isToggling }] =
    useUpdateCustomerStatusMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const customer = data?.data;

  const handleStatusConfirm = async () => {
    if (!customer) return;
    try {
      await updateStatus({ id, isActive: !customer.isActive }).unwrap();
      toast.success(
        customer.isActive
          ? t('customers.disabledSuccess')
          : t('customers.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCustomer(id).unwrap();
      toast.success(t('customers.deleteSuccess'));
      router.replace('/admin/customers');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {t('customers.customerDetail')}
        </h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : customer ? (
        <>
          {/* Info card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{customer.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      {customer.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {customer.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/customers/${id}/edit`}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      {t('common.edit')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('customers.customerType')}
                  </p>
                  <Badge
                    variant="outline"
                    className={typeClass[customer.customerType]}
                  >
                    {t(`customerTypes.${customer.customerType}`)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('customers.statusLabel')}
                  </p>
                  <Badge
                    variant={customer.isActive ? 'default' : 'outline'}
                    className={
                      customer.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(customer.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </div>
                {customer.email && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('customers.email')}
                    </p>
                    <p className="break-all">{customer.email}</p>
                  </div>
                )}
                {customer.address && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('customers.address')}
                    </p>
                    <p className="whitespace-pre-line">{customer.address}</p>
                  </div>
                )}
                {customer.notes && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t('customers.notes')}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {customer.notes}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('customers.createdAt')}
                  </p>
                  <p>{formatDate(customer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t('customers.updatedAt')}
                  </p>
                  <p>{formatDate(customer.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={customer.isActive ? 'outline' : 'outline'}
                  size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={
                    customer.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {customer.isActive
                    ? t('customers.confirmDisableTitle')
                    : t('customers.confirmEnableTitle')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service history placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {t('customers.serviceHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-6">
                {t('customers.comingSoon')}
              </p>
            </CardContent>
          </Card>

          {/* Payment history placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {t('customers.paymentHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-6">
                {t('customers.comingSoon')}
              </p>
            </CardContent>
          </Card>

          {/* Dialogs */}
          <DisableCustomerDialog
            customer={customer as Customer}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteCustomerDialog
            customer={customer as Customer}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
