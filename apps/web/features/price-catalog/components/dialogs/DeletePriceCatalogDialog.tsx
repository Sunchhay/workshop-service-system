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

import type { PriceCatalog } from "../../types";

interface DeletePriceCatalogDialogProps {
  entry: PriceCatalog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeletePriceCatalogDialog({
  entry,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeletePriceCatalogDialogProps) {
  const { t } = useTranslation();

  if (!entry) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("priceCatalog.confirmDeleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{entry.label}</span> —{" "}
            {t("priceCatalog.confirmDeleteDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
