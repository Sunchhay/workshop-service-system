'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Package, Plus, ShoppingCart, Trash2, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetCustomersQuery } from '@/features/customers/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useAddCartItemMutation,
  useCheckoutMutation,
  useDiscardCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateCartMutation,
} from '../api';
import type { AddCartItemRequest, Cart, CartItem, CartStatus, UpdateCartItemRequest } from '../types';
import { AddProductItemDialog } from './dialogs/AddProductItemDialog';
import { AddServiceItemDialog } from './dialogs/AddServiceItemDialog';
import { CheckoutDialog } from './dialogs/CheckoutDialog';
import { DiscardCartDialog } from './dialogs/DiscardCartDialog';
import { EditCartItemDialog } from './dialogs/EditCartItemDialog';

const cartStatusClass: Record<CartStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CHECKED_OUT: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
};

const infoSchema = z.object({
  customerId: z.string().optional(),
  mechanicId: z.string().optional(),
  commissionAmount: z.string().optional(),
  commissionNote: z.string().optional(),
  note: z.string().optional(),
});

type InfoFormValues = z.infer<typeof infoSchema>;

function formatCurrency(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function useCartInfoForm(cart: Cart | undefined) {
  return useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    values: {
      customerId: cart?.customerId ?? '__none',
      mechanicId: cart?.mechanicId ?? '__none',
      commissionAmount: cart ? String(cart.commissionAmount) : '0',
      commissionNote: cart?.commissionNote ?? '',
      note: cart?.note ?? '',
    },
  });
}

