"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./data-table-actions-cell";
import type { PaymentItem } from "../../../types";

const statusVariant: Record<
  PaymentItem["status"],
  "primary" | "secondary" | "destructive" | "outline" | "success"
> = {
  pending: "primary",
  confirmed: "success",
  failed: "destructive",
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const usePaymentColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "paymentNumber",
      accessorFn: (row) => row.paymentNumber,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.paymentNumber")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.original.paymentNumber}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "invoiceNumber",
      accessorFn: (row) => row.invoiceNumber,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.invoiceNumber")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
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
          title={t("billing.payment.customer")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.customerName}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "amount",
      accessorFn: (row) => row.amount,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.amount")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {formatIDR(row.original.amount)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "method",
      accessorFn: (row) => row.method,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.method")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-foreground border-foreground/20">
          {t(`billing.payment.methods.${row.original.method}`)}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status]}
          className="capitalize"
        >
          {t(`billing.payment.statuses.${row.original.status}`)}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "paidDate",
      accessorFn: (row) => row.paidDate,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.paidDate")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.paidDate}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.payment.actions")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<PaymentItem>[];
};
