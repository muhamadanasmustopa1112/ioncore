"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ExternalSource, SourceType } from "../../../types/lead-ingestion";
import { ActionsCell } from "./actions-cell";

const typeLabel: Record<SourceType, string> = {
  web_form: "Web Form",
  partner_api: "Partner API",
  marketplace: "Marketplace",
  affiliate: "Affiliate",
  csv_upload: "CSV Upload",
};

const typeColor: Record<SourceType, string> = {
  web_form: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  partner_api: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  marketplace: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  affiliate: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  csv_upload: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

export const columns: ColumnDef<ExternalSource>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Source Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
    enableSorting: true,
    size: 240,
  },
  {
    id: "type",
    accessorFn: (row) => row.type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${typeColor[row.original.type]}`}>
        {typeLabel[row.original.type]}
      </span>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    id: "apiKey",
    accessorFn: (row) => row.apiKey,
    header: ({ column }) => (
      <DataGridColumnHeader title="API Key" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <code className="text-xs text-muted-foreground font-mono">
        {row.original.apiKey.slice(0, 8)}…{row.original.apiKey.slice(-4)}
      </code>
    ),
    enableSorting: false,
    size: 160,
  },
  {
    id: "defaults",
    accessorFn: (row) => `${row.defaultLeadType}/${row.defaultCustomerSubType}`,
    header: ({ column }) => (
      <DataGridColumnHeader title="Defaults" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.defaultLeadType} · {row.original.defaultCustomerSubType} · {row.original.defaultSource}
      </span>
    ),
    enableSorting: false,
    size: 220,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.status === "active" ? (
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