export function CartDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, isLoading } = useGetCartQuery(id);
  const cart = data?.data;

  const { data: customersData } = useGetCustomersQuery({ limit: 200 });
  const customers = customersData?.data ?? [];
  const mechanics = customers.filter((c) => c.customerType === 'MECHANIC');
  const regularCustomers = customers.filter((c) => c.customerType !== 'MECHANIC');

  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [discardCart, { isLoading: isDiscarding }] = useDiscardCartMutation();
  const [addCartItem, { isLoading: isAddingItem }] = useAddCartItemMutation();
  const [updateCartItem, { isLoading: isUpdatingItem }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: isRemovingItem }] = useRemoveCartItemMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editItemTarget, setEditItemTarget] = useState<CartItem | null>(null);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const form = useCartInfoForm(cart);

  const handleInfoSubmit = async (data: InfoFormValues) => {
    try {
      await updateCart({
        id,
        data: {
          customerId: data.customerId === '__none' ? null : data.customerId,
          mechanicId: data.mechanicId === '__none' ? null : data.mechanicId,
          commissionAmount: data.commissionAmount?.trim()
            ? parseFloat(data.commissionAmount)
            : undefined,
          commissionNote: data.commissionNote?.trim() || undefined,
          note: data.note?.trim() || undefined,
        },
      }).unwrap();
      toast.success(t('cart.updateSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleAddItem = async (data: AddCartItemRequest) => {
    try {
      await addCartItem({ cartId: id, data }).unwrap();
      toast.success(t('cart.addItemSuccess'));
      setAddServiceOpen(false);
      setAddProductOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleEditItem = async (data: UpdateCartItemRequest) => {
    if (!editItemTarget) return;
    try {
      await updateCartItem({ cartId: id, itemId: editItemTarget.id, data }).unwrap();
      toast.success(t('cart.updateItemSuccess'));
      setEditItemOpen(false);
      setEditItemTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItemId(itemId);
    try {
      await removeCartItem({ cartId: id, itemId }).unwrap();
      toast.success(t('cart.removeItemSuccess'));
    } catch {
      toast.error(t('common.error'));
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleDiscardConfirm = async () => {
    try {
      await discardCart(id).unwrap();
      toast.success(t('cart.discardSuccess'));
      router.replace('/admin/carts');
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleCheckout = async (checkoutData: Parameters<typeof checkout>[0]) => {
    try {
      await checkout(checkoutData).unwrap();
      toast.success(t('cart.checkoutSuccess'));
      setCheckoutOpen(false);
      router.replace('/admin/carts');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const items = cart?.items ?? [];
  const grandTotal = items.reduce((sum, item) => sum + parseFloat(String(item.total)), 0);
  const isActive = cart?.status === 'ACTIVE';

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('cart.title')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
      ) : cart ? (
        <>
          {/* Cart info card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{t('cart.cartInfo')}</CardTitle>
                </div>
                <Badge variant="outline" className={cartStatusClass[cart.status]}>
                  {t(`cartStatuses.${cart.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isActive ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleInfoSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="customerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('cart.customer')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('cart.noCustomer')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__none">{t('cart.noCustomer')}</SelectItem>
                                {regularCustomers.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                    {c.phone ? ` · ${c.phone}` : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mechanicId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('cart.mechanic')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('cart.noMechanic')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__none">{t('cart.noMechanic')}</SelectItem>
                                {mechanics.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                    {m.phone ? ` · ${m.phone}` : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="commissionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('cart.commission')}</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="commissionNote"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('cart.commissionNote')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('cart.commissionNotePlaceholder')} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('cart.cartNote')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('cart.cartNotePlaceholder')} {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDiscardOpen(true)}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        {t('cart.discard')}
                      </Button>
                      <Button type="submit" size="sm" disabled={isUpdating}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('common.save')}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('cart.customer')}</p>
                      <p>{cart.customer?.name ?? '—'}</p>
                      {cart.customer?.phone && (
                        <p className="text-xs text-muted-foreground">{cart.customer.phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('cart.mechanic')}</p>
                      <p>{cart.mechanic?.name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('cart.commission')}</p>
                      <p className="font-mono">${formatCurrency(cart.commissionAmount)}</p>
                    </div>
                    {cart.commissionNote && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t('cart.commissionNote')}</p>
                        <p>{cart.commissionNote}</p>
                      </div>
                    )}
                  </div>
                  {cart.note && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('cart.cartNote')}</p>
                      <p className="text-muted-foreground">{cart.note}</p>
                    </div>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span>{t('cart.createdBy')}: </span>
                      <span>{cart.createdBy?.name ?? '—'}</span>
                    </div>
                    <div>
                      <span>{t('cart.createdAt')}: </span>
                      <span>{new Date(cart.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-base">{t('cart.items')}</CardTitle>
                {isActive && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddServiceOpen(true)}
                    >
                      <Wrench className="h-3.5 w-3.5 mr-1.5" />
                      {t('cart.addService')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddProductOpen(true)}
                    >
                      <Package className="h-3.5 w-3.5 mr-1.5" />
                      {t('cart.addProduct')}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('cart.noItems')}
                </p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('cart.nameSnapshot')}</TableHead>
                        <TableHead>{t('cart.itemType')}</TableHead>
                        <TableHead className="text-right">{t('cart.unitPrice')}</TableHead>
                        <TableHead className="text-right">{t('cart.quantity')}</TableHead>
                        <TableHead className="text-right">{t('cart.total')}</TableHead>
                        {isActive && <TableHead className="w-10" />}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium text-sm">{item.nameSnapshot}</p>
                            {item.note && (
                              <p className="text-xs text-muted-foreground">{item.note}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {t(`itemTypes.${item.itemType}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            ${formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatCurrency(item.quantity)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">
                            ${formatCurrency(item.total)}
                          </TableCell>
                          {isActive && (
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => { setEditItemTarget(item); setEditItemOpen(true); }}
                                >
                                  <Plus className="h-3.5 w-3.5 rotate-45" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={removingItemId === item.id || isRemovingItem}
                                >
                                  {removingItemId === item.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary card */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.commission')}</span>
                <span className="font-mono">${formatCurrency(cart.commissionAmount)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>{t('cart.grandTotal')}</span>
                <span className="font-mono text-lg">${formatCurrency(grandTotal)}</span>
              </div>

              {isActive && (
                <Button
                  className="w-full mt-2"
                  size="sm"
                  onClick={() => setCheckoutOpen(true)}
                  disabled={items.length === 0}
                >
                  {t('cart.checkout')}
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}

      <AddServiceItemDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        onConfirm={handleAddItem}
        isLoading={isAddingItem}
      />
      <AddProductItemDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onConfirm={handleAddItem}
        isLoading={isAddingItem}
      />
      <EditCartItemDialog
        item={editItemTarget}
        open={editItemOpen}
        onOpenChange={setEditItemOpen}
        onConfirm={handleEditItem}
        isLoading={isUpdatingItem}
      />
      <DiscardCartDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onConfirm={handleDiscardConfirm}
        isLoading={isDiscarding}
      />
      {cart && (
        <CheckoutDialog
          cartId={cart.id}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          onConfirm={handleCheckout}
          isLoading={isCheckingOut}
        />
      )}
    </div>
  );
}
