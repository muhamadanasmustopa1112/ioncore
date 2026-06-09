"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { OpnameDiscrepancyItem } from "@/features/warehouse/types/opname-discrepancies";
import {
  getSessionStatusVariant,
  getVarianceQtyClass,
} from "@/features/warehouse/types/opname-discrepancies";

type UseOpnameDiscrepancyColumnsOptions = {
  onViewDetail?: (item: OpnameDiscrepancyItem) => void;
};

export const useOpnameDiscrepancyColumns = (
  options?: UseOpnameDiscrepancyColumnsOptions
) => {
  const { t } = useTranslation();
  const { onViewDetail } = options ?? {};

  return [
    {
      id: "session_number",
      accessorFn: (row) => row.session_number,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.opnameSession", "Session")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-mono text-sm font-medium">{row.original.session_number}</div>
          <div className="text-[10px] text-muted-foreground">
            #{row.original.opname_session_id}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
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
            {row.original.warehouse_code}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "session_status",
      accessorFn: (row) => row.session_status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("common.status", "Status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getSessionStatusVariant(row.original.session_status)}
          appearance="light"
          className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
        >
          {row.original.session_status.replace(/_/g, " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "variance_qty",
      accessorFn: (row) => row.variance_qty,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.varianceQty", "Variance")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span
          className={`font-bold text-sm tabular-nums ${getVarianceQtyClass(row.original.variance_qty)}`}
        >
          {row.original.variance_qty > 0 ? "+" : ""}
          {row.original.variance_qty}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "resolution",
      accessorFn: (row) => row.resolution,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.resolution", "Resolution")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm capitalize text-foreground">
          {row.original.resolution?.replace(/_/g, " ") ?? "—"}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "resolved_at",
      accessorFn: (row) => row.resolved_at,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.resolvedAt", "Resolved At")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">
          {row.original.resolved_at
            ? new Date(row.original.resolved_at).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
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
  ] as ColumnDef<OpnameDiscrepancyItem>[];
};
