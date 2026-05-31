'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import {
  ChevronDown,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Wrench,
} from 'lucide-react';
import type { UIEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useGetCustomersQuery } from '@/features/customers/api';
import type { Customer } from '@/features/customers/types';
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useLazyGetProductPricesQuery } from '@/features/product-prices/api';
import type { ProductPrice } from '@/features/product-prices/types';
import { useLazyGetServicePricesQuery } from '@/features/service-prices/api';
import type { ServicePrice } from '@/features/service-prices/types';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useAddCartItemMutation,
  useCheckoutMutation,
  useCreateCartMutation,
  useGetCartQuery,
  useGetCartsQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateCartMutation,
} from '../api';
import type { Cart, CartItem, CheckoutRequest, ItemType, UpdateCartItemRequest, UpdateCartRequest } from '../types';
import { CheckoutDialog } from './dialogs/CheckoutDialog';

type BrowserTab = 'PRODUCT' | 'SERVICE';

const PRICE_LIMIT = 20;
const SCROLL_THRESHOLD = 240;

function money(value: string | number | null | undefined) {
  const parsed = parseFloat(String(value ?? 0));
  return `$${(Number.isFinite(parsed) ? parsed : 0).toFixed(2)}`;
}

function numberValue(value: string | number | null | undefined) {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
}

function modelName(model?: { brand?: string | null; modelName: string } | null) {
  return [model?.brand, model?.modelName].filter(Boolean).join(' ') || '—';
}

function itemDisplayName(item: ProductPrice | ServicePrice, type: BrowserTab) {
  const name = type === 'PRODUCT' ? (item as ProductPrice).product.name : (item as ServicePrice).service.name;
  return `${modelName(item.machineModel)} - ${name}`;
}

function selectedPrice(
  item: ProductPrice | ServicePrice,
  customerType: Customer['customerType'] | undefined,
) {
  const owner = item.ownerPrice;
  const mechanic = item.mechanicPrice;
  if (customerType === 'MECHANIC') return numberValue(mechanic ?? owner);
  return numberValue(owner ?? mechanic);
}

function cartTotal(cart: Cart | undefined) {
  return (cart?.items ?? []).reduce((sum, item) => sum + numberValue(item.total), 0);
}

function appendUnique<T extends { id: string }>(current: T[], next: T[]) {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...next.filter((item) => !seen.has(item.id))];
}

