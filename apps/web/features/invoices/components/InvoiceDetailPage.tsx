'use client';

import { ArrowLeft, Pencil, Printer, Trash2, Wallet, XCircle } from 'lucide-react';
import Link from 'next/link';
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

import { PaymentHistory } from '@/features/payments/components/PaymentHistory';
import { RecordPaymentDialog } from '@/features/payments/components/dialogs/RecordPaymentDialog';

import {
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoiceQuery,
} from '../api';
import { getInvoiceItemDisplayName } from '@/lib/display-name';

import type { InvoiceStatus } from '../types';
import { CancelInvoiceDialog } from './dialogs/CancelInvoiceDialog';
import { DeleteInvoiceDialog } from './dialogs/DeleteInvoiceDialog';

const statusClass: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  ISSUED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function fmt(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function InvoiceDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetInvoiceQuery(id);
  const [cancelInvoice, { isLoading: isCancelling }] = useCancelInvoiceMutation();
  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  const invoice = data?.data;

  const handleCancelConfirm = async (reason?: string) => {
    try {
      await cancelInvoice({ id, reason }).unwrap();
      toast.success(t('invoices.cancelSuccess'));
      setCancelDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInvoice(id).unwrap();
      toast.success(t('invoices.deleteSuccess'));
      router.replace('/admin/invoices');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('invoices.invoiceDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : invoice ? (
        <>
          {/* Main info card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-mono">{invoice.invoiceNumber}</CardTitle>
                    <Badge variant="outline" className={statusClass[invoice.status]}>
                      {t(`invoiceStatuses.${invoice.status}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoice.customer.name}
                    {invoice.customer.phone && ` · ${invoice.customer.phone}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/print/invoices/${id}`} target="_blank" rel="noopener noreferrer">
                      <Printer className="h-3.5 w-3.5 mr-1.5" />
                      {t('invoices.printInvoice')}
                    </Link>
                  </Button>
                  {invoice.status !== 'CANCELLED' && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/invoices/${id}/edit`}>
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        {t('common.edit')}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('invoices.issuedAt')}</p>
                  <p>{formatDate(invoice.issuedAt)}</p>
                </div>
                {invoice.dueDate && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{t('invoices.dueDate')}</p>
                    <p>{formatDate(invoice.dueDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('invoices.createdBy')}</p>
                  <p>{invoice.createdBy.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('invoices.createdAt')}</p>
                  <p>{formatDate(invoice.createdAt)}</p>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">{t('invoices.notes')}</p>
                    <p className="whitespace-pre-line text-muted-foreground">{invoice.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Items table */}
              <div>
                <p className="text-sm font-medium mb-3">{t('invoices.items')}</p>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('invoices.description')}</TableHead>
                        <TableHead className="text-right w-16">{t('invoices.quantity')}</TableHead>
                        <TableHead className="text-right w-28">{t('invoices.unitPrice')}</TableHead>
                        <TableHead className="text-right w-28">{t('invoices.itemDiscount')}</TableHead>
                        <TableHead className="text-right w-28">{t('invoices.totalPrice')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="text-sm font-medium">
                              {getInvoiceItemDisplayName(item)}
                            </p>
                            {item.itemNameKh && item.description !== item.itemNameKh && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                            {item.itemCode && (
                              <p className="text-xs text-muted-foreground font-mono">{item.itemCode}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {fmt(item.quantity)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            ${fmt(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {parseFloat(item.discountAmount) > 0 ? `-$${fmt(item.discountAmount)}` : '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">
                            ${fmt(item.totalPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('invoices.subtotal')}</span>
                    <span className="font-mono">${fmt(invoice.subtotal)}</span>
                  </div>
                  {parseFloat(invoice.discountAmount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('invoices.discountAmount')}</span>
                      <span className="font-mono text-destructive">-${fmt(invoice.discountAmount)}</span>
                    </div>
                  )}
                  {parseFloat(invoice.taxAmount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('invoices.taxAmount')}</span>
                      <span className="font-mono">+${fmt(invoice.taxAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>{t('invoices.totalAmount')}</span>
                    <span className="font-mono">${fmt(invoice.totalAmount)}</span>
                  </div>
                  {parseFloat(invoice.paidAmount) > 0 && (
                    <div className="flex justify-between text-green-700 dark:text-green-400">
                      <span>{t('invoices.paidAmount')}</span>
                      <span className="font-mono">-${fmt(invoice.paidAmount)}</span>
                    </div>
                  )}
                  {parseFloat(invoice.dueAmount) > 0 && (
                    <div className="flex justify-between font-semibold text-amber-700 dark:text-amber-400">
                      <span>{t('invoices.dueAmount')}</span>
                      <span className="font-mono">${fmt(invoice.dueAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment history */}
              <div>
                <p className="text-sm font-medium mb-3">{t('payments.paymentHistory')}</p>
                <PaymentHistory invoiceId={id} />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {invoice.status !== 'CANCELLED' && invoice.status !== 'PAID' && (
                  <Button
                    size="sm"
                    onClick={() => setRecordPaymentOpen(true)}
                  >
                    <Wallet className="h-3.5 w-3.5 mr-1.5" />
                    {t('payments.recordPayment')}
                  </Button>
                )}
                {invoice.status !== 'CANCELLED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelDialogOpen(true)}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    {t('invoices.confirmCancelTitle')}
                  </Button>
                )}
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

          <RecordPaymentDialog
            invoice={invoice}
            open={recordPaymentOpen}
            onOpenChange={setRecordPaymentOpen}
          />
          <CancelInvoiceDialog
            invoice={invoice}
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            onConfirm={handleCancelConfirm}
            isLoading={isCancelling}
          />
          <DeleteInvoiceDialog
            invoice={invoice}
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
