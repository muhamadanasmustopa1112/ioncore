"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { BandwidthItem } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";
import { Skeleton } from "@/components/ui/skeleton";

export const columns: ColumnDef<BandwidthItem>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Bandwidth Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.name}
      </div>
    ),
    enableSorting: true,
    size: 200,
    meta: {
      skeleton: <Skeleton className="h-4 w-[150px]" />,
    },
  },
  {
    id: "upload",
    accessorFn: (row) => row.upload_display,
    header: ({ column }) => (
      <DataGridColumnHeader title="Upload (Min | Max)" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-medium text-blue-600">
        {row.original.upload_display}
      </div>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      skeleton: <Skeleton className="h-4 w-[100px]" />,
    },
  },
  {
    id: "download",
    accessorFn: (row) => row.download_display,
    header: ({ column }) => (
      <DataGridColumnHeader title="Download (Min | Max)" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-medium text-emerald-600">
        {row.original.download_display}
      </div>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      skeleton: <Skeleton className="h-4 w-[100px]" />,
    },
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
    enableSorting: true,
    size: 200,
    meta: {
      skeleton: (
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ),
    },
  },
  {
    id: "type",
    accessorFn: (row) => row.type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.original.type}</div>,
    enableSorting: true,
    size: 130,
    meta: {
      skeleton: <Skeleton className="h-4 w-[80px]" />,
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row as any} />,
    enableSorting: false,
    size: 75,
    meta: {
      skeleton: <Skeleton className="size-8 rounded-md" />,
    },
  },
];
