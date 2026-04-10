"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { PopData } from "../../../types/odp-pop";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<PopData>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} className="text-foreground" />
    ),
    cell: ({ row, table }) => (
      <div
        className="flex flex-col gap-1 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => (table.options.meta as any)?.onPopSelect(row.original.id)}
      >
        <span className="font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
          {row.original.name}
        </span>
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "oltCount",
    header: ({ column }) => (
      <DataGridColumnHeader title="OLT" column={column} className="text-foreground justify-center text-center" />
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-foreground/80">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 50,
  },
  {
    accessorKey: "odpCount",
    header: ({ column }) => (
      <DataGridColumnHeader title="ODP" column={column} className="text-foreground font-semibold justify-center " />
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-foreground/80">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 50,
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <DataGridColumnHeader title="Area" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-center text-foreground/80">
        {row.original.area}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "latitude",
    header: ({ column }) => (
      <DataGridColumnHeader title="Latitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-foreground/80">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 50,
  },
  {
    accessorKey: "longitude",
    header: ({ column }) => (
      <DataGridColumnHeader title="Longitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-foreground/80">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 50,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive"; className: string }> = {
        active: {
          label: "Active",
          variant: "success",
          className: "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20"
        },
        warning: {
          label: "Warning",
          variant: "warning",
          className: "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20"
        },
        down: {
          label: "Down",
          variant: "destructive",
          className: "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/20"
        },
      };

      const config = statusConfig[status] || statusConfig.active;

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
          {config.label}
        </span>
      );
    },
    enableSorting: true,
    size: 70,
  },
  {
    id: "actions",
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 30,
  },
];
