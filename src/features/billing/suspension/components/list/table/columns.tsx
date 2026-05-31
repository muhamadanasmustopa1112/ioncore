"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./data-table-actions-cell";
import type { SuspensionItem } from "../../../types";

const statusVariant: Record<
  SuspensionItem["status"],
  "primary" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  pending: "primary",
  approved: "success",
  suspended: "destructive",
  restored: "warning",
};

export const useSuspensionColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "customerName",
      accessorFn: (row) => row.customerName,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.customer")}
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
          title={t("billing.suspension.invoiceNumber")}
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
      id: "overdueDays",
      accessorFn: (row) => row.overdueDays,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.overdueDays")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.overdueDays}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 130,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.status")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status]}
          className="capitalize"
        >
          {t(`billing.suspension.statuses.${row.original.status}`)}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 130,
    },
    {
      id: "suspensionDate",
      accessorFn: (row) => row.suspensionDate,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.suspensionDate")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.suspensionDate ?? "—"}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "approvedBy",
      accessorFn: (row) => row.approvedBy,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.approvedBy")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.approvedBy ?? "—"}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 130,
    },
    {
      id: "branch",
      accessorFn: (row) => row.branch,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("billing.suspension.branch")}
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
          title={t("billing.suspension.actions")}
          column={column}
          className="text-foreground font-semibold"
        />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<SuspensionItem>[];
};
