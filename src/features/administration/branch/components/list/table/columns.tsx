"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { BranchData, BranchLevel, BranchType } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const levelConfig: Record<BranchLevel, { label: string; className: string }> = {
  regional: { label: "Regional", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  area: { label: "Area", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  sub_area: { label: "Sub Area", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const typeConfig: Record<BranchType, { label: string; className: string }> = {
  office: { label: "Office", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  noc: { label: "NOC", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  warehouse: { label: "Warehouse", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  hybrid: { label: "Hybrid", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
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
    size: 120,
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
    id: "branchType",
    accessorFn: (row) => row.branchType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const config = typeConfig[row.original.branchType];
      return <span className={config.className}>{config.label}</span>;
    },
    enableSorting: true,
    size: 120,
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
