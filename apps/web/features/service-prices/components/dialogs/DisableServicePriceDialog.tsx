"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type { ServicePrice } from "../../types";

interface DisableServicePriceDialogProps {
  servicePrice: ServicePrice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableServicePriceDialog({
  servicePrice,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableServicePriceDialogProps) {
  const { t } = useTranslation();

  if (!servicePrice) return null;

  const isDisabling = servicePrice.status === "ACTIVE";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t("servicePrices.confirmDisableTitle")
              : t("servicePrices.confirmEnableTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {servicePrice.service.nameEn} —{" "}
              {servicePrice.machineModel.modelName}
            </span>{" "}
            —{" "}
            {isDisabling
              ? t("servicePrices.confirmDisableDesc")
              : t("servicePrices.confirmEnableDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isDisabling
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : ""
            }
          >
            {isDisabling
              ? t("servicePrices.confirmDisableTitle")
              : t("servicePrices.confirmEnableTitle")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
