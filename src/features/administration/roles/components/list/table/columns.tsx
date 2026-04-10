"use client";

import { ColumnDef } from "@tanstack/react-table";
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
    size: 200,
  },
  {
    id: "keyPermissions",
    accessorFn: (row) => row.keyPermissions,
    header: ({ column }) => (
      <DataGridColumnHeader title="Key Permissions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm truncate max-w-[320px]" title={row.original.keyPermissions}>
        {row.original.keyPermissions}
      </div>
    ),
    enableSorting: false,
    size: 340,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader title="Description" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm truncate max-w-[220px]" title={row.original.description}>
        {row.original.description}
      </div>
    ),
    enableSorting: false,
    size: 240,
  },
  {
    id: "active",
    accessorFn: (row) => row.active,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.active ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          Inactive
        </span>
      ),
    enableSorting: true,
    size: 100,
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
