"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import { useCreateServicePriceMutation } from "../api";
import type {
  CreateServicePriceRequest,
  UpdateServicePriceRequest,
} from "../types";
import { ServicePriceForm } from "./ServicePriceForm";

export function ServicePriceCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createServicePrice, { isLoading }] = useCreateServicePriceMutation();

  const handleSubmit = async (
    data: CreateServicePriceRequest | UpdateServicePriceRequest,
  ) => {
    try {
      await createServicePrice(data as CreateServicePriceRequest).unwrap();
      toast.success(t("servicePrices.createSuccess"));
      router.replace("/admin/service-prices");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t("common.error");
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {t("servicePrices.createEntry")}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("servicePrices.entryDetail")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServicePriceForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
