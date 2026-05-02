"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { BranchData, BranchLevel } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const levelConfig: Record<BranchLevel, { label: string; className: string }> = {
  regional: { label: "Regional", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  area: { label: "Area", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  sub_area: { label: "Sub Area", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

export const columns: ColumnDef<BranchData>[] = [
  {
    id: "code",
    accessorFn: (row) => row.code,
    header: ({ column }) => (
      <DataGridColumnHeader title="Code" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {row.original.code}
      </span>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Branch Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "level",
    accessorFn: (row) => row.level,
    header: ({ column }) => (
      <DataGridColumnHeader title="Level" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const config = levelConfig[row.original.level];
      return <span className={config.className}>{config.label}</span>;
    },
    enableSorting: true,
    size: 110,
  },
  {
    id: "parentName",
    accessorFn: (row) => row.parentName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Parent Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={row.original.parentName ? "text-foreground" : "text-muted-foreground/40"}>
        {row.original.parentName ?? "—"}
      </span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "geographic_polygon",
    accessorFn: (row) => row.geographic_polygon,
    header: ({ column }) => (
      <DataGridColumnHeader title="Polygon" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.geographic_polygon ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
          Defined
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          None
        </span>
      ),
    enableSorting: false,
    size: 90,
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
