"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import {
  AccessScopeData,
  AccessScopeSubjectType,
  AccessPermissionLevel,
} from "../../../../types/access-scope";
import { ActionsCell } from "./actions-cell";

const subjectTypeColor: Record<AccessScopeSubjectType, string> = {
  user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  role: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const permissionColor: Record<AccessPermissionLevel, string> = {
  read: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  write: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  admin: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  full: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const scopeLevelLabel: Record<string, string> = {
  regional: "Regional",
  area: "Area",
  sub_area: "Sub Area",
  all: "All Levels",
};

export const columns: ColumnDef<AccessScopeData>[] = [
  {
    id: "subjectType",
    accessorFn: (row) => row.subjectType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${subjectTypeColor[row.original.subjectType]}`}>
        {row.original.subjectType}
      </span>
    ),
    enableSorting: true,
    size: 90,
  },
  {
    id: "subjectName",
    accessorFn: (row) => row.subjectName,
    header: ({ column }) => (
      <DataGridColumnHeader title="User / Role" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        <span className="font-medium text-foreground block">{row.original.subjectName}</span>
        <span className="text-xs text-muted-foreground font-mono">{row.original.subjectCode}</span>
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "scopeLevel",
    accessorFn: (row) => row.scopeLevel,
    header: ({ column }) => (
      <DataGridColumnHeader title="Scope Level" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {scopeLevelLabel[row.original.scopeLevel] ?? row.original.scopeLevel}
      </span>
    ),
    enableSorting: true,
    size: 110,
  },
  {
    id: "branchScope",
    accessorFn: (row) => row.branchScope.join(", "),
    header: ({ column }) => (
      <DataGridColumnHeader title="Branches" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const branches = row.original.branchScope;
      if (branches.length === 0) return <span className="text-muted-foreground/40">—</span>;
      if (branches.length <= 2) {
        return <span className="text-xs text-foreground">{branches.join(", ")}</span>;
      }
      return (
        <span className="text-xs text-foreground">
          {branches[0]}, {branches[1]}{" "}
          <span className="text-muted-foreground">+{branches.length - 2} more</span>
        </span>
      );
    },
    enableSorting: false,
    size: 200,
  },
  {
    id: "permissionLevel",
    accessorFn: (row) => row.permissionLevel,
    header: ({ column }) => (
      <DataGridColumnHeader title="Permission" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${permissionColor[row.original.permissionLevel]}`}>
        {row.original.permissionLevel}
      </span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "canCrossBranch",
    accessorFn: (row) => row.canCrossBranch,
    header: ({ column }) => (
      <DataGridColumnHeader title="Cross-branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.canCrossBranch ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Allowed
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          Restricted
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
