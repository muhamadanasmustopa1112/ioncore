"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { MaintenanceEvent, MaintenanceType, MaintenanceStatus, ServiceImpact } from "../../../types";

const maintenanceTypeBadgeVariant: Record<MaintenanceType, string> = {
  fiber_upgrade: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  olt_maintenance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  odp_replacement: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  backbone: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  config_change: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  power: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const serviceImpactBadgeVariant: Record<ServiceImpact, string> = {
  full_outage: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  degraded: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  no_impact: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const statusBadgeVariant: Record<MaintenanceStatus, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  approved: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  escalated_to_war_room: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const maintenanceTypeLabel: Record<MaintenanceType, string> = {
  fiber_upgrade: "Fiber Upgrade",
  olt_maintenance: "OLT Maintenance",
  odp_replacement: "ODP Replacement",
  backbone: "Backbone",
  config_change: "Config Change",
  power: "Power",
  other: "Other",
};

const serviceImpactLabel: Record<ServiceImpact, string> = {
  full_outage: "Full Outage",
  degraded: "Degraded",
  no_impact: "No Impact",
};

const statusLabel: Record<MaintenanceStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  escalated_to_war_room: "Escalated",
};

const MaintenanceColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "title",
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("maintenance.title", "Title")} column={column} className="text-foreground font-semibold " />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-medium text-foreground truncate max-w-[250px] cursor-pointer">{row.original.title}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <p className="text-sm">{row.original.title}</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-48" /> },
      enableSorting: true,
      size: 250,
    },
    {
      id: "maintenance_type",
      accessorFn: (row) => row.maintenance_type,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("maintenance.type", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={maintenanceTypeBadgeVariant[row.original.maintenance_type]}>
          {maintenanceTypeLabel[row.original.maintenance_type]}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-24 rounded-full" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "scheduled_start",
      accessorFn: (row) => row.scheduled_start,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("maintenance.scheduledStart", "Scheduled Start")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.original.scheduled_start), "dd MMM yyyy, HH:mm")}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "service_impact",
      accessorFn: (row) => row.service_impact,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("maintenance.serviceImpact", "Service Impact")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={serviceImpactBadgeVariant[row.original.service_impact]}>
          {serviceImpactLabel[row.original.service_impact]}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "estimated_customers_affected",
      accessorFn: (row) => row.estimated_customers_affected,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("maintenance.customersAffected", "Customers")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{row.original.estimated_customers_affected}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
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
        <Badge className={statusBadgeVariant[row.original.status]}>
          {statusLabel[row.original.status]}
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
  ] as ColumnDef<MaintenanceEvent>[];
};

export const useMaintenanceColumns = MaintenanceColumns;
