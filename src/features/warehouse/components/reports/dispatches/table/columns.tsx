"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { DispatchReportItem } from "@/features/warehouse/types/dispatch-reports";
import { getWarehouseLabel } from "@/features/warehouse/types/dispatch-reports";

type UseDispatchReportColumnsOptions = {
  onViewDetail?: (item: DispatchReportItem) => void;
};

export const useDispatchReportColumns = (
  options?: UseDispatchReportColumnsOptions
) => {
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
      id: "dispatch_number",
      accessorFn: (row) => row.dispatch_number,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.dispatchNumber", "Dispatch #")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-foreground">
          {row.original.dispatch_number}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "wo_id",
      accessorFn: (row) => row.wo_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.workOrder", "WO")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm text-foreground">{row.original.wo_id}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "technician_user_id",
      accessorFn: (row) => row.technician_user_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.technician", "Technician")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.original.technician_user_id}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "source_warehouse_id",
      accessorFn: (row) => row.source_warehouse_id,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.warehouseLabel", "Warehouse")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-foreground">
          {getWarehouseLabel(row.original.source_warehouse_id)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "line_count",
      accessorFn: (row) => row.line_count,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.lineCount", "Lines")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-sm tabular-nums">{row.original.line_count}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 90,
    },
    {
      id: "total_quantity",
      accessorFn: (row) => row.total_quantity,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("warehouse.totalQuantity", "Total Qty")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
          {row.original.total_quantity.toLocaleString()}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 110,
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
  ] as ColumnDef<DispatchReportItem>[];
};
