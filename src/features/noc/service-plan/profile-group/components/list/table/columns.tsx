"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileGroupItem } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";
 
export const columns: ColumnDef<ProfileGroupItem>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Group Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.name}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: "profile_type",
    accessorFn: (row) => row.profile_type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.profile_type}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-16" />,
    },
    enableSorting: true,
    size: 120,
  },
  {
    id: "parent_pool",
    accessorFn: (row) => row.parent_pool,
    header: ({ column }) => (
      <DataGridColumnHeader title="Parent Pool" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.parent_pool}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "module",
    accessorFn: (row) => row.module,
    header: ({ column }) => (
      <DataGridColumnHeader title="Module" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.module}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-20" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "local_address",
    accessorFn: (row) => row.local_address,
    header: ({ column }) => (
      <DataGridColumnHeader title="Local Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.local_address}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "first_address",
    accessorFn: (row) => row.first_address,
    header: ({ column }) => (
      <DataGridColumnHeader title="First Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-primary">
        {row.original.first_address}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "last_address",
    accessorFn: (row) => row.last_address,
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-tertiary">
        {row.original.last_address}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "router_nas",
    accessorFn: (row) => row.router_nas,
    header: ({ column }) => (
      <DataGridColumnHeader title="Routers [ NAS ]" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.router_nas}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-36" />,
    },
    enableSorting: true,
    size: 180,
  },
  {
    id: "data_owner",
    accessorFn: (row) => row.data_owner,
    header: ({ column }) => (
      <DataGridColumnHeader title="Data Owner" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {row.original.data_owner?.substring(0, 2).toUpperCase() || "??"}
        </div>
        <span>{row.original.data_owner}</span>
      </div>
    ),
    meta: {
      skeleton: (
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ),
    },
    enableSorting: true,
    size: 180,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row as any} />,
    meta: {
      skeleton: (
        <div className="flex justify-center">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ),
    },
    enableSorting: false,
    size: 75,
  },
];
