"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { DeviceReturnRecord } from "@/features/warehouse/types";

const statusVariantMap: Record<string, "info" | "secondary" | "destructive" | "warning" | "success"> = {
  pending_return: "warning",
  received: "info",
  restocked: "success",
  decommissioned: "destructive",
};

export const useReturnColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "assetName",
      accessorFn: (row) => row.assetName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.device", "Device")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.assetName}</div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">SN: {row.original.serialNumber}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "customerName",
      accessorFn: (row) => row.customerName,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.customer", "Customer")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.customerName}</div>
          <div className="text-[10px] text-muted-foreground">{row.original.woNumber}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "ownership",
      accessorFn: (row) => row.ownership,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("warehouse.ownership", "Ownership")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-bold uppercase">
          {row.original.ownership.replace("_", " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 120,
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
  ] as ColumnDef<DeviceReturnRecord>[];
};
