"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";
import { getMovementTypeVariant } from "@/features/warehouse/types/inventory-movements";

type UseReportColumnsOptions = {
  onViewDetail?: (item: InventoryMovementItem) => void;
};

export const useReportColumns = (options?: UseReportColumnsOptions) => {
  const { t } = useTranslation();
  const { onViewDetail } = options ?? {};

  return [
    {
      id: "created_at",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("common.date", "Date")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">
          {new Date(row.original.created_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "item_name",
      accessorFn: (row) => row.item_name,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.itemDetails", "Item")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.item_name}</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {row.original.sku}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "warehouse_name",
      accessorFn: (row) => row.warehouse_name,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.warehouseLabel", "Warehouse")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-sm text-foreground">{row.original.warehouse_name}</div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {row.original.warehouse_code}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "movement_type",
      accessorFn: (row) => row.movement_type,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.movementType", "Type")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getMovementTypeVariant(row.original.movement_type)}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.movement_type.replace(/_/g, " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-24 rounded-full" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "quantity",
      accessorFn: (row) => row.quantity,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.quantity", "Quantity")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
          {row.original.quantity.toLocaleString()}{" "}
          <span className="text-[10px] font-medium text-muted-foreground">
            {row.original.unit}
          </span>
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "reference",
      accessorFn: (row) => `${row.reference_type}:${row.reference_id}`,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.reference", "Reference")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-[10px] capitalize text-muted-foreground">
            {row.original.reference_type.replace(/_/g, " ")}
          </div>
          <div className="font-mono text-[10px] text-foreground">
            #{row.original.reference_id}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "asset_serial_number",
      accessorFn: (row) => row.asset_serial_number,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.asset", "Asset")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-[10px] text-muted-foreground">
          {row.original.asset_serial_number ?? "—"}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "actor",
      accessorFn: (row) => row.actor,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.actor", "Actor")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.original.actor}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 130,
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
      cell: ({ row }) => (
        <ActionsCell row={row} onViewDetail={onViewDetail} />
      ),
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<InventoryMovementItem>[];
};
