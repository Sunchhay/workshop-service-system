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
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type { ServicePrice } from "../types";

interface ServicePriceTableProps {
  entries: ServicePrice[];
  onToggleStatus: (entry: ServicePrice) => void;
  onDelete: (entry: ServicePrice) => void;
}

function formatPrice(value: string | null | undefined) {
  if (value == null) return "—";
  return parseFloat(value).toFixed(2);
}

export function ServicePriceTable({
  entries,
  onToggleStatus,
  onDelete,
}: ServicePriceTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("servicePrices.service")}</TableHead>
            <TableHead>{t("servicePrices.machineModel")}</TableHead>
            <TableHead>{t("servicePrices.ownerPrice")}</TableHead>
            <TableHead>{t("servicePrices.mechanicPrice")}</TableHead>
            <TableHead>{t("servicePrices.statusLabel")}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                {t("servicePrices.noEntries")}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/service-prices/${entry.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">
                      {entry.service.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.service.code}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{entry.machineModel.modelName}</p>
                    {entry.machineModel.brand && (
                      <p className="text-xs text-muted-foreground">
                        {entry.machineModel.brand}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatPrice(entry.ownerPrice)}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatPrice(entry.mechanicPrice)}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
