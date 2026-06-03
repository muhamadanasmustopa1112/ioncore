"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { IntercompanyPo } from "../../../types/ic-po";
import { ActionsCell } from "./data-table-actions-cell";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  accepted: "success",
  rejected: "destructive",
  issued: "info",
  pending_approval: "warning",
  draft: "secondary",
  in_fulfillment: "info",
  closed: "secondary",
};

export function useIcPoColumns(): ColumnDef<IntercompanyPo>[] {
  const { t } = useTranslation();

  return [
    {
      id: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.icPo.colId", "IC-PO ID")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-medium text-foreground">{row.original.id}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "issuer_company_name",
      accessorFn: (row) => row.issuer_company_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.icPo.colIssuer", "Issuer")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.issuer_company_name}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "receiver_company_name",
      accessorFn: (row) => row.receiver_company_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.icPo.colReceiver", "Receiver")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.receiver_company_name}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "lines_count",
      accessorFn: (row) => row.lines.length,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.icPo.colLines", "Lines")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.lines.length}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-10" /> },
      enableSorting: false,
      size: 70,
    },
    {
      id: "total_amount",
      accessorFn: (row) => row.total_amount,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.icPo.colTotal", "Total")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="font-semibold text-sm">{idr(row.original.total_amount)}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status] ?? "secondary"}
          appearance="light"
          className="text-[10px] font-semibold uppercase"
        >
          {row.original.status.replace(/_/g, " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 130,
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
  ];
}
