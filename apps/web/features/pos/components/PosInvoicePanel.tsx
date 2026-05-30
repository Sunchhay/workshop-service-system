"use client";

import { FileText, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetCustomersQuery } from "@/features/customers/api";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type {
  Cart,
  CartItem,
  PaymentMethod,
  UpdateCartItemRequest,
  UpdateCartRequest,
} from "../types";
import {
  useCheckoutCartMutation,
  useCreateQuotationFromCartMutation,
} from "../api";
import { QuickAddCustomerDialog } from "./QuickAddCustomerDialog";

function n(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function fmt(value: unknown): string {
  return `$${n(value, 0).toFixed(2)}`;
}

// ─── LineItem ─────────────────────────────────────────────────────────────────

function LineItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: CartItem;
  onUpdate: (itemId: string, patch: Partial<UpdateCartItemRequest>) => void;
  onRemove: (itemId: string) => void;
}) {
  const { t } = useTranslation();
  const qty = n(item.quantity, 1);
  const price = n(item.unitPrice, 0);
  const discount = n(item.discountAmount, 0);
  const lineTotal = Math.max(0, qty * price - discount);
  const baseName =
    item.itemNameKh || item.itemNameEn || item.description || "Item";
  const typeLabel =
    item.type === "SERVICE"
      ? "សេវាកម្ម"
      : item.type === "PRODUCT"
        ? "គ្រឿងបន្លាស់"
        : "ផ្សេងៗ";

  return (
    <div className="py-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight truncate">
            {baseName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
            {item.modelNameSnapshot && <span>{item.modelNameSnapshot}</span>}
            <span>{typeLabel}</span>
            {item.itemCode && (
              <span className="font-mono">{item.itemCode}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
          aria-label={t("pos.removeItem")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-[82px_1fr_1fr] gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">ចំនួន</span>
          <div className="flex h-8 items-center gap-1 rounded border">
            <button
              type="button"
              className="h-7 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => {
                const newQty = Math.max(0.001, qty - 1);
                onUpdate(item.id, { quantity: newQty });
              }}
            >
              <Minus className="h-3 w-3" />
            </button>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={qty}
              onChange={(e) => {
                const newQty = Math.max(0.001, n(e.target.value, 1));
                onUpdate(item.id, { quantity: newQty });
              }}
              className="w-8 text-center text-sm bg-transparent border-0 outline-none"
            />
            <button
              type="button"
              className="h-7 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => onUpdate(item.id, { quantity: qty + 1 })}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <label className="space-y-1">
          <span className="text-[10px] text-muted-foreground">តម្លៃ</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) =>
              onUpdate(item.id, { unitPrice: n(e.target.value, 0) })
            }
            className="h-8 text-sm px-2"
          />
        </label>

        <label className="space-y-1">
          <span className="text-[10px] text-muted-foreground">បញ្ចុះតម្លៃ</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={discount}
            onChange={(e) =>
              onUpdate(item.id, { discountAmount: n(e.target.value, 0) })
            }
            className="h-8 text-sm px-2"
          />
        </label>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">សរុប</span>
        <span className="font-mono text-sm font-medium">{fmt(lineTotal)}</span>
      </div>
    </div>
  );
}

// ─── PosInvoicePanel ──────────────────────────────────────────────────────────

interface PosInvoicePanelProps {
  cart: Cart;
  onPatchCart: (patch: Partial<UpdateCartRequest>) => void;
  onUpdateItem: (itemId: string, patch: Partial<UpdateCartItemRequest>) => void;
  onRemoveItem: (itemId: string) => void;
  saveStatus: "idle" | "saving" | "saved";
}

