"use client";

import { BookOpen, Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppEmptyState } from "@/components/app/AppEmptyState";
import { AppSearchInput } from "@/components/app/AppSearchInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMachineModelsQuery } from "@/features/machine-models/api";
import { useGetServicesQuery } from "@/features/services/api";
import { getServiceDisplayName } from "@/lib/display-name";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import {
  useDeletePriceCatalogMutation,
  useGetPriceCatalogsQuery,
  useUpdatePriceCatalogStatusMutation,
} from "../api";
import type { PriceCatalog } from "../types";
import { DeletePriceCatalogDialog } from "./dialogs/DeletePriceCatalogDialog";
import { DisablePriceCatalogDialog } from "./dialogs/DisablePriceCatalogDialog";
import { PriceCatalogMobileCard } from "./PriceCatalogMobileCard";
import { PriceCatalogTable } from "./PriceCatalogTable";

const LIMIT = 20;
type StatusFilter = "true" | "false" | "__all";

export function PriceCatalogPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("__all");
  const [machineModelFilter, setMachineModelFilter] = useState("__all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("__all");

  const [pendingService, setPendingService] = useState("__all");
  const [pendingMachineModel, setPendingMachineModel] = useState("__all");
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>("__all");

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<PriceCatalog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PriceCatalog | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] =
    useUpdatePriceCatalogStatusMutation();
  const [deletePriceCatalog, { isLoading: isDeleting }] =
    useDeletePriceCatalogMutation();

  const { data: servicesData } = useGetServicesQuery({
    isActive: true,
    limit: 200,
  });
  const { data: machineModelsData } = useGetMachineModelsQuery({
    isActive: true,
    limit: 200,
  });
  const services = servicesData?.data ?? [];
  const machineModels = machineModelsData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetPriceCatalogsQuery({
    search: search || undefined,
    serviceId: serviceFilter === "__all" ? undefined : serviceFilter,
    machineModelId:
      machineModelFilter === "__all" ? undefined : machineModelFilter,
    isActive: statusFilter === "__all" ? undefined : statusFilter === "true",
    page,
    limit: LIMIT,
  });

  const entries = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (serviceFilter !== "__all" ? 1 : 0) +
    (machineModelFilter !== "__all" ? 1 : 0) +
    (statusFilter !== "__all" ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingService(serviceFilter);
      setPendingMachineModel(machineModelFilter);
      setPendingStatus(statusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setServiceFilter(pendingService);
    setMachineModelFilter(pendingMachineModel);
    setStatusFilter(pendingStatus);
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingService("__all");
    setPendingMachineModel("__all");
    setPendingStatus("__all");
    setServiceFilter("__all");
    setMachineModelFilter("__all");
    setStatusFilter("__all");
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilter(value);
    setPage(1);
  };

  const handleMachineModelFilterChange = (value: string) => {
    setMachineModelFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t("priceCatalog.disabledSuccess")
          : t("priceCatalog.enabledSuccess"),
      );
      setStatusDialogOpen(false);
      setStatusTarget(null);
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePriceCatalog(deleteTarget.id).unwrap();
      toast.success(t("priceCatalog.deleteSuccess"));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t("common.error"));
    }
  };

  const serviceOptions = (
    <>
      <SelectItem value="__all">{t("priceCatalog.allServices")}</SelectItem>
      {services.map((service) => (
        <SelectItem key={service.id} value={service.id}>
          {getServiceDisplayName(service)}
        </SelectItem>
      ))}
    </>
  );

  const machineModelOptions = (
    <>
      <SelectItem value="__all">
        {t("priceCatalog.allMachineModels")}
      </SelectItem>
      {machineModels.map((model) => (
        <SelectItem key={model.id} value={model.id}>
          {model.brand} {model.model}
        </SelectItem>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t("priceCatalog.title")}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/price-catalog/create">
            <Plus className="h-4 w-4 mr-1" />
            {t("priceCatalog.createEntry")}
          </Link>
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t("priceCatalog.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput("")}
        />

        <div className="hidden md:flex gap-3">
          <Select
            value={serviceFilter}
            onValueChange={handleServiceFilterChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("priceCatalog.allServices")} />
            </SelectTrigger>
            <SelectContent>{serviceOptions}</SelectContent>
          </Select>

          <Select
            value={machineModelFilter}
            onValueChange={handleMachineModelFilterChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("priceCatalog.allMachineModels")} />
            </SelectTrigger>
            <SelectContent>{machineModelOptions}</SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => handleStatusFilterChange(v as StatusFilter)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t("priceCatalog.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">
                {t("priceCatalog.allStatuses")}
              </SelectItem>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Sheet open={filterSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex md:hidden relative shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>{t("common.filters")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {t("priceCatalog.service")}
                </p>
                <Select
                  value={pendingService}
                  onValueChange={setPendingService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("priceCatalog.allServices")} />
                  </SelectTrigger>
                  <SelectContent>{serviceOptions}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {t("priceCatalog.machineModel")}
                </p>
                <Select
                  value={pendingMachineModel}
                  onValueChange={setPendingMachineModel}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("priceCatalog.allMachineModels")}
                    />
                  </SelectTrigger>
                  <SelectContent>{machineModelOptions}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {t("priceCatalog.statusLabel")}
                </p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("priceCatalog.allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">
                      {t("priceCatalog.allStatuses")}
                    </SelectItem>
                    <SelectItem value="true">{t("common.active")}</SelectItem>
                    <SelectItem value="false">
                      {t("common.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1"
              >
                {t("common.reset")}
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                {t("common.apply")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className={`hidden md:block ${isFetching ? "opacity-60" : ""}`}>
          <PriceCatalogTable
            entries={entries}
            onToggleStatus={(entry) => {
              setStatusTarget(entry);
              setStatusDialogOpen(true);
            }}
            onDelete={(entry) => {
              setDeleteTarget(entry);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      )}

      {!isLoading && (
        <div
          className={`md:hidden space-y-3 ${isFetching ? "opacity-60" : ""}`}
        >
          {entries.length === 0 ? (
            <AppEmptyState
              icon={BookOpen}
              title={t("priceCatalog.noEntries")}
              description={t("priceCatalog.noEntriesDesc")}
            />
          ) : (
            entries.map((entry) => (
              <PriceCatalogMobileCard
                key={entry.id}
                entry={entry}
                onToggleStatus={(target) => {
                  setStatusTarget(target);
                  setStatusDialogOpen(true);
                }}
                onDelete={(target) => {
                  setDeleteTarget(target);
                  setDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, meta.total)} /{" "}
            {meta.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              {t("common.back")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isFetching}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}

      <DisablePriceCatalogDialog
        entry={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeletePriceCatalogDialog
        entry={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
