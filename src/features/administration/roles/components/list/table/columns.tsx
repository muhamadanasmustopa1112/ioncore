"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { RoleData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<RoleData>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Role Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{row.original.name}</span>
        {row.original.isSystem && (
          <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            SYSTEM
          </span>
        )}
      </div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader title="Description" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm truncate max-w-[360px]" title={row.original.description}>
        {row.original.description || "—"}
      </div>
    ),
    enableSorting: false,
    size: 380,
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataGridColumnHeader title="Created" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "dd MMM yyyy")
          : "—"}
      </span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];
