"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import {
  useDeleteServicePriceMutation,
  useGetServicePriceQuery,
  useUpdateServicePriceStatusMutation,
} from "../api";
import type { ServicePrice } from "../types";
import { DeleteServicePriceDialog } from "./dialogs/DeleteServicePriceDialog";
import { DisableServicePriceDialog } from "./dialogs/DisableServicePriceDialog";

interface ServicePriceDetailPageProps {
  id: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(value: string | null | undefined) {
  if (value == null) return "—";
  return parseFloat(value).toFixed(2);
}

export function ServicePriceDetailPage({ id }: ServicePriceDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetServicePriceQuery(id);
  const [updateStatus, { isLoading: isToggling }] =
    useUpdateServicePriceStatusMutation();
  const [deleteServicePrice, { isLoading: isDeleting }] =
    useDeleteServicePriceMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const entry = data?.data;

  const handleStatusConfirm = async () => {
    if (!entry) return;
    try {
      await updateStatus({
        id,
        data: {
          status: entry.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      }).unwrap();
      toast.success(
        entry.status === "ACTIVE"
          ? t("servicePrices.disabledSuccess")
          : t("servicePrices.enabledSuccess"),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteServicePrice(id).unwrap();
      toast.success(t("servicePrices.deleteSuccess"));
      router.replace("/admin/service-prices");
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {t("servicePrices.entryDetail")}
        </h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : entry ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle>{entry.service.nameEn}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.service.code}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/service-prices/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t("common.edit")}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.statusLabel")}
                  </p>
                  <Badge
                    variant={entry.status === "ACTIVE" ? "default" : "outline"}
                    className={
                      entry.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
                        : "text-muted-foreground"
                    }
                  >
                    {t(
                      entry.status === "ACTIVE"
                        ? "common.active"
                        : "common.inactive",
                    )}
                  </Badge>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.machineModel")}
                  </p>
                  <p className="font-medium">{entry.machineModel.modelName}</p>
                  {entry.machineModel.brand && (
                    <p className="text-xs text-muted-foreground">
                      {entry.machineModel.brand}
                    </p>
                  )}
                </div>

                {entry.machineModel.machineType && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      {t("servicePrices.machineType")}
                    </p>
                    <p>{entry.machineModel.machineType}</p>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.ownerPrice")}
                  </p>
                  <p className="font-mono font-medium">
                    {formatPrice(entry.ownerPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.mechanicPrice")}
                  </p>
                  <p className="font-mono font-medium">
                    {formatPrice(entry.mechanicPrice)}
                  </p>
                </div>

                {entry.note && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">
                      {t("servicePrices.note")}
                    </p>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {entry.note}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.createdAt")}
                  </p>
                  <p>{formatDate(entry.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    {t("servicePrices.updatedAt")}
                  </p>
                  <p>{formatDate(entry.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={
                    entry.status === "ACTIVE"
                      ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                      : "border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400"
                  }
                >
                  {entry.status === "ACTIVE"
                    ? t("servicePrices.confirmDisableTitle")
                    : t("servicePrices.confirmEnableTitle")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t("servicePrices.confirmDeleteTitle")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <DisableServicePriceDialog
            servicePrice={entry as ServicePrice}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteServicePriceDialog
            servicePrice={entry as ServicePrice}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t("common.error")}</p>
      )}
    </div>
  );
}
