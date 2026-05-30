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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServiceDisplayName } from "@/lib/display-name";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type { PriceCatalog } from "../types";

interface PriceCatalogTableProps {
  entries: PriceCatalog[];
  onToggleStatus: (entry: PriceCatalog) => void;
  onDelete: (entry: PriceCatalog) => void;
}

export function PriceCatalogTable({
  entries,
  onToggleStatus,
  onDelete,
}: PriceCatalogTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("priceCatalog.service")}</TableHead>
            <TableHead>{t("priceCatalog.machineModel")}</TableHead>
            <TableHead>{t("priceCatalog.label")}</TableHead>
            <TableHead>{t("priceCatalog.unitPrice")}</TableHead>
            <TableHead>{t("priceCatalog.currency")}</TableHead>
            <TableHead>{t("priceCatalog.statusLabel")}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-10"
              >
                {t("priceCatalog.noEntries")}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/price-catalog/${entry.id}`)}
              >
                {/* Service */}
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {getServiceDisplayName(entry.service)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {entry.service.code}
                    </p>
                  </div>
                </TableCell>
                {/* Machine model */}
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {entry.machineModel.brand} {entry.machineModel.model}
                    </p>
                    {entry.machineModel.category && (
                      <p className="text-xs text-muted-foreground">
                        {entry.machineModel.category}
                      </p>
                    )}
                  </div>
                </TableCell>
                {/* Label */}
                <TableCell>
                  <p className="text-sm max-w-[200px] truncate">
                    {entry.label}
                  </p>
                </TableCell>
                {/* Price */}
                <TableCell className="font-mono text-sm">
                  {parseFloat(entry.unitPrice).toFixed(2)}
                </TableCell>
                {/* Currency */}
                <TableCell className="text-sm text-muted-foreground">
                  {entry.currency}
                </TableCell>
                {/* Status */}
                <TableCell>
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
                </TableCell>
                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
