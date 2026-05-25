"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CoverageData } from "../../../../types/coverage";
import { ActionsCell } from "./actions-cell";

export const getCoverageColumns = (
  t: (key: string) => string
): ColumnDef<CoverageData>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.coverage.name")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.coverage.description")}
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
    size: 280,
  },
  {
    id: "isActive",
    accessorFn: (row) => row.isActive,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.coverage.status")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {t("administration.branch.coverage.active")}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {t("administration.branch.coverage.inactive")}
        </span>
      ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.coverage.actions")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];

export const columns: ColumnDef<CoverageData>[] = [];