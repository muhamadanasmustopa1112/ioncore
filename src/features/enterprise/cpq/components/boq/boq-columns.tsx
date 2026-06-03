"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Boq } from "../../types";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<string, "secondary" | "warning" | "success" | "destructive"> = {
  draft: "secondary",
  in_approval: "warning",
  approved: "success",
  rejected: "destructive",
  superseded: "secondary",
};

export function useBoqColumns(): ColumnDef<Boq>[] {
  const { t } = useTranslation();

  return [
    {
      id: "customer_name",
      accessorFn: (row) => row.customer_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colCustomer", "Customer")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.customer_name}</div>
          <div className="text-xs text-muted-foreground">v{row.original.version}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "lines_count",
      accessorFn: (row) => row.lines.length,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colLines", "Lines")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.lines.length}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: false,
      size: 80,
    },
    {
      id: "grand_total",
      accessorFn: (row) => row.grand_total,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colGrandTotal", "Grand Total")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm font-medium">{idr(row.original.grand_total)}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "approved_by",
      accessorFn: (row) => row.approved_by ?? "-",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colApprovedBy", "Approved By")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.approved_by ?? "-"}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: false,
      size: 120,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "secondary"} appearance="light" className="text-[10px] font-semibold uppercase">
          {row.original.status}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 110,
    },
  ];
}
