"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./data-table-actions-cell";
import type { CommissionItem } from "../../../types";

const statusVariant: Record<
  CommissionItem["status"],
  "primary" | "secondary" | "destructive" | "outline" | "warning" | "success"
> = {
  pending: "warning",
  paid: "success",
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatSplit(split: CommissionItem["split"]): string {
  return `Rep: ${split.salesPerson}% | Mgr: ${split.salesManager}% | Branch: ${split.salesBranch}%`;
}

export const useCommissionColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "commissionNumber",
      accessorFn: (row) => row.commissionNumber,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.commissionNumber")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.original.commissionNumber}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 170,
    },
    {
      id: "salesRepName",
      accessorFn: (row) => row.salesRepName,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.salesRep")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.salesRepName}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "customerName",
      accessorFn: (row) => row.customerName,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.customer")}
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
      id: "invoiceNumber",
      accessorFn: (row) => row.invoiceNumber,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.invoiceNumber")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.invoiceNumber}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "totalAmount",
      accessorFn: (row) => row.totalAmount,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.totalAmount")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {formatIDR(row.original.totalAmount)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "split",
      accessorFn: (row) => row.split,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.split")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {formatSplit(row.original.split)}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-48" /> },
      enableSorting: false,
      size: 260,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status]}
          className="capitalize"
        >
          {t(`billing.common.${row.original.status}`)}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "triggerDate",
      accessorFn: (row) => row.triggerDate,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.commission.triggerDate")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.triggerDate}</div>
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
          title={t("billing.commission.branch")}
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
          title={t("billing.commission.actions")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<CommissionItem>[];
};
