"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CoverageData } from "../../../../types/coverage";
import { ActionsCell } from "./actions-cell";

export const columns: ColumnDef<CoverageData>[] = [
  {
    id: "areaName",
    accessorFn: (row) => row.areaName,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Area Name"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.areaName}</span>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "village",
    accessorFn: (row) => row.village,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Village (Kelurahan)"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className={row.original.village ? "text-foreground" : "text-muted-foreground/40"}>
        {row.original.village || "—"}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "district",
    accessorFn: (row) => row.district,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="District (Kecamatan)"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className={row.original.district ? "text-foreground" : "text-muted-foreground/40"}>
        {row.original.district || "—"}
      </span>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "city",
    accessorFn: (row) => row.city,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="City"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.city}</span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "province",
    accessorFn: (row) => row.province,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Province"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.province}</span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "postalCode",
    accessorFn: (row) => row.postalCode,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Postal Code"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className={row.original.postalCode ? "font-mono text-xs text-foreground" : "text-muted-foreground/40"}>
        {row.original.postalCode || "—"}
      </span>
    ),
    enableSorting: false,
    size: 110,
  },
  {
    id: "isActive",
    accessorFn: (row) => row.isActive,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Status"
        column={column}
        className="text-foreground font-semibold"
      />
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
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Actions"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];
