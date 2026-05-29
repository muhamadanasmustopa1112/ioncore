"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./data-table-actions-cell";
import type { BulkOperationItem, BulkOperationType, BulkOperationStatus } from "../../../types";

const opTypeConfig: Record<BulkOperationType, { label: string; className: string }> = {
  plan_change: { label: "Plan Change", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  price_adjustment: { label: "Price Adjustment", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  service_modification: { label: "Service Modification", className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300" },
  suspension: { label: "Suspension", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  reactivation: { label: "Reactivation", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  odp_migration: { label: "ODP Migration", className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
  bulk_wo: { label: "Bulk Work Order", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
};

const statusConfig: Record<BulkOperationStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  pending_approval: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  executing: { label: "Executing", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  partially_failed: { label: "Partially Failed", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

export const useBulkOperationColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "opType",
      accessorFn: (row) => row.op_type,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("bulkOperations.type", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => {
        const config = opTypeConfig[row.original.op_type];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
      meta: { skeleton: <Skeleton className="h-5 w-24 rounded-full" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "scope",
      accessorFn: (row) => row.scope,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("bulkOperations.scope", "Scope")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-sm truncate max-w-[180px] cursor-pointer">{row.original.scope}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <p className="text-sm">{row.original.scope}</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "affectedCustomerCount",
      accessorFn: (row) => row.affected_customer_count,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("bulkOperations.customers", "Customers")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.affected_customer_count.toLocaleString()}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 110,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => {
        const config = statusConfig[row.original.status];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "billingDelta",
      accessorFn: (row) => row.billing_delta_summary.total_mrc_increase - row.billing_delta_summary.total_mrc_decrease,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("bulkOperations.mrcChange", "MRC Change")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => {
        const value = row.original.billing_delta_summary.total_mrc_increase - row.original.billing_delta_summary.total_mrc_decrease;
        const colorClass = value > 0 ? "text-green-600 dark:text-green-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
        return (
          <div className={`font-medium ${colorClass}`}>
            {value > 0 ? "+" : ""}{formatCurrency(value)}
          </div>
        );
      },
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "createdAt",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("bulkOperations.createdAt", "Created")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
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
  ] as ColumnDef<BulkOperationItem>[];
};
