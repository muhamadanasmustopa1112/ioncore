"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { DuplicatePair, DuplicateStatus, MatchReason } from "../../../types/duplicate-review";
import { ActionsCell } from "./actions-cell";

const statusColor: Record<DuplicateStatus, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  merged: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  dismissed: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
  deferred: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const reasonColor: Record<MatchReason, string> = {
  name: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  phone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  email: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  address: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  location: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export const columns: ColumnDef<DuplicatePair>[] = [
  {
    id: "leads",
    header: ({ column }) => (
      <DataGridColumnHeader title="Duplicate Pair" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5 py-1">
        <p className="text-sm font-medium text-foreground">{row.original.leadA.lead_name}</p>
        <p className="text-xs text-muted-foreground">vs {row.original.leadB.lead_name}</p>
      </div>
    ),
    enableSorting: false,
    size: 220,
  },
  {
    id: "score",
    accessorFn: (row) => row.similarityScore,
    header: ({ column }) => (
      <DataGridColumnHeader title="Score" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const score = row.original.similarityScore;
      const color =
        score >= 90
          ? "text-red-600 dark:text-red-400"
          : score >= 80
            ? "text-amber-600 dark:text-amber-400"
            : "text-muted-foreground";
      return <span className={`text-sm font-bold ${color}`}>{score}%</span>;
    },
    enableSorting: true,
    size: 80,
  },
  {
    id: "matchReasons",
    header: ({ column }) => (
      <DataGridColumnHeader title="Match On" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.matchReasons.map((r) => (
          <span key={r} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${reasonColor[r]}`}>
            {r}
          </span>
        ))}
      </div>
    ),
    enableSorting: false,
    size: 180,
  },
  {
    id: "branches",
    header: ({ column }) => (
      <DataGridColumnHeader title="Branches" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="text-xs text-foreground">{row.original.leadA.branch_name}</p>
        <p className="text-xs text-muted-foreground">{row.original.leadB.branch_name}</p>
      </div>
    ),
    enableSorting: false,
    size: 160,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor[row.original.status]}`}>
        {row.original.status}
      </span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "detectedAt",
    accessorFn: (row) => row.detectedAt,
    header: ({ column }) => (
      <DataGridColumnHeader title="Detected" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.detectedAt).toLocaleDateString("id-ID")}
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
