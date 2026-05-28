"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { StockMovementReport } from "@/features/warehouse/types";

const movementTypeVariantMap: Record<string, "info" | "secondary" | "destructive" | "success" | "warning"> = {
  dispatch: "info",
  receive: "success",
  transfer_in: "success",
  transfer_out: "warning",
  adjustment: "destructive",
  return: "secondary",
};

export const useReportColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "date",
      accessorFn: (row) => row.date,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.date", "Date")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="text-sm text-foreground">{new Date(row.original.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "stockItemName",
      accessorFn: (row) => row.stockItemName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.itemDetails", "Item")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.stockItemName}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{row.original.stockItemSku}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "warehouseName",
      accessorFn: (row) => row.warehouseName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.warehouseLabel", "Warehouse")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="text-sm text-foreground">{row.original.warehouseName}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "movementType",
      accessorFn: (row) => row.movementType,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.movementType", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={movementTypeVariantMap[row.original.movementType] || "secondary"} appearance="light" className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
          {row.original.movementType.replace("_", " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "quantity",
      accessorFn: (row) => row.quantity,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.quantity", "Quantity")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className={`font-bold text-sm ${row.original.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
          {row.original.quantity > 0 ? "+" : ""}{row.original.quantity.toLocaleString()} {row.original.uom}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "reference",
      accessorFn: (row) => row.reference,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.reference", "Reference")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-mono text-[10px] text-muted-foreground">{row.original.reference}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
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
  ] as ColumnDef<StockMovementReport>[];
};
