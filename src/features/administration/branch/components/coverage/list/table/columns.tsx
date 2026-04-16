"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CoverageData } from "../../../../types/coverage";
import { ActionsCell } from "./actions-cell";

export const columns: ColumnDef<CoverageData>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Name"
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
        title="Description"
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
    size: 240,
  },
  {
    id: "service_area",
    accessorFn: (row) => row.coverageJson.service_area.join(", "),
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Service Areas"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const areas = row.original.coverageJson.service_area;
      return areas.length > 0 ? (
        <span className="text-foreground text-xs">
          {areas.slice(0, 2).join(", ")}
          {areas.length > 2 && (
            <span className="text-muted-foreground"> +{areas.length - 2}</span>
          )}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
    enableSorting: false,
    size: 200,
  },
  {
    id: "network_scope",
    accessorFn: (row) => row.coverageJson.network_scope,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Network Scope"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-foreground bg-muted px-2 py-0.5 rounded">
        {row.original.coverageJson.network_scope || "—"}
      </span>
    ),
    enableSorting: true,
    size: 130,
  },
  {
    id: "dispatch_radius_km",
    accessorFn: (row) => row.coverageJson.dispatch_radius_km,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Radius (km)"
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">
        {row.original.coverageJson.dispatch_radius_km ?? "—"}
      </span>
    ),
    enableSorting: true,
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
