'use client';

import { ArrowLeft, Banknote, Printer, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useAddSalePaymentMutation,
  useGetSaleQuery,
  useMarkCommissionPaidMutation,
  useVoidSaleMutation,
} from '../api';
import type {
  AddSalePaymentRequest,
  CommissionStatus,
  PaymentStatus,
  SalePaymentMethod,
  SaleStatus,
} from '../types';
import { AddPaymentDialog } from './dialogs/AddPaymentDialog';
import { MarkCommissionPaidDialog } from './dialogs/MarkCommissionPaidDialog';
import { VoidSaleDialog } from './dialogs/VoidSaleDialog';

const paymentStatusClass: Record<PaymentStatus, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const saleStatusClass: Record<SaleStatus, string> = {
  COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const commissionStatusClass: Record<CommissionStatus, string> = {
  NONE: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  UNPAID: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

const methodClass: Record<SalePaymentMethod, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ACLEDA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  ABA: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  BAKONG: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function SalesDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, isLoading } = useGetSaleQuery(id);
  const [voidSale, { isLoading: isVoiding }] = useVoidSaleMutation();
  const [markCommissionPaid, { isLoading: isMarkingCommission }] = useMarkCommissionPaidMutation();
  const [addSalePayment, { isLoading: isAddingPayment }] = useAddSalePaymentMutation();

  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);

  const sale = data?.data;

  const handleVoidConfirm = async (voidReason: string) => {
    try {
      await voidSale({ id, voidReason }).unwrap();
      toast.success(t('sales.voidSuccess'));
      setVoidDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const handleCommissionPaid = async () => {
    try {
      await markCommissionPaid(id).unwrap();
      toast.success(t('sales.commissionPaidSuccess'));
      setCommissionDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleAddPayment = async (paymentData: AddSalePaymentRequest) => {
    try {
      await addSalePayment({ saleId: id, data: paymentData }).unwrap();
      toast.success(t('sales.addPaymentSuccess'));
      setAddPaymentDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const items = sale?.items ?? [];
  const payments = sale?.payments ?? [];
  const balanceAmount = parseFloat(String(sale?.balanceAmount ?? 0));
  const canAddPayment = sale?.saleStatus === 'COMPLETED' && balanceAmount > 0;
  const canVoid = sale?.saleStatus === 'COMPLETED';
  const canMarkCommission = sale?.commissionStatus === 'UNPAID';

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('sales.saleDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : sale ? (
        <>
          {/* Invoice header card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-mono">{sale.invoiceNo}</CardTitle>
                    <Badge variant="outline" className={paymentStatusClass[sale.paymentStatus]}>
                      {t(`paymentStatuses.${sale.paymentStatus}`)}
                    </Badge>
                    <Badge variant="outline" className={saleStatusClass[sale.saleStatus]}>
                      {t(`saleStatuses.${sale.saleStatus}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(sale.createdAt)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" />
                  {t('sales.print')}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Customer + Mechanic */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.customer')}</p>
                  {sale.customer ? (
                    <>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{sale.customer.phone}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">—</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.mechanic')}</p>
                  {sale.mechanic ? (
                    <p className="font-medium">{sale.mechanic.name}</p>
                  ) : (
                    <p className="text-muted-foreground">—</p>
                  )}
                </div>
              </div>

              {/* Commission info */}
              {sale.commissionStatus !== 'NONE' && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">{t('sales.commissionStatus')}</p>
                      <Badge variant="outline" className={commissionStatusClass[sale.commissionStatus]}>
                        {t(`commissionStatuses.${sale.commissionStatus}`)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">{t('sales.commissionAmount')}</p>
                        <p className="font-mono font-medium">${fmt(sale.commissionAmount)}</p>
                      </div>
                      {sale.commissionNote && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">{t('sales.commissionNote')}</p>
                          <p>{sale.commissionNote}</p>
                        </div>
                      )}
                      {sale.commissionPaidAt && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">{t('sales.commissionPaidAt')}</p>
                          <p>{formatDate(sale.commissionPaidAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Note */}
              {sale.note && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">{t('sales.note')}</p>
                    <p className="whitespace-pre-line text-muted-foreground">{sale.note}</p>
                  </div>
                </>
              )}

              {/* Void info */}
              {sale.saleStatus === 'VOIDED' && (
                <>
                  <Separator />
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-medium">{t('sales.voidedInfo')}</p>
                    {sale.voidReason && (
                      <p className="text-destructive">{sale.voidReason}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(sale.voidedAt)}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.createdBy')}</p>
                  <p>{sale.createdBy?.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.createdAt')}</p>
                  <p>{formatDate(sale.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('sales.updatedAt')}</p>
                  <p>{formatDate(sale.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {canMarkCommission && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommissionDialogOpen(true)}
                  >
                    <Banknote className="h-3.5 w-3.5 mr-1.5" />
                    {t('sales.markCommissionPaid')}
                  </Button>
                )}
                {canVoid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoidDialogOpen(true)}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    {t('sales.voidSale')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('sales.items')}</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">—</p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('sales.itemType')}</TableHead>
                        <TableHead>{t('sales.nameSnapshot')}</TableHead>
                        <TableHead className="text-right">{t('sales.unitPrice')}</TableHead>
                        <TableHead className="text-right">{t('sales.quantity')}</TableHead>
                        <TableHead className="text-right">{t('sales.total')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {t(`itemTypes.${item.itemType}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{item.nameSnapshot}</p>
                            {item.note && (
                              <p className="text-xs text-muted-foreground">{item.note}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            ${fmt(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {fmt(item.quantity)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">
                            ${fmt(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-end mt-4">
                <div className="w-full sm:w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sales.subtotal')}</span>
                    <span className="font-mono">${fmt(sale.subtotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>{t('sales.grandTotal')}</span>
                    <span className="font-mono">${fmt(sale.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-700 dark:text-green-400">
                    <span className="text-muted-foreground">{t('sales.paidAmount')}</span>
                    <span className="font-mono">${fmt(sale.paidAmount)}</span>
                  </div>
                  <div className={`flex justify-between ${balanceAmount > 0 ? 'text-amber-700 dark:text-amber-400 font-semibold' : ''}`}>
                    <span className="text-muted-foreground">{t('sales.balanceAmount')}</span>
                    <span className="font-mono">${fmt(sale.balanceAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-base">{t('sales.payments')}</CardTitle>
                {canAddPayment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddPaymentDialogOpen(true)}
                  >
                    {t('sales.addPayment')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('payments.noPaymentHistory')}
                </p>
              ) : (
                <div className="space-y-2">
                  {payments.map((pay) => (
                    <div
                      key={pay.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge
                          variant="outline"
                          className={`${methodClass[pay.paymentMethod]} text-[10px] shrink-0`}
                        >
                          {t(`paymentMethods.${pay.paymentMethod}`)}
                        </Badge>
                        {pay.referenceNo && (
                          <span className="text-xs text-muted-foreground truncate hidden sm:block">
                            {pay.referenceNo}
                          </span>
                        )}
                        {pay.note && (
                          <span className="text-xs text-muted-foreground truncate hidden sm:block">
                            {pay.note}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(pay.paidAt)}
                        </span>
                        <span className="font-mono font-medium">${fmt(pay.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}

      <VoidSaleDialog
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onConfirm={handleVoidConfirm}
        isLoading={isVoiding}
      />
      <MarkCommissionPaidDialog
        open={commissionDialogOpen}
        onOpenChange={setCommissionDialogOpen}
        onConfirm={handleCommissionPaid}
        isLoading={isMarkingCommission}
      />
      {sale && (
        <AddPaymentDialog
          saleId={sale.id}
          balanceAmount={balanceAmount}
          open={addPaymentDialogOpen}
          onOpenChange={setAddPaymentDialogOpen}
          onConfirm={handleAddPayment}
          isLoading={isAddingPayment}
        />
      )}
    </div>
  );
}