export function PosInvoicePanel({
  cart,
  onPatchCart,
  onUpdateItem,
  onRemoveItem,
  saveStatus,
}: PosInvoicePanelProps) {
  const { t } = useTranslation();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");

  const { data: customersData } = useGetCustomersQuery({
    isActive: true,
    limit: 200,
  });
  const customers = customersData?.data ?? [];

  const [checkoutCart, { isLoading: isCheckingOut }] =
    useCheckoutCartMutation();
  const [createQuotation, { isLoading: isQuoting }] =
    useCreateQuotationFromCartMutation();

  const items = cart.items;

  // NaN-safe totals computed from CartItem rows
  const subtotal = items.reduce((sum, item) => {
    return (
      sum +
      Math.max(
        0,
        n(item.quantity, 1) * n(item.unitPrice, 0) - n(item.discountAmount, 0),
      )
    );
  }, 0);
  const cartDiscount = n(cart.discountAmount, 0);
  const total = Math.max(0, subtotal - cartDiscount);
  const paid = n(paidAmount, 0);
  const change = Math.max(0, paid - total);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error(t("sales.itemsRequired"));
      return;
    }
    if (!cart.customerId) {
      toast.error(t("pos.customerRequiredForInvoice"));
      return;
    }
    try {
      await checkoutCart({
        id: cart.id,
        data: {
          paidAmount: paid > 0 ? paid : undefined,
          paymentMethod: cart.paymentMethod,
        },
      }).unwrap();
      toast.success(t("pos.checkoutWithInvoiceSuccess"));
      setPaidAmount("");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        t("common.error");
      toast.error(msg);
    }
  };

  const handleCreateQuotation = async () => {
    if (items.length === 0) {
      toast.error(t("sales.itemsRequired"));
      return;
    }
    try {
      const result = await createQuotation({ cartId: cart.id }).unwrap();
      toast.success(
        `${t("pos.quotationSuccess")} — ${result.data.quotationNumber}`,
      );
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        t("common.error");
      toast.error(msg);
    }
  };

  const handleCustomerCreated = (customer: {
    id: string;
    name: string;
    phone: string;
  }) => {
    onPatchCart({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Save status */}
      <div className="flex items-center justify-between px-1 pb-2 text-xs text-muted-foreground">
        <span className="font-mono">{cart.cartCode}</span>
        {saveStatus === "saving" && (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("pos.saveStatus.saving")}
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="text-green-600">{t("pos.saveStatus.saved")}</span>
        )}
      </div>

      {/* Customer */}
      <div className="space-y-1.5 pb-3">
        <Label className="text-xs text-muted-foreground">
          {t("pos.customer")}
        </Label>
        <Select
          value={cart.customerId ?? "walkin"}
          onValueChange={(v) => {
            if (v === "walkin") {
              onPatchCart({
                customerId: null,
                customerName: "Walk-in Customer",
                customerPhone: "",
              });
            } else if (v === "quickadd") {
              setQuickAddOpen(true);
            } else {
              const cust = customers.find((c) => c.id === v);
              if (cust)
                onPatchCart({
                  customerId: cust.id,
                  customerName: cust.name,
                  customerPhone: cust.phone ?? "",
                });
            }
          }}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walkin">{t("pos.walkIn")}</SelectItem>
            <SelectItem value="quickadd" className="text-primary font-medium">
              + {t("pos.quickAddCustomer")}
            </SelectItem>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} · {c.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cart.customerId && (
          <p className="text-xs text-muted-foreground">{cart.customerPhone}</p>
        )}
      </div>

      <Separator />

      {/* Items list */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        {items.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm space-y-1">
            <p className="font-medium">{t("pos.noItems")}</p>
            <p className="text-xs">{t("pos.noItemsDesc")}</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <LineItem
                key={item.id}
                item={item}
                onUpdate={onUpdateItem}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator className="my-3" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>{t("pos.subtotal")}</span>
          <span className="font-mono">{fmt(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground shrink-0">
            {t("pos.discount")}
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={cartDiscount || ""}
            onChange={(e) =>
              onPatchCart({ discountAmount: parseFloat(e.target.value) || 0 })
            }
            className="h-7 w-24 text-sm text-right px-2"
            placeholder="0.00"
          />
        </div>

        <div className="flex justify-between font-bold text-base">
          <span>{t("pos.total")}</span>
          <span className="font-mono">{fmt(total)}</span>
        </div>
      </div>

      <Separator className="my-3" />

      {/* Payment method + paid amount */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select
            value={cart.paymentMethod}
            onValueChange={(v) =>
              onPatchCart({ paymentMethod: v as PaymentMethod })
            }
          >
            <SelectTrigger className="h-8 text-sm flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="ABA">ABA</SelectItem>
              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder={t("pos.paidAmountLabel")}
            className="h-8 w-24 text-sm"
          />
        </div>
        {paid > total && total > 0 && (
          <p className="text-xs text-green-600 text-right">
            {t("pos.change")}: {fmt(change)}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-3">
        <Button
          variant="outline"
          className="w-full"
          disabled={items.length === 0 || isQuoting || isCheckingOut}
          onClick={handleCreateQuotation}
        >
          {isQuoting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          {t("pos.createQuotation")}
        </Button>

        <Button
          className="w-full"
          disabled={items.length === 0 || isCheckingOut || isQuoting || !cart.customerId}
          onClick={handleCheckout}
          title={!cart.customerId ? t("pos.customerRequiredForInvoice") : undefined}
        >
          {isCheckingOut && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {t("pos.checkoutSale")}
        </Button>

        {!cart.customerId && items.length > 0 && (
          <p className="text-xs text-amber-600 text-center">
            {t("pos.customerRequiredForInvoice")}
          </p>
        )}
      </div>

      <QuickAddCustomerDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onCreated={handleCustomerCreated}
      />
    </div>
  );
}
