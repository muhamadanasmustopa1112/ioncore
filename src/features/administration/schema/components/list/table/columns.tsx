"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { SchemaRecord } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

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
        {row.original.latest_version && (
          <p className="text-[11px] text-muted-foreground font-mono">
            {row.original.latest_version}
          </p>
        )}
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
    id: "schema_type",
    accessorFn: (row) => row.schema_type,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Type"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 capitalize">
        {row.original.schema_type}
      </span>
    ),
    enableSorting: true,
    size: 120,
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
