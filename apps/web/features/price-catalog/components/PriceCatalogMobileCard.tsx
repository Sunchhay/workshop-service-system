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
import { getServiceDisplayName } from "@/lib/display-name";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type { PriceCatalog } from "../types";

interface PriceCatalogMobileCardProps {
  entry: PriceCatalog;
  onToggleStatus: (entry: PriceCatalog) => void;
  onDelete: (entry: PriceCatalog) => void;
}

export function PriceCatalogMobileCard({
  entry,
  onToggleStatus,
  onDelete,
}: PriceCatalogMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/price-catalog/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/admin/price-catalog/${entry.id}`);
      }}
    >
      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{entry.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {getServiceDisplayName(entry.service)} ({entry.service.code})
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {entry.machineModel.brand} {entry.machineModel.model}
        </p>
        <p className="text-sm font-mono mt-1">
          {parseFloat(entry.unitPrice).toFixed(2)}{" "}
          <span className="text-xs text-muted-foreground">
            {entry.currency}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge
            variant={entry.isActive ? "default" : "outline"}
            className={
              entry.isActive
                ? "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
                : "text-muted-foreground"
            }
          >
            {t(entry.isActive ? "common.active" : "common.inactive")}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/price-catalog/${entry.id}`}>
                {t("priceCatalog.entryDetail")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/price-catalog/${entry.id}/edit`}>
                {t("common.edit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(entry)}
              className={
                entry.isActive
                  ? "text-destructive focus:text-destructive"
                  : "text-green-600 focus:text-green-600"
              }
            >
              {entry.isActive
                ? t("priceCatalog.confirmDisableTitle")
                : t("priceCatalog.confirmEnableTitle")}
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
