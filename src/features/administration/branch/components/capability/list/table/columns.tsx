"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CapabilityData } from "../../../../types/capability";
import { ActionsCell } from "./actions-cell";

export const columns: ColumnDef<CapabilityData>[] = [
  {
    id: "capabilityKey",
    accessorFn: (row) => row.capabilityKey,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Capability Key"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {row.original.capabilityKey}
      </span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Description"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className={row.original.description ? "text-foreground" : "text-muted-foreground/40"}>
        {row.original.description || "—"}
      </span>
    ),
    enableSorting: false,
    size: 300,
  },
  {
    id: "isEnabled",
    accessorFn: (row) => row.isEnabled,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Status"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) =>
      row.original.isEnabled ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Enabled
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          Disabled
        </span>
      ),
    enableSorting: true,
    size: 110,
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
