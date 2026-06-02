"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { PreBoq } from "../../types";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<string, "secondary" | "info" | "warning" | "success" | "destructive"> = {
  draft: "secondary",
  submitted: "info",
  reviewed: "warning",
  approved: "success",
  rejected: "destructive",
};

export function usePreBoqColumns(): ColumnDef<PreBoq>[] {
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
          <div className="text-xs text-muted-foreground">{row.original.customer_type}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "service_requirements",
      accessorFn: (row) => row.service_requirements,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colRequirements", "Requirements")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{row.original.service_requirements}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-48" /> },
      enableSorting: false,
      size: 280,
    },
    {
      id: "estimated_value",
      accessorFn: (row) => row.estimated_value,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colEstValue", "Est. Value")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm font-medium">{idr(row.original.estimated_value)}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "assigned_sales_rep",
      accessorFn: (row) => row.assigned_sales_rep,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colSalesRep", "Sales Rep")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.assigned_sales_rep}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 140,
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
      size: 100,
    },
  ];
}
