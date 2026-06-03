"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Quotation } from "../../types";

const statusVariant: Record<string, "secondary" | "info" | "success" | "destructive"> = {
  draft: "secondary",
  sent: "info",
  accepted: "success",
  rejected: "destructive",
  expired: "secondary",
};

export function useQuotationColumns(): ColumnDef<Quotation>[] {
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
          <div className="text-xs text-muted-foreground">BoQ: {row.original.boq_id}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "version",
      accessorFn: (row) => row.version,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colVersion", "Version")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">v{row.original.version}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 80,
    },
    {
      id: "valid_until",
      accessorFn: (row) => row.valid_until,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colValidUntil", "Valid Until")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.valid_until}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
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
