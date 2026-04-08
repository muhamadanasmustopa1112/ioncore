"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ProfileGroupData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<ProfileGroupData>[] = [
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataGridColumnHeader title="Group Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="font-medium text-foreground">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="font-medium">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "parentPool",
    header: ({ column }) => (
      <DataGridColumnHeader title="Parent Pool" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "module",
    header: ({ column }) => (
      <DataGridColumnHeader title="Module" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "localAddress",
    header: ({ column }) => (
      <DataGridColumnHeader title="Local Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="font-mono">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "firstAddress",
    header: ({ column }) => (
      <DataGridColumnHeader title="First Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="font-mono text-primary">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "lastAddress",
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="font-mono text-tertiary">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "routersNas",
    header: ({ column }) => (
      <DataGridColumnHeader title="Routers [ NAS ]" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">
        {getValue() as string}
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    accessorKey: "dataOwner",
    header: ({ column }) => (
      <DataGridColumnHeader title="Data Owner" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {(getValue() as string).substring(0, 2).toUpperCase()}
        </div>
        <span>{getValue() as string}</span>
      </div>
    ),
    enableSorting: true,
    size: 180,
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



