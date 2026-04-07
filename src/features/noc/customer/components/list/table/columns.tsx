"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { CustomerData } from "../../../types";

const statusColorMap: Record<CustomerData["pingStatus"], string> = {
  online: "bg-green-500",
  warning: "bg-yellow-500",
  offline: "bg-red-500",
};

export const columns: ColumnDef<CustomerData>[] = [
  {
    id: "pingStatus",
    accessorFn: (row) => row.pingStatus,
    header: ({ column }) => (
      <DataGridColumnHeader title="Ping Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={`block size-2.5 rounded-full ${statusColorMap[row.original.pingStatus]
            }`}
        />
        <span className="capitalize">{row.original.pingStatus}</span>
      </div>
    ),
    enableSorting: true,
    size: 130,
  },
  {
    id: "routerName",
    accessorFn: (row) => row.routerName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Router Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.routerName}
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "ipAddress",
    accessorFn: (row) => row.ipAddress,
    header: ({ column }) => (
      <DataGridColumnHeader title="IP Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.ipAddress}</div>,
    enableSorting: true,
    size: 150,
  },
  {
    id: "timeZone",
    accessorFn: (row) => row.timeZone,
    header: ({ column }) => (
      <DataGridColumnHeader title="Time Zone" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.timeZone}</div>,
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
    enableSorting: true,
    size: 220,
  },
  {
    id: "onlineUsers",
    accessorFn: (row) => row.onlineUsers,
    header: ({ column }) => (
      <DataGridColumnHeader title="Online Users" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.onlineUsers}</div>,
    enableSorting: true,
    size: 130,
  },
  {
    id: "lastChecked",
    accessorFn: (row) => row.lastChecked,
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Checked" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.lastChecked), "dd MMM yyyy, HH:mm")}
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "actions",
    accessorFn: (row) => row.lastChecked,
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];
