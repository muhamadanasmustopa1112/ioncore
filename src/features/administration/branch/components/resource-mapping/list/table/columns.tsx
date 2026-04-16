"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ResourceMappingData, ResourceType, BranchScopeLevel } from "../../../../types/resource-mapping";
import { ActionsCell } from "./actions-cell";

const resourceTypeLabel: Record<ResourceType, string> = {
  sales_rep: "Sales Rep",
  team_leader: "Team Leader",
  warehouse: "Warehouse",
  noc: "NOC",
};

const resourceTypeColor: Record<ResourceType, string> = {
  sales_rep: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  team_leader: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  warehouse: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  noc: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const scopeLevelLabel: Record<BranchScopeLevel, string> = {
  regional: "Regional",
  area: "Area",
  sub_area: "Sub Area",
};

export const columns: ColumnDef<ResourceMappingData>[] = [
  {
    id: "resourceType",
    accessorFn: (row) => row.resourceType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Resource Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${resourceTypeColor[row.original.resourceType]}`}>
        {resourceTypeLabel[row.original.resourceType]}
      </span>
    ),
    enableSorting: true,
    size: 130,
  },
  {
    id: "resourceName",
    accessorFn: (row) => row.resourceName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Resource Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        <span className="font-medium text-foreground block">{row.original.resourceName}</span>
        <span className="text-xs text-muted-foreground font-mono">{row.original.resourceCode}</span>
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "branchName",
    accessorFn: (row) => row.branchName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Assigned Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.branchName}</span>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "scopeLevel",
    accessorFn: (row) => row.scopeLevel,
    header: ({ column }) => (
      <DataGridColumnHeader title="Scope" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {scopeLevelLabel[row.original.scopeLevel]}
      </span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "servesMultiple",
    accessorFn: (row) => row.servesMultiple,
    header: ({ column }) => (
      <DataGridColumnHeader title="Multi-Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.servesMultiple ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Yes ({row.original.additionalBranches.length + 1})
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          Single
        </span>
      ),
    enableSorting: true,
    size: 110,
  },
  {
    id: "isActive",
    accessorFn: (row) => row.isActive,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          Inactive
        </span>
      ),
    enableSorting: true,
    size: 90,
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
