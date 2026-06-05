"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { ReturnsListItem } from "@/features/warehouse/types/returns";

const conditionVariantMap: Record<
  string,
  "info" | "secondary" | "destructive" | "warning" | "success"
> = {
  GOOD: "success",
  DAMAGED: "destructive",
};

const dispositionVariantMap: Record<
  string,
  "info" | "secondary" | "destructive" | "warning" | "success"
> = {
  REFURBISH: "warning",
  RESTOCK: "success",
  DECOMMISSION: "destructive",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useReturnColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title="ID"
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono font-medium text-foreground">
          {row.original.id}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 80,
    },
    {
      id: "wo_id",
      accessorFn: (row) => row.wo_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.woNumber", "WO ID")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm text-foreground">
          {row.original.wo_id}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "asset_id",
      accessorFn: (row) => row.asset_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.assetId", "Asset ID")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm text-foreground">
          {row.original.asset_id}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "condition",
      accessorFn: (row) => row.condition,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.condition", "Condition")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={conditionVariantMap[row.original.condition] || "secondary"}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.condition}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 110,
    },
    {
      id: "disposition",
      accessorFn: (row) => row.disposition,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.disposition", "Disposition")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            dispositionVariantMap[row.original.disposition] || "secondary"
          }
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.disposition}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-24 rounded-full" /> },
      enableSorting: true,
      size: 130,
    },
    {
      id: "received_warehouse_id",
      accessorFn: (row) => row.received_warehouse_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.warehouseLabel", "Warehouse")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">
          #{row.original.received_warehouse_id}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 110,
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
      size: 140,
    },
    {
      id: "created_at",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("common.createdAt", "Created At")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {formatDate(row.original.created_at)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
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
  ] as ColumnDef<ReturnsListItem>[];
};
