"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { BandwidthData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<BandwidthData>[] = [
  {
    id: "bandwidthName",
    accessorFn: (row) => row.bandwidthName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Bandwidth Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.bandwidthName}
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "upload",
    accessorFn: (row) => `${row.uploadMin} | ${row.uploadMax}`,
    header: ({ column }) => (
      <DataGridColumnHeader title="Upload (Min | Max)" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-blue-600">{row.original.uploadMin}</span>
        <span className="text-muted-foreground/40">|</span>
        <span className="font-medium text-blue-700">{row.original.uploadMax}</span>
        <span className="ml-1 text-[10px] font-bold text-muted-foreground/60 uppercase">{row.original.unit}</span>
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "download",
    accessorFn: (row) => `${row.downloadMin} | ${row.downloadMax}`,
    header: ({ column }) => (
      <DataGridColumnHeader title="Download (Min | Max)" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-emerald-600">{row.original.downloadMin}</span>
        <span className="text-muted-foreground/40">|</span>
        <span className="font-medium text-emerald-700">{row.original.downloadMax}</span>
        <span className="ml-1 text-[10px] font-bold text-muted-foreground/60 uppercase">{row.original.unit}</span>
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "dataOwner",
    accessorFn: (row) => row.dataOwner,
    header: ({ column }) => (
      <DataGridColumnHeader title="Data Owner" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {row.original.dataOwner.substring(0, 2).toUpperCase()}
        </div>
        <span>{row.original.dataOwner}</span>
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader title="Description" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-[200px]" title={row.original.description}>
        {row.original.description}
      </div>
    ),
    enableSorting: true,
    size: 220,
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

