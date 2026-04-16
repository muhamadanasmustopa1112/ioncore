"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CrossBranchRuleData, CrossBranchRuleType } from "../../../../types/cross-branch-rules";
import { ActionsCell } from "./actions-cell";

const ruleTypeLabel: Record<CrossBranchRuleType, string> = {
  dispatch: "Dispatch",
  inventory: "Inventory",
  sales: "Sales",
  noc: "NOC",
};

const ruleTypeColor: Record<CrossBranchRuleType, string> = {
  dispatch: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  inventory: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  sales: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  noc: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export const columns: ColumnDef<CrossBranchRuleData>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Rule Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "ruleType",
    accessorFn: (row) => row.ruleType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${ruleTypeColor[row.original.ruleType]}`}>
        {ruleTypeLabel[row.original.ruleType]}
      </span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "sourceBranch",
    accessorFn: (row) => row.sourceBranch,
    header: ({ column }) => (
      <DataGridColumnHeader title="Source Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.sourceBranch}</span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "targetBranch",
    accessorFn: (row) => row.targetBranch,
    header: ({ column }) => (
      <DataGridColumnHeader title="Target Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.targetBranch}</span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "condition",
    accessorFn: (row) => row.condition,
    header: ({ column }) => (
      <DataGridColumnHeader title="Condition" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
        {row.original.condition || "—"}
      </span>
    ),
    enableSorting: false,
    size: 180,
  },
  {
    id: "requiresApproval",
    accessorFn: (row) => row.requiresApproval,
    header: ({ column }) => (
      <DataGridColumnHeader title="Approval" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.requiresApproval ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          Required
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          Auto
        </span>
      ),
    enableSorting: true,
    size: 100,
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
