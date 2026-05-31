"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import { useGetServicePriceQuery, useUpdateServicePriceMutation } from "../api";
import type {
  CreateServicePriceRequest,
  UpdateServicePriceRequest,
} from "../types";
import { ServicePriceForm } from "./ServicePriceForm";

interface ServicePriceEditPageProps {
  id: string;
}

export function ServicePriceEditPage({ id }: ServicePriceEditPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetServicePriceQuery(id);
  const [updateServicePrice, { isLoading: isUpdating }] =
    useUpdateServicePriceMutation();

  const handleSubmit = async (
    payload: CreateServicePriceRequest | UpdateServicePriceRequest,
  ) => {
    try {
      await updateServicePrice({
        id,
        data: payload as UpdateServicePriceRequest,
      }).unwrap();
      toast.success(t("servicePrices.updateSuccess"));
      router.replace(`/admin/service-prices/${id}`);
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
        <h2 className="text-xl font-semibold">
          {t("servicePrices.editEntry")}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("servicePrices.entryDetail")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : entry ? (
            <ServicePriceForm
              mode="edit"
              defaultValues={{
                serviceId: entry.serviceId,
                machineModelId: entry.machineModelId,
                ownerPrice:
                  entry.ownerPrice != null
                    ? String(parseFloat(entry.ownerPrice))
                    : "",
                mechanicPrice:
                  entry.mechanicPrice != null
                    ? String(parseFloat(entry.mechanicPrice))
                    : "",
                note: entry.note ?? "",
                status: entry.status,
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
