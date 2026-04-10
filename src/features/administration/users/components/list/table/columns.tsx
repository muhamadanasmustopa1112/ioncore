"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { UserData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const statusConfig = {
  active: { label: "Active", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inactive: { label: "Inactive", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  locked: { label: "Locked", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

export const columns: ColumnDef<UserData>[] = [
  {
    id: "fullName",
    accessorFn: (row) => row.fullName,
    header: ({ column }) => (
      <DataGridColumnHeader title="User" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {row.original.avatarInitials}
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{row.original.fullName}</p>
          <p className="text-[11px] text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
    enableSorting: true,
    size: 240,
  },
  {
    id: "employeeId",
    accessorFn: (row) => row.employeeId,
    header: ({ column }) => (
      <DataGridColumnHeader title="Employee ID" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {row.original.employeeId}
      </span>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    id: "phone",
    accessorFn: (row) => row.phone,
    header: ({ column }) => (
      <DataGridColumnHeader title="Phone" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.phone}</span>
    ),
    enableSorting: false,
    size: 160,
  },
  {
    id: "roleAssignments",
    accessorFn: (row) => row.roleAssignments.map((r) => r.roleName).join(", "),
    header: ({ column }) => (
      <DataGridColumnHeader title="Role @ Branch" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roleAssignments.map((assignment) => (
          <span
            key={assignment.id}
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap"
          >
            {assignment.roleName} @ {assignment.branchName}
          </span>
        ))}
      </div>
    ),
    enableSorting: false,
    size: 280,
  },
  {
    id: "department",
    accessorFn: (row) => row.department,
    header: ({ column }) => (
      <DataGridColumnHeader title="Dept / Position" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-foreground">{row.original.department}</p>
        <p className="text-[11px] text-muted-foreground">{row.original.position}</p>
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const config = statusConfig[row.original.status];
      return <span className={config.className}>{config.label}</span>;
    },
    enableSorting: true,
    size: 100,
  },
  {
    id: "lastLoginAt",
    accessorFn: (row) => row.lastLoginAt,
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Login" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.lastLoginAt
          ? format(new Date(row.original.lastLoginAt), "dd MMM yyyy, HH:mm")
          : "—"}
      </span>
    ),
    enableSorting: true,
    size: 160,
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
