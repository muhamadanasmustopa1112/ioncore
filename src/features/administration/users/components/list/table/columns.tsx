"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { UserData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const getUserColumns = (
  t: (key: string) => string,
): ColumnDef<UserData>[] => [
  {
    id: "fullName",
    accessorFn: (row) => row.fullName,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.user")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {row.original.avatarInitials}
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            {row.original.fullName}
          </p>
          <p className="text-muted-foreground text-[11px]">
            {row.original.email}
          </p>
        </div>
      </div>
    ),
    enableSorting: true,
    size: 260,
  },
  {
    id: "phone",
    accessorFn: (row) => row.phone,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.phone")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.phone || "—"}
      </span>
    ),
    enableSorting: false,
    size: 160,
  },
  {
    id: "position",
    accessorFn: (row) => row.position,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.jobTitle")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground text-sm">
        {row.original.position || "—"}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "homeBranch",
    accessorFn: (row) => row.homeBranchName,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.homeBranch")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.homeBranchName || "—"}
      </span>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "roleAssignments",
    accessorFn: (row) => row.roleAssignments.map((r) => r.roleName).join(", "),
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.roles")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roleAssignments.length === 0 && (
          <span className="text-muted-foreground text-xs">—</span>
        )}
        {row.original.roleAssignments.map((assignment) => (
          <span
            key={assignment.id}
            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {assignment.roleName}
          </span>
        ))}
      </div>
    ),
    enableSorting: false,
    size: 240,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.status")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap: Record<string, { label: string; className: string }> = {
        active: {
          label: t("administration.users.active"),
          className:
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        },
        inactive: {
          label: t("administration.users.inactive"),
          className:
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        },
        locked: {
          label: t("administration.users.locked"),
          className:
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        },
      };
      const config = statusMap[status] || statusMap.active;
      return <span className={config.className}>{config.label}</span>;
    },
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.users.actions")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];

export const columns: ColumnDef<UserData>[] = [];
