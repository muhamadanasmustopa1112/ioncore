"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { StockOpname } from "@/features/warehouse/types";

const statusVariantMap: Record<string, "secondary" | "destructive" | "warning" | "info" | "success"> = {
  scheduled: "secondary",
  in_progress: "warning",
  completed: "info",
  adjusted: "success",
};

export const useOpnameColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.opnameId", "Opname ID")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="font-mono font-medium text-foreground">
          {row.original.sessionNumber ?? row.original.id}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "warehouseName",
      accessorFn: (row) => row.warehouseName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.warehouseLabel", "Warehouse")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="text-sm font-medium text-foreground">{row.original.warehouseName}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "initiatedByName",
      accessorFn: (row) => row.initiatedByName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.initiatedBy", "Initiated By")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="text-sm text-foreground">{row.original.initiatedByName}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariantMap[row.original.status] || "secondary"} appearance="light" className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "totalDiscrepancies",
      accessorFn: (row) => row.totalDiscrepancies,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.discrepancies", "Discrepancies")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className={`font-bold text-sm ${row.original.totalDiscrepancies > 0 ? "text-red-600" : "text-emerald-600"}`}>
          {row.original.totalDiscrepancies}
        </span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
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
  ] as ColumnDef<StockOpname>[];
};
