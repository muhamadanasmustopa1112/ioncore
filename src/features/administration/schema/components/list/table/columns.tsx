"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { SchemaRecord } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

function SchemaStatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const map: Record<string, { label: string; className: string }> = {
    DRAFT:     { label: "Draft",     className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
    REVIEW:    { label: "In Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    APPROVED:  { label: "Approved",  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    REJECTED:  { label: "Rejected",  className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    PUBLISHED:  { label: "Published",  className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    ARCHIVED:   { label: "Archived",   className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    DEPRECATED: { label: "Deprecated", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    ROLLBACK:   { label: "Rollback",   className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  };
  const cfg = map[s] ?? { label: status ?? "—", className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function useSchemaColumns(): ColumnDef<SchemaRecord>[] {
  const { t } = useTranslation();
  return [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.schema.colSchema")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-foreground text-sm">
          {row.original.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {(() => {
            const ver = row.original.latest_version;
            const pub = row.original.latest_published_version;
            const sameVersion = ver && pub && ver === pub;
            if (sameVersion) {
              return (
                <span className="text-[10px] font-medium px-1.5 py-px rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {pub}
                </span>
              );
            }
            return (
              <>
                {ver && (
                  <span className="text-[11px] text-muted-foreground font-mono">{ver}</span>
                )}
                {pub && (
                  <>
                    <span className="text-muted-foreground/40 text-[10px]">·</span>
                    <span className="text-[10px] font-medium px-1.5 py-px rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {pub}
                    </span>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>
    ),
    enableSorting: true,
    size: 280,
  },
  {
    id: "customer_type",
    accessorFn: (row) => row.customer_type,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.schema.colCustomerType")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-sm capitalize text-muted-foreground">
        {row.original.customer_type}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "schema_type",
    accessorFn: (row) => row.schema_type,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.schema.colType")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 capitalize">
        {row.original.schema_type}
      </span>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    id: "schema_status",
    accessorFn: (row) => row.schema_status,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.schema.colStatus")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <SchemaStatusBadge status={row.original.schema_status} />,
    enableSorting: true,
    size: 120,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.schema.colActions")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
  ];
}
