"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeftRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { InventoryValuationConfig } from "../../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const useInventoryConfigColumns = () => {
  const { t } = useTranslation();

  return useMemo<ColumnDef<InventoryValuationConfig>[]>(
    () => [
      {
        id: "warehouseName",
        accessorFn: (row) => row.warehouseName,
        header: ({ column }) => (
          <DataGridColumnHeader title={t("warehouse.warehouseName", "Warehouse Name")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{row.original.warehouseName}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {row.original.warehouseId}</div>
          </div>
        ),
        meta: { skeleton: <Skeleton className="h-8 w-48" /> },
        enableSorting: true,
        size: 220,
      },
      {
        id: "valuationMethod",
        accessorFn: (row) => row.valuationMethod,
        header: ({ column }) => (
          <DataGridColumnHeader title={t("warehouse.valuationMethod", "Valuation Method")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => (
          <Badge
            className={`font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
              row.original.valuationMethod === "FIFO"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
            }`}
          >
            <ArrowLeftRight className="size-3 mr-1" />
            {row.original.valuationMethod}
          </Badge>
        ),
        meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
        enableSorting: true,
        size: 140,
      },
      {
        id: "configuredBy",
        accessorFn: (row) => row.configuredBy,
        header: ({ column }) => (
          <DataGridColumnHeader title={t("warehouse.configuredBy", "Configured By")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{row.original.configuredBy}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-32" /> },
        enableSorting: true,
        size: 160,
      },
      {
        id: "configuredAt",
        accessorFn: (row) => row.configuredAt,
        header: ({ column }) => (
          <DataGridColumnHeader title={t("warehouse.configuredAt", "Configured At")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {new Date(row.original.configuredAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
        enableSorting: true,
        size: 120,
      },
      {
        id: "notes",
        accessorFn: (row) => row.notes,
        header: ({ column }) => (
          <DataGridColumnHeader title={t("common.notes", "Notes")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 max-w-xs truncate block">{row.original.notes || "-"}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-40" /> },
        enableSorting: false,
        size: 200,
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("common.actions", "Actions")} column={column} className="text-foreground font-semibold" />
        ),
        cell: ({ row }) => <ActionsCell row={row} />,
        meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
        enableSorting: false,
        size: 75,
      },
    ],
    [t]
  );
};
