"use client";

import { ChevronLeft, ChevronRight, Plus, Search, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CatalogCard } from "@/components/catalog/CatalogCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMachineModelsQuery } from "@/features/machine-models/api";
import { useGetProductsQuery } from "@/features/products/api";
import type { Product } from "@/features/products/types";
import { getProductDisplayName } from "@/lib/display-name";

import { useGetCartServiceCatalogQuery } from "../api";
import type { AddCartItemRequest, CartServiceCatalogItem } from "../types";
import { AddCustomItemDialog } from "./AddCustomItemDialog";
import { ServicePriceDialog } from "./ServicePriceDialog";

type CatalogTypeFilter = "ALL" | "SERVICE" | "PRODUCT";

const PAGE_SIZE = 12;

interface PosCatalogProps {
  onAddItem: (item: AddCartItemRequest) => void;
}

function formatModelName(model?: { brand: string; model: string } | null) {
  return model ? `${model.brand} ${model.model}`.trim() : "";
}

function productModel(product: Product) {
  const model = product.linkedReferenceBook?.machineModel;
  if (!model) return { id: undefined, name: undefined };
  return { id: model.id, name: formatModelName(model) };
}

export function PosCatalog({ onAddItem }: PosCatalogProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CatalogTypeFilter>("ALL");
  const [machineModelId, setMachineModelId] = useState("__all");
  const [showAllServices, setShowAllServices] = useState(false);
  const [servicePage, setServicePage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  // Service price dialog (for SERVICE-source items that have no suggested price)
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceDialogItem, setPriceDialogItem] = useState<CartServiceCatalogItem | null>(null);

  const selectedMachineModelId =
    machineModelId === "__all" ? undefined : machineModelId;

  // Debounce search → reset pages
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setServicePage(1);
      setProductPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset pages when filter/model/showAll changes
  useEffect(() => {
    setServicePage(1);
    setProductPage(1);
  }, [typeFilter, machineModelId, showAllServices]);

  const searchParam = debouncedSearch || undefined;

  // Machine models for the dropdown
  const { data: machineModelsData } = useGetMachineModelsQuery({
    isActive: true,
    limit: 200,
  });

  // Service catalog via new unified endpoint
  const { data: serviceCatalogData, isLoading: isServicesLoading } =
    useGetCartServiceCatalogQuery(
      {
        search: searchParam,
        machineModelId: selectedMachineModelId,
        showAll: showAllServices || undefined,
        page: servicePage,
        limit: PAGE_SIZE,
      },
      { skip: typeFilter === "PRODUCT" },
    );

  // Products
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery(
      {
        isActive: true,
        machineModelId: selectedMachineModelId,
        search: searchParam,
        page: productPage,
        limit: PAGE_SIZE,
      },
      { skip: typeFilter === "SERVICE" },
    );

  const machineModels = useMemo(
    () => machineModelsData?.data ?? [],
    [machineModelsData?.data],
  );
  const serviceItems: CartServiceCatalogItem[] = useMemo(
    () => serviceCatalogData?.data ?? [],
    [serviceCatalogData?.data],
  );
  const products = useMemo(
    () => productsData?.data ?? [],
    [productsData?.data],
  );

  const servicesMeta = serviceCatalogData?.meta;
  const productsMeta = productsData?.meta;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAddServiceItem = (item: CartServiceCatalogItem) => {
    if (item.source === "PRICE_CATALOG" && item.suggestedPrice) {
      // Auto-fill suggested price, add immediately
      onAddItem({
        type: "SERVICE",
        serviceId: item.serviceId,
        machineModelId: item.machineModelId,
        modelNameSnapshot: item.machineModelName,
        itemCode: item.code,
        itemNameKh: item.nameKh ?? "",
        itemNameEn: item.nameEn,
        description: item.label ?? item.nameEn,
        quantity: 1,
        unitPrice: parseFloat(item.suggestedPrice),
        discountAmount: 0,
      });
      toast.success("បានបន្ថែមសេវាកម្មទៅកន្ត្រក");
    } else {
      // Open price dialog for manual entry
      setPriceDialogItem(item);
      setPriceDialogOpen(true);
    }
  };

  const handleConfirmServicePrice = (price: number) => {
    if (!priceDialogItem) return;
    onAddItem({
      type: "SERVICE",
      serviceId: priceDialogItem.serviceId,
      machineModelId: priceDialogItem.machineModelId,
      modelNameSnapshot: priceDialogItem.machineModelName,
      itemCode: priceDialogItem.code,
      itemNameKh: priceDialogItem.nameKh ?? "",
      itemNameEn: priceDialogItem.nameEn,
      description: priceDialogItem.label ?? priceDialogItem.nameEn,
      quantity: 1,
      unitPrice: price,
      discountAmount: 0,
    });
    toast.success("បានបន្ថែមសេវាកម្មទៅកន្ត្រក");
    setPriceDialogItem(null);
  };

  const handleAddProduct = (product: Product) => {
    const model = productModel(product);
    onAddItem({
      type: "PRODUCT",
      productId: product.id,
      machineModelId: model.id,
      modelNameSnapshot: model.name,
      itemCode: product.code,
      itemNameKh: product.nameKh ?? product.name,
      itemNameEn: product.nameEn ?? product.name,
      description: getProductDisplayName(product),
      quantity: 1,
      unitPrice: parseFloat(product.sellingPrice) || 0,
      discountAmount: 0,
    });
    toast.success("បានបន្ថែមគ្រឿងបន្លាស់ទៅកន្ត្រក");
  };

  const isLoading = isServicesLoading || isProductsLoading;
  const hasServices = serviceItems.length > 0;
  const hasProducts = products.length > 0;
  const hasResults = hasServices || hasProducts;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="rounded-lg border bg-card p-2.5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_200px_auto] sm:items-end">
          {/* Search */}
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">ស្វែងរក</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ស្វែងរកសេវាកម្ម ឬ គ្រឿងបន្លាស់"
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">ប្រភេទ</Label>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as CatalogTypeFilter)}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ទាំងអស់</SelectItem>
                <SelectItem value="SERVICE">សេវាកម្ម</SelectItem>
                <SelectItem value="PRODUCT">គ្រឿងបន្លាស់</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">ម៉ូដែល</Label>
            <Select value={machineModelId} onValueChange={setMachineModelId}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="ជ្រើសម៉ូដែលដើម្បី Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">ទាំងអស់</SelectItem>
                {machineModels.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    មិនមានម៉ូដែល
                  </div>
                )}
                {machineModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.brand} {model.model}
                    {model.category ? ` · ${model.category}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add custom */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCustomOpen(true)}
            className="w-full sm:w-auto h-9 shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span className="sm:hidden md:inline">បន្ថែមផ្សេងៗ</span>
            <span className="hidden sm:inline md:hidden">ផ្សេងៗ</span>
          </Button>
        </div>

        {/* Show-all-services toggle — only visible when model is selected and showing services */}
        {selectedMachineModelId && typeFilter !== "PRODUCT" && (
          <div className="mt-2 flex items-center gap-2">
            <Checkbox
              id="show-all-services"
              checked={showAllServices}
              onCheckedChange={(v) => setShowAllServices(!!v)}
            />
            <label
              htmlFor="show-all-services"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              បង្ហាញសេវាទាំងអស់ (មិនត្រឹមតែ Price Catalog)
            </label>
          </div>
        )}
      </div>

      {/* Catalog list */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : !hasResults ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          <Wrench className="mx-auto h-8 w-8 mb-2 opacity-30" />
          <p>មិនមានទិន្នន័យត្រូវនឹងការស្វែងរកទេ</p>
          {selectedMachineModelId && !showAllServices && typeFilter !== "PRODUCT" && (
            <p className="mt-1 text-xs">
              គ្មាន Price Catalog សម្រាប់ម៉ូដែលនេះ ·{" "}
              <button
                type="button"
                className="underline text-primary"
                onClick={() => setShowAllServices(true)}
              >
                បង្ហាញសេវាទាំងអស់
              </button>
            </p>
          )}
          {debouncedSearch && (
            <p className="mt-1 text-xs">
              ព្យាយាមស្វែងរកពាក្យផ្សេង ឬ ផ្លាស់ប្ដូរ Filter
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Services section */}
          {hasServices && typeFilter !== "PRODUCT" && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  សេវាកម្ម
                  {servicesMeta && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      ({servicesMeta.total} សរុប)
                    </span>
                  )}
                </h3>
                {selectedMachineModelId && !showAllServices && (
                  <span className="text-[11px] text-primary font-medium">
                    Price Catalog
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {serviceItems.map((item) => (
                  <CatalogCard
                    key={`svc-${item.source}-${item.priceCatalogId ?? item.serviceId}`}
                    imageUrl={item.imageUrl}
                    primaryName={item.nameKh ?? item.nameEn}
                    secondaryName={
                      item.source === "PRICE_CATALOG"
                        ? item.machineModelName ?? item.label
                        : item.nameEn
                    }
                    code={item.code}
                    category={item.category}
                    priceLabel={
                      item.suggestedPrice
                        ? `$${parseFloat(item.suggestedPrice).toFixed(2)}`
                        : "បញ្ចូលតម្លៃ"
                    }
                    type="SERVICE"
                    onAdd={() => handleAddServiceItem(item)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Products section */}
          {hasProducts && typeFilter !== "SERVICE" && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  គ្រឿងបន្លាស់
                  {productsMeta && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      ({productsMeta.total} សរុប)
                    </span>
                  )}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const modelName = productModel(product).name;
                  return (
                    <CatalogCard
                      key={`product-${product.id}`}
                      imageUrl={product.imageUrl}
                      primaryName={
                        product.nameKh ?? product.name
                      }
                      secondaryName={modelName ?? product.nameEn}
                      code={product.code}
                      category={product.category ?? product.componentPartType}
                      priceLabel={`$${parseFloat(product.sellingPrice).toFixed(2)}`}
                      stockLabel={
                        product.stockQuantity <= product.reorderLevel
                          ? `Low: ${product.stockQuantity} ${product.unit}`
                          : `${product.stockQuantity} ${product.unit}`
                      }
                      type="PRODUCT"
                      onAdd={() => handleAddProduct(product)}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Pagination — services */}
      {typeFilter !== "PRODUCT" && servicesMeta && servicesMeta.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-sm">
          <span className="text-muted-foreground text-xs">
            សេវាកម្ម · ទំព័រ {servicesMeta.page}/{servicesMeta.totalPages} · {servicesMeta.total} ជួរ
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={servicePage <= 1}
              onClick={() => setServicePage((p) => Math.max(1, p - 1))}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">មុន</span>
            </Button>
            <span className="px-2 tabular-nums">{servicePage}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={servicePage >= servicesMeta.totalPages}
              onClick={() => setServicePage((p) => Math.min(servicesMeta.totalPages, p + 1))}
              className="h-8 px-2"
            >
              <span className="hidden sm:inline mr-1">បន្ទាប់</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Pagination — products */}
      {typeFilter !== "SERVICE" && productsMeta && productsMeta.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-sm">
          <span className="text-muted-foreground text-xs">
            គ្រឿងបន្លាស់ · ទំព័រ {productsMeta.page}/{productsMeta.totalPages} · {productsMeta.total} ជួរ
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={productPage <= 1}
              onClick={() => setProductPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">មុន</span>
            </Button>
            <span className="px-2 tabular-nums">{productPage}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={productPage >= productsMeta.totalPages}
              onClick={() => setProductPage((p) => Math.min(productsMeta.totalPages, p + 1))}
              className="h-8 px-2"
            >
              <span className="hidden sm:inline mr-1">បន្ទាប់</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AddCustomItemDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        onAdd={onAddItem}
      />

      <ServicePriceDialog
        service={priceDialogItem ? {
          id: priceDialogItem.serviceId,
          nameKh: priceDialogItem.nameKh,
          nameEn: priceDialogItem.nameEn,
          code: priceDialogItem.code,
        } : null}
        suggestedPrice={
          priceDialogItem?.suggestedPrice
            ? parseFloat(priceDialogItem.suggestedPrice)
            : undefined
        }
        open={priceDialogOpen}
        onOpenChange={setPriceDialogOpen}
        onConfirm={handleConfirmServicePrice}
      />
    </div>
  );
}
