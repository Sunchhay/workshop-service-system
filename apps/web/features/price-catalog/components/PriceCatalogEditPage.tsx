"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import { useGetPriceCatalogQuery, useUpdatePriceCatalogMutation } from "../api";
import type {
  CreatePriceCatalogRequest,
  UpdatePriceCatalogRequest,
} from "../types";
import { PriceCatalogForm } from "./PriceCatalogForm";

interface PriceCatalogEditPageProps {
  id: string;
}

export function PriceCatalogEditPage({ id }: PriceCatalogEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetPriceCatalogQuery(id);
  const [updatePriceCatalog, { isLoading: isUpdating }] =
    useUpdatePriceCatalogMutation();

  const handleSubmit = async (
    payload: CreatePriceCatalogRequest | UpdatePriceCatalogRequest,
  ) => {
    try {
      await updatePriceCatalog({
        id,
        data: payload as UpdatePriceCatalogRequest,
      }).unwrap();
      toast.success(t("priceCatalog.updateSuccess"));
      router.replace(`/admin/price-catalog/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t("common.error");
      toast.error(message);
    }
  };

  const entry = data?.data;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t("priceCatalog.editEntry")}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("priceCatalog.entryDetail")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <div className="grid grid-cols-2 gap-5">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : entry ? (
            <PriceCatalogForm
              mode="edit"
              defaultValues={{
                serviceId: entry.serviceId,
                machineModelId: entry.machineModelId,
                label: entry.label,
                unitPrice: entry.unitPrice,
                currency: entry.currency,
                notes: entry.notes ?? "",
                effectiveDate: entry.effectiveDate
                  ? entry.effectiveDate.split("T")[0]
                  : "",
                expiredDate: entry.expiredDate
                  ? entry.expiredDate.split("T")[0]
                  : "",
                isActive: entry.isActive,
              }}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          ) : (
            <p className="text-muted-foreground">{t("common.error")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
