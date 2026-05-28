"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { StockTransfer } from "@/features/warehouse/types";

const statusVariantMap: Record<string, "info" | "secondary" | "destructive" | "warning" | "success"> = {
  pending: "warning",
  in_transit: "info",
  received: "success",
  cancelled: "destructive",
};

export const useTransferColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.transferId", "Transfer ID")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-mono font-medium text-foreground">{row.original.id}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "sourceWarehouseName",
      accessorFn: (row) => row.sourceWarehouseName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.fromTo", "From → To")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.sourceWarehouseName}</div>
          <div className="text-[10px] text-muted-foreground">→ {row.original.destinationWarehouseName}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
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
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.actions", "Actions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<StockTransfer>[];
};