export function CartPage() {
  const { t } = useTranslation();
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [browserTab, setBrowserTab] = useState<BrowserTab>('PRODUCT');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [machineModelId, setMachineModelId] = useState('__all');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const [productItems, setProductItems] = useState<ProductPrice[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [productHasMore, setProductHasMore] = useState(true);
  const [productLoadingMore, setProductLoadingMore] = useState(false);
  const [productInitialLoading, setProductInitialLoading] = useState(false);
  const [productLoadedKey, setProductLoadedKey] = useState('');

  const [serviceItems, setServiceItems] = useState<ServicePrice[]>([]);
  const [servicePage, setServicePage] = useState(0);
  const [serviceHasMore, setServiceHasMore] = useState(true);
  const [serviceLoadingMore, setServiceLoadingMore] = useState(false);
  const [serviceInitialLoading, setServiceInitialLoading] = useState(false);
  const [serviceLoadedKey, setServiceLoadedKey] = useState('');

  const filtersKey = `${search}|${machineModelId}`;
  const filtersKeyRef = useRef(filtersKey);
  const productLoadingRef = useRef(false);
  const serviceLoadingRef = useRef(false);

  const { data: cartsData, isLoading: isLoadingCarts } = useGetCartsQuery({
    status: 'ACTIVE',
    page: 1,
    limit: 50,
  });
  const carts = cartsData?.data ?? [];
  const fallbackCart = carts[0];
  const selectedListCart = carts.find((cart) => cart.id === selectedCartId) ?? fallbackCart;
  const activeCartId = selectedCartId ?? fallbackCart?.id ?? null;

  const { data: selectedCartData, isFetching: isFetchingCart } = useGetCartQuery(
    activeCartId ?? skipToken,
  );
  const selectedCart = selectedCartData?.data ?? selectedListCart;
  const selectedCustomerType = selectedCart?.customer?.customerType as Customer['customerType'] | undefined;
  const isEditable = selectedCart?.status === 'ACTIVE';

  const { data: customersData } = useGetCustomersQuery({ status: 'ACTIVE', limit: 200 });
  const customers = customersData?.data ?? [];
  const mechanics = customers.filter((customer) => customer.customerType === 'MECHANIC');

  const { data: machineModelsData } = useGetMachineModelsQuery({ status: 'ACTIVE', limit: 200 });
  const machineModels = machineModelsData?.data ?? [];

  const [fetchProductPrices] = useLazyGetProductPricesQuery();
  const [fetchServicePrices] = useLazyGetServicePricesQuery();

  const browserItems = useMemo(() => {
    return browserTab === 'PRODUCT' ? productItems : serviceItems;
  }, [browserTab, productItems, serviceItems]);

  const activeInitialLoading = browserTab === 'PRODUCT' ? productInitialLoading : serviceInitialLoading;
  const activeLoadingMore = browserTab === 'PRODUCT' ? productLoadingMore : serviceLoadingMore;
  const activeHasMore = browserTab === 'PRODUCT' ? productHasMore : serviceHasMore;

  const [createCart, { isLoading: isCreating }] = useCreateCartMutation();
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const [addCartItem, { isLoading: isAddingItem }] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const subtotal = cartTotal(selectedCart);
  const commission = numberValue(selectedCart?.commissionAmount);
  const grandTotal = subtotal;
  const netAfterCommission = subtotal - commission;

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();
      if (nextSearch === search) return;
      setSearch(nextSearch);
      setProductItems([]);
      setProductPage(0);
      setProductHasMore(true);
      setProductLoadedKey('');
      setServiceItems([]);
      setServicePage(0);
      setServiceHasMore(true);
      setServiceLoadedKey('');
    }, 300);
    return () => clearTimeout(timer);
  }, [search, searchInput]);

  useEffect(() => {
    filtersKeyRef.current = filtersKey;
  }, [filtersKey]);

  const productQuery = useCallback((page: number) => ({
    status: 'ACTIVE' as const,
    search: search || undefined,
    machineModelId: machineModelId === '__all' ? undefined : machineModelId,
    page,
    limit: PRICE_LIMIT,
  }), [machineModelId, search]);

  const serviceQuery = useCallback((page: number) => ({
    status: 'ACTIVE' as const,
    search: search || undefined,
    machineModelId: machineModelId === '__all' ? undefined : machineModelId,
    page,
    limit: PRICE_LIMIT,
  }), [machineModelId, search]);

  const loadProductsPage = useCallback(async (page: number, mode: 'reset' | 'append') => {
    if (productLoadingRef.current) return;
    productLoadingRef.current = true;
    const requestKey = filtersKeyRef.current;
    if (mode === 'reset') setProductInitialLoading(true);
    if (mode === 'append') setProductLoadingMore(true);

    try {
      const result = await fetchProductPrices(productQuery(page), true).unwrap();
      if (requestKey !== filtersKeyRef.current) return;
      const rows = result.data ?? [];
      const total = result.meta?.total;
      setProductItems((current) => (mode === 'reset' ? rows : appendUnique(current, rows)));
      setProductPage(page);
      setProductLoadedKey(requestKey);
      setProductHasMore(typeof total === 'number' ? page * PRICE_LIMIT < total : rows.length >= PRICE_LIMIT);
    } catch {
      toast.error(t('common.error'));
    } finally {
      productLoadingRef.current = false;
      setProductInitialLoading(false);
      setProductLoadingMore(false);
    }
  }, [fetchProductPrices, productQuery, t]);

  const loadServicesPage = useCallback(async (page: number, mode: 'reset' | 'append') => {
    if (serviceLoadingRef.current) return;
    serviceLoadingRef.current = true;
    const requestKey = filtersKeyRef.current;
    if (mode === 'reset') setServiceInitialLoading(true);
    if (mode === 'append') setServiceLoadingMore(true);

    try {
      const result = await fetchServicePrices(serviceQuery(page), true).unwrap();
      if (requestKey !== filtersKeyRef.current) return;
      const rows = result.data ?? [];
      const total = result.meta?.total;
      setServiceItems((current) => (mode === 'reset' ? rows : appendUnique(current, rows)));
      setServicePage(page);
      setServiceLoadedKey(requestKey);
      setServiceHasMore(typeof total === 'number' ? page * PRICE_LIMIT < total : rows.length >= PRICE_LIMIT);
    } catch {
      toast.error(t('common.error'));
    } finally {
      serviceLoadingRef.current = false;
      setServiceInitialLoading(false);
      setServiceLoadingMore(false);
    }
  }, [fetchServicePrices, serviceQuery, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (browserTab === 'PRODUCT' && productLoadedKey !== filtersKey) {
        void loadProductsPage(1, 'reset');
      }
      if (browserTab === 'SERVICE' && serviceLoadedKey !== filtersKey) {
        void loadServicesPage(1, 'reset');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [browserTab, filtersKey, loadProductsPage, loadServicesPage, productLoadedKey, serviceLoadedKey]);

  const loadMoreActiveTab = () => {
    if (browserTab === 'PRODUCT') {
      if (!productHasMore || productLoadingRef.current || productInitialLoading || productLoadingMore) return;
      void loadProductsPage(productPage + 1, 'append');
      return;
    }
    if (!serviceHasMore || serviceLoadingRef.current || serviceInitialLoading || serviceLoadingMore) return;
    void loadServicesPage(servicePage + 1, 'append');
  };

  const handleBrowserScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (distanceToBottom <= SCROLL_THRESHOLD) {
      loadMoreActiveTab();
    }
  };

  const handleTabChange = (tab: BrowserTab) => {
    if (tab === browserTab) return;
    setBrowserTab(tab);
    if (tab === 'PRODUCT') {
      setProductItems([]);
      setProductPage(0);
      setProductHasMore(true);
      setProductLoadedKey('');
      return;
    }
    setServiceItems([]);
    setServicePage(0);
    setServiceHasMore(true);
    setServiceLoadedKey('');
  };

  const handleMachineModelChange = (value: string) => {
    setMachineModelId(value);
    setProductItems([]);
    setProductPage(0);
    setProductHasMore(true);
    setProductLoadedKey('');
    setServiceItems([]);
    setServicePage(0);
    setServiceHasMore(true);
    setServiceLoadedKey('');
  };

  const handleNewCart = async () => {
    try {
      const result = await createCart({}).unwrap();
      setSelectedCartId(result.data.id);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const patchCart = async (data: UpdateCartRequest) => {
    if (!selectedCart || !isEditable) return;
    try {
      await updateCart({ id: selectedCart.id, data }).unwrap();
    } catch {
      toast.error(t('common.error'));
    }
  };

  const addItem = async (item: ProductPrice | ServicePrice, itemType: ItemType) => {
    if (!selectedCart || !isEditable) return;
    const unitPrice = selectedPrice(item, selectedCustomerType);
    if (!unitPrice) return;
    try {
      await addCartItem({
        cartId: selectedCart.id,
        data: {
          itemType,
          productId: itemType === 'PRODUCT' ? (item as ProductPrice).productId : undefined,
          serviceId: itemType === 'SERVICE' ? (item as ServicePrice).serviceId : undefined,
          machineModelId: item.machineModelId,
          unitPrice,
          quantity: 1,
        },
      }).unwrap();
      toast.success(t('cart.addItemSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const patchItem = async (item: CartItem, data: UpdateCartItemRequest) => {
    if (!selectedCart || !isEditable) return;
    try {
      await updateCartItem({ cartId: selectedCart.id, itemId: item.id, data }).unwrap();
    } catch {
      toast.error(t('common.error'));
    }
  };

  const removeItem = async (item: CartItem) => {
    if (!selectedCart || !isEditable) return;
    try {
      await removeCartItem({ cartId: selectedCart.id, itemId: item.id }).unwrap();
      toast.success(t('cart.removeItemSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleCheckout = async (checkoutData: CheckoutRequest) => {
    try {
      await checkout(checkoutData).unwrap();
      toast.success(t('cart.checkoutSuccess'));
      setCheckoutOpen(false);
      setSelectedCartId(null);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="relative flex h-[calc(100dvh-4.5rem)] min-h-[620px] flex-col overflow-hidden rounded-xl border bg-background pb-24 md:pb-0 lg:h-[calc(100vh-4.5rem)] lg:min-h-[680px]">
      <div className="flex shrink-0 items-center gap-2 border-b bg-muted/30 px-3 py-2 sm:gap-3 sm:px-4">
        <div className="hidden w-44 shrink-0 border-r pr-4 xl:block">
          <h2 className="text-lg font-semibold leading-tight">{t('cart.title')}</h2>
          <p className="text-xs text-muted-foreground">POS Workstations</p>
        </div>
        <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
          {isLoadingCarts ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-72 shrink-0 rounded-xl" />
            ))
          ) : (
            carts.map((cart, index) => {
              const active = cart.id === selectedCart?.id;
              return (
                <button
                  key={cart.id}
                  type="button"
                  onClick={() => setSelectedCartId(cart.id)}
                  className={`w-52 shrink-0 rounded-xl border p-3 text-left transition-colors sm:w-64 lg:w-72 ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">Cart #{1024 + index}</p>
                    {active && (
                      <Badge className="bg-white/20 text-primary-foreground hover:bg-white/20">
                        {t('cartStatuses.ACTIVE')}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">
                    {cart.customer?.name ?? t('cart.walkInCustomer')}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className={active ? 'text-xs text-primary-foreground/85' : 'text-xs text-muted-foreground'}>
                      {(cart.items ?? []).length} {t('cart.items')} • {cart.mechanic?.name ?? t('cart.noMechanic')}
                    </p>
                    <p className="font-mono text-lg font-bold">{money(cartTotal(cart))}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <Button onClick={handleNewCart} disabled={isCreating} className="h-14 shrink-0 px-3 sm:h-16 sm:px-6">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t('cart.createCart')}</span>
          <span className="sm:hidden">{t('cart.new')}</span>
        </Button>
      </div>

      {!selectedCart && !isLoadingCarts ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <AppEmptyState
            icon={ShoppingCart}
            title={t('cart.noCarts')}
            description={t('cart.noCartsDesc')}
          />
          <Button onClick={handleNewCart}>{t('cart.createCart')}</Button>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,58%)_42%] xl:grid-cols-[minmax(0,1fr)_38%]">
          <section className="flex min-h-0 flex-col md:border-r">
            <div className="flex shrink-0 flex-col gap-3 border-b p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
              <div className="grid w-full grid-cols-2 rounded-lg bg-muted p-1 sm:w-auto">
                <Button
                  type="button"
                  variant={browserTab === 'PRODUCT' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleTabChange('PRODUCT')}
                >
                  {t('cart.products')}
                </Button>
                <Button
                  type="button"
                  variant={browserTab === 'SERVICE' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleTabChange('SERVICE')}
                >
                  {t('cart.services')}
                </Button>
              </div>
              <div className="relative w-full min-w-0 flex-1 sm:min-w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('cart.searchItemsPlaceholder')}
                  className="pl-9"
                />
              </div>
              <Select value={machineModelId} onValueChange={handleMachineModelChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={t('cart.machineModel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">{t('cart.allMachineModels')}</SelectItem>
                  {machineModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {modelName(model)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4" onScroll={handleBrowserScroll}>
              {activeInitialLoading && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-56 rounded-xl" />
                  ))}
                </div>
              )}
              {!activeInitialLoading && browserItems.length === 0 && (
                <AppEmptyState
                  icon={browserTab === 'PRODUCT' ? Package : Wrench}
                  title={browserTab === 'PRODUCT' ? t('cart.noProductsFound') : t('cart.noServicesFound')}
                />
              )}
              {!activeInitialLoading && browserItems.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {browserItems.map((item) => (
                      <BrowserCard
                        key={item.id}
                        type={browserTab}
                        item={item}
                        customerType={selectedCustomerType}
                        disabled={!isEditable || isAddingItem}
                        onAdd={() => addItem(item, browserTab)}
                      />
                    ))}
                  </div>
                  <div className="py-3 text-center text-xs text-muted-foreground">
                    {activeLoadingMore ? t('cart.loadingMore') : !activeHasMore ? t('cart.noMoreItems') : null}
                  </div>
                </div>
              )}
            </div>
          </section>

          <CartPanel
            className="hidden md:flex"
            selectedCart={selectedCart}
            customers={customers}
            mechanics={mechanics}
            isEditable={isEditable}
            isUpdatingCart={isUpdatingCart}
            isFetchingCart={isFetchingCart}
            subtotal={subtotal}
            commission={commission}
            grandTotal={grandTotal}
            netAfterCommission={netAfterCommission}
            patchCart={patchCart}
            patchItem={patchItem}
            removeItem={removeItem}
            onCheckout={() => setCheckoutOpen(true)}
          />
        </div>
      )}

      {selectedCart && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-screen-sm items-center gap-3">
              <Button variant="outline" className="h-12 flex-1" onClick={() => setMobileCartOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {(selectedCart.items ?? []).length} {t('cart.items')} · {money(grandTotal)}
              </Button>
              <Button
                className="h-12 flex-1"
                disabled={!isEditable || (selectedCart.items ?? []).length === 0}
                onClick={() => setCheckoutOpen(true)}
              >
                {t('cart.checkout')}
              </Button>
            </div>
          </div>

          <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
            <SheetContent side="bottom" className="max-h-[92dvh] gap-0 p-0">
              <SheetHeader className="border-b pr-12">
                <SheetTitle>{t('cart.cartInfo')}</SheetTitle>
              </SheetHeader>
              <CartPanel
                className="max-h-[calc(92dvh-56px)]"
                selectedCart={selectedCart}
                customers={customers}
                mechanics={mechanics}
                isEditable={isEditable}
                isUpdatingCart={isUpdatingCart}
                isFetchingCart={isFetchingCart}
                subtotal={subtotal}
                commission={commission}
                grandTotal={grandTotal}
                netAfterCommission={netAfterCommission}
                patchCart={patchCart}
                patchItem={patchItem}
                removeItem={removeItem}
                onCheckout={() => setCheckoutOpen(true)}
              />
            </SheetContent>
          </Sheet>
        </>
      )}

      {selectedCart && (
        <CheckoutDialog
          cartId={selectedCart.id}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          onConfirm={handleCheckout}
          isLoading={isCheckingOut}
        />
      )}
    </div>
  );
}

function CartPanel({
  className = '',
  selectedCart,
  customers,
  mechanics,
  isEditable,
  isUpdatingCart,
  isFetchingCart,
  subtotal,
  commission,
  grandTotal,
  netAfterCommission,
  patchCart,
  patchItem,
  removeItem,
  onCheckout,
}: {
  className?: string;
  selectedCart: Cart | undefined;
  customers: Customer[];
  mechanics: Customer[];
  isEditable: boolean;
  isUpdatingCart: boolean;
  isFetchingCart: boolean;
  subtotal: number;
  commission: number;
  grandTotal: number;
  netAfterCommission: number;
  patchCart: (data: UpdateCartRequest) => void;
  patchItem: (item: CartItem, data: UpdateCartItemRequest) => void;
  removeItem: (item: CartItem) => void;
  onCheckout: () => void;
}) {
  const { t } = useTranslation();

  return (
    <aside className={`flex min-h-0 flex-col bg-muted/20 ${className}`}>
      <div className="shrink-0 border-b p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <Select
            value={selectedCart?.customerId ?? '__none'}
            disabled={!isEditable || isUpdatingCart}
            onValueChange={(value) => patchCart({ customerId: value === '__none' ? null : value })}
          >
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder={t('cart.noCustomer')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">{t('cart.walkInCustomer')}</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedCart?.mechanicId ?? '__none'}
            disabled={!isEditable || isUpdatingCart}
            onValueChange={(value) => patchCart({ mechanicId: value === '__none' ? null : value })}
          >
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder={t('cart.noMechanic')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">{t('cart.noMechanic')}</SelectItem>
              {mechanics.map((mechanic) => (
                <SelectItem key={mechanic.id} value={mechanic.id}>
                  {mechanic.name} {mechanic.phone ? `(${mechanic.phone})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">{t('cart.commission')}</p>
            <Input
              type="number"
              key={`${selectedCart?.id ?? 'none'}-commission`}
              min="0"
              step="0.01"
              defaultValue={numberValue(selectedCart?.commissionAmount)}
              disabled={!isEditable}
              onBlur={(e) => patchCart({ commissionAmount: numberValue(e.target.value) })}
              className="h-10 bg-background font-mono"
            />
          </div>
          <div>
            <p className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              {t('cart.cartNote')} <ChevronDown className="h-3.5 w-3.5" />
            </p>
            <Textarea
              key={`${selectedCart?.id ?? 'none'}-note`}
              defaultValue={selectedCart?.note ?? ''}
              disabled={!isEditable}
              onBlur={(e) => patchCart({ note: e.target.value.trim() || undefined })}
              className="h-10 min-h-10 resize-none bg-background py-2"
            />
          </div>
        </div>
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 ${isFetchingCart ? 'opacity-60' : ''}`}>
        {(selectedCart?.items ?? []).length === 0 ? (
          <AppEmptyState icon={ShoppingCart} title={t('cart.noItems')} description={t('cart.addItemsHint')} />
        ) : (
          <div className="space-y-3">
            {(selectedCart?.items ?? []).map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                disabled={!isEditable}
                onPatch={(data) => patchItem(item, data)}
                onRemove={() => removeItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t bg-background p-3 shadow-[0_-8px_20px_rgba(15,23,42,0.06)] sm:p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('cart.subtotal')}</span>
            <span className="font-mono font-semibold">{money(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('cart.commission')}</span>
            <span className="font-mono font-semibold text-destructive">-{money(commission)}</span>
          </div>
          <Separator />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-semibold">{t('cart.grandTotal')}</p>
              <p className="mt-2 text-xs italic text-muted-foreground">
                {t('cart.netAfterCommission')}: <span className="font-mono">{money(netAfterCommission)}</span>
              </p>
            </div>
            <p className="font-mono text-2xl font-bold text-primary sm:text-3xl">{money(grandTotal)}</p>
          </div>
        </div>
        <Button
          className="mt-4 h-14 w-full text-base font-semibold sm:text-lg"
          disabled={!isEditable || !selectedCart || (selectedCart.items ?? []).length === 0}
          onClick={onCheckout}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {t('cart.checkout')} / {money(grandTotal)}
        </Button>
      </div>
    </aside>
  );
}

function BrowserCard({
  type,
  item,
  customerType,
  disabled,
  onAdd,
}: {
  type: BrowserTab;
  item: ProductPrice | ServicePrice;
  customerType?: Customer['customerType'];
  disabled?: boolean;
  onAdd: () => void;
}) {
  const { t } = useTranslation();
  const isProduct = type === 'PRODUCT';
  const product = item as ProductPrice;
  const service = item as ServicePrice;
  const primaryPrice = selectedPrice(item, customerType);
  const secondaryPrice = customerType === 'MECHANIC'
    ? numberValue(item.ownerPrice)
    : numberValue(item.mechanicPrice);
  const name = isProduct ? product.product.name : service.service.name;
  const imageUrl = isProduct ? product.imageUrl : null;

  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="flex h-56 flex-col p-0 sm:h-64">
        <div className="relative flex h-24 shrink-0 items-center justify-center overflow-hidden bg-muted sm:h-28">
          {imageUrl ? (
            <div
              role="img"
              aria-label={name}
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : isProduct ? (
            <Package className="h-10 w-10 text-primary" />
          ) : (
            <Wrench className="h-10 w-10 text-teal-600" />
          )}
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            {isProduct ? modelName(product.machineModel).toUpperCase() : 'SERVICE'}
          </Badge>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <p className="line-clamp-2 text-xs font-semibold sm:text-sm">{itemDisplayName(item, type)}</p>
          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{t('cart.price')}</p>
              {secondaryPrice > 0 && secondaryPrice !== primaryPrice && (
                <p className="font-mono text-xs text-muted-foreground line-through">{money(secondaryPrice)}</p>
              )}
            </div>
            <p className="font-mono text-lg font-bold text-primary sm:text-xl">{money(primaryPrice)}</p>
          </div>
          <Button className="mt-3 h-10 w-full" size="sm" disabled={disabled || !primaryPrice} onClick={onAdd}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t('cart.add')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CartItemRow({
  item,
  disabled,
  onPatch,
  onRemove,
}: {
  item: CartItem;
  disabled?: boolean;
  onPatch: (data: UpdateCartItemRequest) => void;
  onRemove: () => void;
}) {
  const isProduct = item.itemType === 'PRODUCT';
  const quantity = numberValue(item.quantity);
  const unitPrice = numberValue(item.unitPrice);

  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${isProduct ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-700'}`}>
          {isProduct ? <Package className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{isProduct ? 'PRD' : 'SVC'}</Badge>
            <p className="truncate text-sm font-semibold">{item.nameSnapshot}</p>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              defaultValue={unitPrice}
              disabled={disabled}
              onBlur={(e) => onPatch({ unitPrice: numberValue(e.target.value) })}
              className="h-9 w-24 font-mono text-xs"
            />
            <div className="flex items-center rounded-md border bg-muted/30">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={disabled || quantity <= 1}
                onClick={() => onPatch({ quantity: Math.max(1, quantity - 1) })}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Input
                type="number"
                min="1"
                step="1"
                defaultValue={quantity}
                disabled={disabled}
                onBlur={(e) => onPatch({ quantity: Math.max(1, numberValue(e.target.value)) })}
                className="h-9 w-12 border-0 bg-background text-center font-mono font-semibold shadow-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={disabled}
                onClick={() => onPatch({ quantity: quantity + 1 })}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono font-bold">{money(item.total)}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-1 h-9 w-9 text-muted-foreground"
            disabled={disabled}
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
