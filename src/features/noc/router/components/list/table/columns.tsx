"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RouterItem } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const statusColorMap: Record<string, string> = {
  online: "bg-green-500",
  warning: "bg-yellow-500",
  offline: "bg-red-500",
  timeout: "bg-red-500",
};

export const columns: ColumnDef<RouterItem>[] = [
  {
    id: "ping_status",
    accessorFn: (row) => row.ping_status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Ping Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={`block size-2.5 rounded-full ${statusColorMap[row.original.ping_status] || "bg-gray-400"
            }`}
        />
        <span className="capitalize">{row.original.ping_status_label || row.original.ping_status}</span>
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "router_name",
    accessorFn: (row) => row.router_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Router Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.router_name}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: "ip_address",
    accessorFn: (row) => row.ip_address,
    header: ({ column }) => (
      <DataGridColumnHeader title="IP Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.ip_address}</div>,
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "time_zone",
    accessorFn: (row) => row.time_zone,
    header: ({ column }) => (
      <DataGridColumnHeader title="Time Zone" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.time_zone}</div>,
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 150,
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
    meta: {
      skeleton: <Skeleton className="h-4 w-40" />,
    },
    enableSorting: true,
    size: 220,
  },
  {
    id: "online_users",
    accessorFn: (row) => row.online_users,
    header: ({ column }) => (
      <DataGridColumnHeader title="Online Users" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.online_users}</div>,
    meta: {
      skeleton: <Skeleton className="h-4 w-12" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "last_checked",
    accessorFn: (row) => row.last_checked,
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Checked" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.last_checked ? format(new Date(row.original.last_checked), "dd MMM yyyy, HH:mm") : "-"}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
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
      skeleton: <Skeleton className="h-8 w-8 rounded-full" />,
    },
    enableSorting: false,
    size: 75,
  },
];
