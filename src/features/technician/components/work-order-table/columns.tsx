"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Eye } from "lucide-react";
import Link from "next/link";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import type { WorkOrderDashboardItem, WorkOrderState, WorkOrderType } from "../../types/technician-api";

const STATE_STYLES: Record<WorkOrderState, string> = {
  created: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  unassigned: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900",
  assigned: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  accepted: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900",
  dispatched: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-900",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  pending_noc_verification: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900",
  rescheduled: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900",
};

const STATE_LABELS: Record<WorkOrderState, string> = {
  created: "Created",
  unassigned: "Unassigned",
  assigned: "Assigned",
  accepted: "Accepted",
  dispatched: "Dispatched",
  in_progress: "In Progress",
  pending_noc_verification: "Pending NOC",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const TYPE_LABELS: Record<WorkOrderType, string> = {
  new_installation_broadband: "New Install (Broadband)",
  new_installation_enterprise: "New Install (Enterprise)",
  maintenance: "Maintenance",
  termination: "Termination",
};

export const columns: ColumnDef<WorkOrderDashboardItem>[] = [
  {
    id: "no",
    header: ({ column }) => (
      <DataGridColumnHeader title="No" column={column} className="text-foreground font-semibold text-center" />
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center text-slate-500 text-xs">
          {(pageIndex * pageSize) + row.index + 1}
        </div>
      );
    },
    meta: {
      skeleton: <Skeleton className="h-4 w-6 mx-auto" />,
    },
    enableSorting: false,
    size: 60,
  },
  {
    id: "number",
    accessorFn: (row) => row.number,
    header: ({ column }) => (
      <DataGridColumnHeader title="WO Number" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <div className="font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap">
          {row.original.number}
        </div>
        {row.original.cross_area && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900 inline-flex items-center">
            Cross Area
          </span>
        )}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 170,
  },
  {
    id: "title",
    accessorFn: (row) => row.title,
    header: ({ column }) => (
      <DataGridColumnHeader title="Title" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-slate-700 dark:text-slate-300 font-medium truncate" title={row.original.title}>
        {row.original.title || "—"}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-44" />,
    },
    enableSorting: true,
    size: 220,
  },
  {
    id: "type",
    accessorFn: (row) => row.type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {TYPE_LABELS[row.original.type] ?? row.original.type}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
    },
    enableSorting: true,
    size: 180,
  },
  {
    id: "site_name",
    accessorFn: (row) => row.site_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Location" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        <MapPin className="text-blue-500 size-3.5 shrink-0" />
        <span className="truncate" title={row.original.site_name}>{row.original.site_name || "—"}</span>
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-40" />,
    },
    enableSorting: true,
    size: 220,
  },
  {
    id: "assigned_team",
    header: ({ column }) => (
      <DataGridColumnHeader title="Engineer" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const engineers = row.original.assigned_team
        ?.map((t) => t.technician_name)
        .filter(Boolean)
        .join(" & ") || "—";
      return (
        <div className="text-slate-600 dark:text-slate-400 truncate" title={engineers}>
          {engineers}
        </div>
      );
    },
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
    },
    enableSorting: false,
    size: 180,
  },
  {
    id: "state",
    accessorFn: (row) => row.state,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${STATE_STYLES[row.original.state] ?? ""}`}>
          {STATE_LABELS[row.original.state] ?? row.original.state}
        </span>
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-6 w-20 rounded" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold text-center" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Link href={paths.dashboard.technician.detail.getHref(row.original.id)}>
          <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded transition-colors group">
            <Eye className="size-4 transition-transform group-hover:scale-110" />
          </button>
        </Link>
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-8 w-8 rounded-full" />,
    },
    enableSorting: false,
    size: 80,
  },
];
