"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import { usePosCarts } from "../hooks/usePosCarts";
import type { AddCartItemRequest } from "../types";
import { MobileInvoiceBar } from "./MobileInvoiceBar";
import { PosCatalog } from "./PosCatalog";
import { PosCartTabs } from "./PosCartTabs";
import { PosInvoicePanel } from "./PosInvoicePanel";

export function PosPage() {
  const { t } = useTranslation();
  const {
    carts,
    isLoading,
    activeCartId,
    setActiveCartId,
    localCart,
    saveStatus,
    patchCart,
    addItem,
    updateItem,
    removeItem,
    createCart,
    deleteCart,
  } = usePosCarts();
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32 md:pb-4">
      {/* Cart tabs */}
      <PosCartTabs
        carts={carts}
        activeCartId={activeCartId}
        onSelectCart={setActiveCartId}
        onCreateCart={createCart}
        onDeleteCart={deleteCart}
      />

      {/* No cart state */}
      {!localCart ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            <div>
              <p className="font-semibold">{t("pos.noCart")}</p>
              <p className="text-sm text-muted-foreground">
                {t("pos.noCartDesc")}
              </p>
            </div>
            <Button onClick={createCart}>{t("pos.createCart")}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop: two-column layout */}
          <div className="hidden md:grid grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-4 items-start">
            <div className="min-w-0">
              <PosCatalog
                onAddItem={(data: AddCartItemRequest) => addItem(data)}
              />
            </div>

            <div className="sticky top-[72px]">
              <Card className="h-[calc(100vh-108px)] flex flex-col">
                <CardContent className="flex-1 flex flex-col p-3 overflow-hidden">
                  <PosInvoicePanel
                    cart={localCart}
                    onPatchCart={patchCart}
                    onUpdateItem={updateItem}
                    onRemoveItem={removeItem}
                    saveStatus={saveStatus}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile: catalog full width + sticky bottom bar */}
          <div className="md:hidden">
            <PosCatalog
              onAddItem={(data: AddCartItemRequest) => addItem(data)}
            />
          </div>

          <MobileInvoiceBar
            cart={localCart}
            onPatchCart={patchCart}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            saveStatus={saveStatus}
          />
        </>
      )}
    </div>
  );
}
