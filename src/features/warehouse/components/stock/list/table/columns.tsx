"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { StockLevel } from "@/features/warehouse/types";

const alertVariantMap: Record<string, "destructive" | "warning" | "success"> = {
  Critical: "destructive",
  Warning: "warning",
  OK: "success",
};

const formatIdr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const useStockColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "stockItemName",
      accessorFn: (row) => row.stockItemName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.itemDetails", "Item Details")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.stockItemName}</div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
            SKU: {row.original.stockItemSku} • {row.original.stockItemCategory.replace("_", " ")}
          </div>
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
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-foreground">{row.original.warehouseName}</div>
          <div className="text-[10px] text-muted-foreground">{row.original.warehouseBranch}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "currentStock",
      accessorFn: (row) => row.currentStock,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.stockStatus", "Stock Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-foreground">
          {row.original.currentStock.toLocaleString()} {row.original.uom}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "threshold",
      accessorFn: (row) => row.threshold,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.thresholdLabel", "Threshold")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-muted-foreground">
          {row.original.threshold.toLocaleString()} {row.original.uom}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "alertStatus",
      accessorFn: (row) => row.alertStatus,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.alertStatus", "Alert")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={alertVariantMap[row.original.alertStatus] || "secondary"}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.alertStatus}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
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
  ] as ColumnDef<StockLevel>[];
};
