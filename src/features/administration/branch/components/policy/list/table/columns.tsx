"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { PolicyData } from "../../../../types/policy";
import { ActionsCell } from "./actions-cell";

export const getPolicyColumns = (
  t: (key: string) => string
): ColumnDef<PolicyData>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.name")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.description")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span
        className={
          row.original.description
            ? "text-foreground"
            : "text-muted-foreground/40"
        }
      >
        {row.original.description || "—"}
      </span>
    ),
    enableSorting: false,
    size: 220,
  },
  {
    id: "sla_hours",
    accessorFn: (row) => row.policyJson.sla_hours,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.slaHrs")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-foreground">
        {row.original.policyJson.sla_hours ?? "—"}
      </span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "working_hours",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.workingHours")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const wh = row.original.policyJson.working_hours;
      return wh ? (
        <span className="font-mono text-xs text-foreground">
          {wh.start} – {wh.end}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
    enableSorting: false,
    size: 130,
  },
  {
    id: "timezone",
    accessorFn: (row) => row.policyJson.timezone,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.timezone")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-foreground">
        {row.original.policyJson.timezone || "—"}
      </span>
    ),
    enableSorting: true,
    size: 130,
  },
  {
    id: "tax_default",
    accessorFn: (row) => row.policyJson.tax_default,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.tax")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const tax = row.original.policyJson.tax_default;
      return (
        <span className="text-sm text-foreground">
          {tax != null ? `${tax}%` : "—"}
        </span>
      );
    },
    enableSorting: true,
    size: 80,
  },
  {
    id: "isActive",
    accessorFn: (row) => row.isActive,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.status")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {t("administration.branch.policy.active")}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {t("administration.branch.policy.inactive")}
        </span>
      ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.policy.actions")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];

export const columns: ColumnDef<PolicyData>[] = [];