"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./data-table-actions-cell";
import type { InvoiceItem } from "../../../types";

const statusVariant: Record<
  InvoiceItem["status"],
  "primary" | "secondary" | "destructive" | "outline" | "success"
> = {
  draft: "outline",
  sent: "secondary",
  paid: "success",
  overdue: "destructive",
  partial: "secondary",
  cancelled: "destructive",
};

const typeVariant: Record<
  InvoiceItem["type"],
  "primary" | "secondary" | "destructive" | "outline"
> = {
  otc: "primary",
  recurring: "secondary",
  addon: "outline",
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const useInvoiceColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "invoiceNumber",
      accessorFn: (row) => row.invoiceNumber,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.invoiceNumber")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.original.invoiceNumber}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "customerName",
      accessorFn: (row) => row.customerName,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.customer")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.customerName}</div>
          <div className="text-muted-foreground text-xs">
            {row.original.customerType === "broadband"
              ? t("billing.report.broadband")
              : t("billing.report.business")}
          </div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "type",
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.type")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => {
        const variant = typeVariant[row.original.type];
        return (
          <Badge 
            variant={variant} 
            className={`capitalize ${variant === "outline" ? "text-foreground border-foreground/20" : ""}`}
          >
            {t(`billing.common.${row.original.type}`)}
          </Badge>
        );
      },
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "total",
      accessorFn: (row) => row.total,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.total")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {formatIDR(row.original.total)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => {
        const variant = statusVariant[row.original.status];
        return (
          <Badge
            variant={variant}
            className={`capitalize ${variant === "outline" ? "text-foreground border-foreground/20" : ""}`}
          >
            {t(`billing.common.${row.original.status}`)}
          </Badge>
        );
      },
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "dueDate",
      accessorFn: (row) => row.dueDate,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.dueDate")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.dueDate}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "branch",
      accessorFn: (row) => row.branch,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.branch")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <div>{row.original.branch}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.invoice.actions")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<InvoiceItem>[];
};
