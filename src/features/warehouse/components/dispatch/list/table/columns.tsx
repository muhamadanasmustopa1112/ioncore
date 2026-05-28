"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { DispatchRecord } from "@/features/warehouse/types";

const statusVariantMap: Record<string, "info" | "secondary" | "destructive" | "warning"> = {
  pending: "warning",
  preparing: "secondary",
  dispatched: "info",
  completed: "secondary",
};

export const useDispatchColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "woNumber",
      accessorFn: (row) => row.woNumber,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.woNumber", "WO Number")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.woNumber}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{row.original.woType}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "technicianName",
      accessorFn: (row) => row.technicianName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.technician", "Technician")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.technicianName}</div>
          <div className="text-[10px] text-muted-foreground">{row.original.technicianRole}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "warehouseName",
      accessorFn: (row) => row.warehouseName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.warehouseLabel", "Warehouse")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div>{row.original.warehouseName}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariantMap[row.original.status] || "secondary"} appearance="light" className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
          {row.original.status}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
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
  ] as ColumnDef<DispatchRecord>[];
};
