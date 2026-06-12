"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";

export const useStockColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.itemDetails", "Item Details")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.name}</div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
            SKU: {row.original.sku} • {row.original.category_code}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 220,
    },
    {
      id: "brandModel",
      accessorFn: (row) => `${row.brand} ${row.model}`,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.brandModel", "Brand / Model")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-foreground">
            {row.original.brand}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {row.original.model}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "unit",
      accessorFn: (row) => row.unit,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.unit", "Unit")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.unit}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 80,
    },
    {
      id: "valuation_method",
      accessorFn: (row) => row.valuation_method,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.valuationMethod", "Valuation")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-muted-foreground">
          {row.original.valuation_method}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "active",
      accessorFn: (row) => row.active,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.activeStatus", "Status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.active ? "success" : "secondary"}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.active
            ? t("common.active", "Active")
            : t("common.inactive", "Inactive")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("common.actions", "Actions")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<StockItemResponse>[];
};
