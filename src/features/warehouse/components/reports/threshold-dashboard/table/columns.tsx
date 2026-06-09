"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { ThresholdDashboardItem } from "@/features/warehouse/types/threshold-dashboard";
import {
  getSuggestedActionVariant,
  getThresholdStatusVariant,
  isStockCritical,
} from "@/features/warehouse/types/threshold-dashboard";

type UseThresholdDashboardColumnsOptions = {
  onViewDetail?: (item: ThresholdDashboardItem) => void;
};

export const useThresholdDashboardColumns = (
  options?: UseThresholdDashboardColumnsOptions
) => {
  const { t } = useTranslation();
  const { onViewDetail } = options ?? {};

  return [
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
      size: 180,
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
            {row.original.warehouse_code} · {row.original.warehouse_type}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("common.status", "Status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getThresholdStatusVariant(row.original.status)}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.status}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "current_qty",
      accessorFn: (row) => row.current_qty,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.qtyThreshold", "Qty / Threshold")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => {
        const critical = isStockCritical(row.original);
        return (
          <span
            className={`font-bold text-sm tabular-nums ${
              critical
                ? "text-red-600 dark:text-red-400"
                : "text-foreground"
            }`}
          >
            {row.original.current_qty} / {row.original.threshold_qty}
          </span>
        );
      },
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "cascade_level",
      accessorFn: (row) => row.cascade_level,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.cascadeLevel", "Cascade")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-sm tabular-nums">
          L{row.original.cascade_level}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-10" /> },
      enableSorting: true,
      size: 90,
    },
    {
      id: "suggested_action",
      accessorFn: (row) => row.suggested_action,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.suggestedAction", "Suggested Action")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getSuggestedActionVariant(row.original.suggested_action)}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.suggested_action.replace(/_/g, " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-28 rounded-full" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "ack_deadline_at",
      accessorFn: (row) => row.ack_deadline_at,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.ackDeadline", "Ack Deadline")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">
          {new Date(row.original.ack_deadline_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
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
  ] as ColumnDef<ThresholdDashboardItem>[];
};
