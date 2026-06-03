"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Ewo, EwoStatus, EwoPriority, EwoType } from "../../../types/ewo";
import { ActionsCell } from "./data-table-actions-cell";

const statusVariant: Record<EwoStatus, "secondary" | "info" | "warning" | "success"> = {
  draft: "secondary",
  assigned: "info",
  in_progress: "warning",
  completed: "success",
  closed: "secondary",
};

const priorityVariant: Record<EwoPriority, "secondary" | "info" | "warning" | "destructive"> = {
  low: "secondary",
  medium: "info",
  high: "warning",
  critical: "destructive",
};

const typeVariant: Record<EwoType, "info" | "secondary"> = {
  ewo_x: "info",
  ewo_y: "secondary",
};

export function useEwoColumns(): ColumnDef<Ewo>[] {
  const { t } = useTranslation();

  return [
    {
      id: "ewo_number",
      accessorFn: (row) => row.ewo_number,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colEwoNumber", "EWO Number")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.ewo_number}</div>
          <div className="text-xs text-muted-foreground">{row.original.site_name}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "project_name",
      accessorFn: (row) => row.project_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colProject", "Project")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.project_name}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "executing_company_name",
      accessorFn: (row) => row.executing_company_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colCompany", "Executing Company")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.executing_company_name}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "ewo_type",
      accessorFn: (row) => row.ewo_type,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colType", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={typeVariant[row.original.ewo_type]} appearance="light" className="text-[10px] font-semibold uppercase">
          {row.original.ewo_type === "ewo_x" ? "EWO-X" : "EWO-Y"}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-14 rounded-full" /> },
      enableSorting: true,
      size: 90,
    },
    {
      id: "priority",
      accessorFn: (row) => row.priority,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colPriority", "Priority")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={priorityVariant[row.original.priority]} appearance="light" className="text-[10px] font-semibold capitalize">
          {row.original.priority}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]} appearance="light" className="text-[10px] font-semibold capitalize">
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "assigned_technician_name",
      accessorFn: (row) => row.assigned_technician_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colTechnician", "Technician")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.assigned_technician_name || "-"}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "scheduled_date",
      accessorFn: (row) => row.scheduled_date,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.ewo.colScheduledDate", "Scheduled")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.scheduled_date}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
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
  ];
}
