"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { SchemaRecord, SchemaStatus } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const statusConfig: Record<
  SchemaStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className:
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  submitted: {
    label: "Submitted",
    className:
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  published: {
    label: "Published",
    className:
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  archived: {
    label: "Archived",
    className:
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-400 dark:bg-red-900/20 dark:text-red-400 opacity-70",
  },
};

export const columns: ColumnDef<SchemaRecord>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Schema"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-foreground text-sm">
          {row.original.name}
        </p>
        <p className="text-[11px] text-muted-foreground font-mono">
          v{row.original.version}
        </p>
      </div>
    ),
    enableSorting: true,
    size: 280,
  },
  {
    id: "customer_type",
    accessorFn: (row) => row.customer_type,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Customer Type"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-sm capitalize text-muted-foreground">
        {row.original.customer_type}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Status"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const config = statusConfig[row.original.status];
      return <span className={config.className}>{config.label}</span>;
    },
    enableSorting: true,
    size: 120,
  },
  {
    id: "updated_at",
    accessorFn: (row) => row.updated_at,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Last Updated"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {format(new Date(row.original.updated_at), "dd MMM yyyy, HH:mm")}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Actions"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];
