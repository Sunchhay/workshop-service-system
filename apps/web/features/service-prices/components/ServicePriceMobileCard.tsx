"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type { ServicePrice } from "../types";

interface ServicePriceMobileCardProps {
  entry: ServicePrice;
  onToggleStatus: (entry: ServicePrice) => void;
  onDelete: (entry: ServicePrice) => void;
}

function formatPrice(value: string | null | undefined) {
  if (value == null) return "—";
  return parseFloat(value).toFixed(2);
}

export function ServicePriceMobileCard({
  entry,
  onToggleStatus,
  onDelete,
}: ServicePriceMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/service-prices/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/admin/service-prices/${entry.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{entry.service.nameEn}</span>
          <span className="text-muted-foreground text-xs">
            {entry.service.code}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {entry.machineModel.modelName}
          {entry.machineModel.brand ? ` · ${entry.machineModel.brand}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>
            <span className="text-muted-foreground">
              {t("servicePrices.ownerPrice")}:{" "}
            </span>
            <span className="font-mono">{formatPrice(entry.ownerPrice)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">
              {t("servicePrices.mechanicPrice")}:{" "}
            </span>
            <span className="font-mono">
              {formatPrice(entry.mechanicPrice)}
            </span>
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge
            variant={entry.status === "ACTIVE" ? "default" : "outline"}
            className={
              entry.status === "ACTIVE"
                ? "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
                : "text-muted-foreground"
            }
          >
            {t(entry.status === "ACTIVE" ? "common.active" : "common.inactive")}
          </Badge>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/service-prices/${entry.id}`}>
                {t("servicePrices.entryDetail")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/service-prices/${entry.id}/edit`}>
                {t("common.edit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(entry)}
              className={
                entry.status === "ACTIVE"
                  ? "text-destructive focus:text-destructive"
                  : "text-green-600 focus:text-green-600"
              }
            >
              {entry.status === "ACTIVE"
                ? t("servicePrices.confirmDisableTitle")
                : t("servicePrices.confirmEnableTitle")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(entry)}
              className="text-destructive focus:text-destructive"
            >
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
