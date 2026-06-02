"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Rfq } from "../../types";

const statusVariant: Record<string, "secondary" | "info" | "success" | "destructive"> = {
  open: "info",
  closed: "secondary",
  awarded: "success",
  cancelled: "destructive",
};

export function useRfqColumns(): ColumnDef<Rfq>[] {
  const { t } = useTranslation();

  return [
    {
      id: "customer_name",
      accessorFn: (row) => row.customer_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colCustomer", "Customer")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.customer_name}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "item_description",
      accessorFn: (row) => row.item_description,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colItem", "Item")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.item_description}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-40" /> },
      enableSorting: false,
      size: 200,
    },
    {
      id: "quantity",
      accessorFn: (row) => row.quantity,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colQty", "Qty")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.quantity} {row.original.unit}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "vendors",
      accessorFn: (row) => row.invited_vendors.length,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colVendors", "Vendors")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.invited_vendors.length} {t("enterprise.cpq.invited", "invited")}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      enableSorting: false,
      size: 100,
    },
    {
      id: "deadline",
      accessorFn: (row) => row.deadline,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.cpq.colDeadline", "Deadline")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.deadline}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 110,
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
