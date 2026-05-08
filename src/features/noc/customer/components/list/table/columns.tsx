"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ActionsCell, RenewPrintCell } from "./data-table-actions-cell";
import { PPPCustomer } from "../../../types";

export const columns: ColumnDef<PPPCustomer>[] = [
  {
    id: "member_id",
    accessorFn: (row) => row.member_id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Member ID" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground whitespace-nowrap">
        {row.original.member_id}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: "username",
    accessorFn: (row) => row.username,
    header: ({ column }) => (
      <DataGridColumnHeader title="Username" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground whitespace-nowrap">
        {row.original.username}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: "fullname",
    accessorFn: (row) => row.fullname,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
        {row.original.fullname}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-32" />,
    },
    enableSorting: true,
    size: 220,
  },
  {
    id: "servicetype",
    accessorFn: (row) => row.servicetype,
    header: ({ column }) => (
      <DataGridColumnHeader title="Service Type" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.original.servicetype}</div>,
    meta: {
      skeleton: <Skeleton className="h-4 w-20" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "plan_name",
    accessorFn: (row) => row.plan_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Service Plan" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => (
      <div className="text-primary font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
        {row.original.plan_name}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-28" />,
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: "auth_status",
    accessorFn: (row) => row.auth_status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Auth Status" column={column} className="text-foreground font-semibold whitespace-nowrap" />
    ),
    cell: ({ row }) => (
      <div className={`font-semibold whitespace-nowrap ${row.original.auth_status === "Enabled-Users" ? "text-emerald-600" : "text-rose-600"}`}>
        {row.original.auth_status}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "remote_address",
    accessorFn: (row) => row.remote_address,
    header: ({ column }) => (
      <DataGridColumnHeader title="IP Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <code className="text-xs">{row.original.remote_address}</code>,
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "trx_status",
    accessorFn: (row) => row.trx_status,
    header: ({ column }) => (
      <DataGridColumnHeader title="Tx Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.trx_status === "PAID" ? "success" : "warning"}>
        {row.original.trx_status}
      </Badge>
    ),
    meta: {
      skeleton: <Skeleton className="h-6 w-16" />,
    },
    enableSorting: true,
    size: 110,
  },
  {
    id: "renewed_on",
    accessorFn: (row) => row.renewed_on,
    header: ({ column }) => (
      <DataGridColumnHeader title="Renewed On" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.renewed_on), "dd MMM yyyy")}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "expired_on",
    accessorFn: (row) => row.expired_on,
    header: ({ column }) => (
      <DataGridColumnHeader title="Due Date" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-tertiary">
        {row.original.expired_on !== "0000-00-00 00:00:00"
          ? format(new Date(row.original.expired_on), "dd MMM yyyy")
          : "-"}
      </div>
    ),
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "owner_name",
    accessorFn: (row) => row.owner_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Data Owner" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.owner_name}</div>,
    meta: {
      skeleton: <Skeleton className="h-4 w-24" />,
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: "renewPrint",
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Renew | Print" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <RenewPrintCell row={row} />,
    meta: {
      skeleton: <Skeleton className="h-8 w-16 rounded-md" />,
    },
    enableSorting: false,
    size: 110,
  },
  {
    id: "actions",
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    meta: {
      skeleton: <Skeleton className="h-8 w-8 rounded-full" />,
    },
    enableSorting: false,
    size: 75,
  },
];
