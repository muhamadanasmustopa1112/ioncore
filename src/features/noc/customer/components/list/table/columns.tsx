"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell, RenewPrintCell } from "./data-table-actions-cell";
import { CustomerData } from "../../../types";

export const columns: ColumnDef<CustomerData>[] = [
  {
    id: "customerId",
    accessorFn: (row) => row.customerId,
    header: ({ column }) => (
      <DataGridColumnHeader title="Customer ID" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.customerId}
      </div>
    ),
    enableSorting: true,
    size: 130,
  },
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-foreground">
        {row.original.name}
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "serviceType",
    accessorFn: (row) => row.serviceType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Service Type" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.serviceType}</div>,
    enableSorting: true,
    size: 130,
  },
  {
    id: "servicePlan",
    accessorFn: (row) => row.servicePlan,
    header: ({ column }) => (
      <DataGridColumnHeader title="Service Plan" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-primary font-medium">
        {row.original.servicePlan}
      </div>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "ipAddress",
    accessorFn: (row) => row.ipAddress,
    header: ({ column }) => (
      <DataGridColumnHeader title="IP Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <code className="text-xs">{row.original.ipAddress}</code>,
    enableSorting: true,
    size: 130,
  },
  {
    id: "renewedOn",
    accessorFn: (row) => row.renewedOn,
    header: ({ column }) => (
      <DataGridColumnHeader title="Renewed On" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.renewedOn), "dd MMM yyyy")}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    id: "dueDate",
    accessorFn: (row) => row.dueDate,
    header: ({ column }) => (
      <DataGridColumnHeader title="Due Date" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-tertiary">
        {format(new Date(row.original.dueDate), "dd MMM yyyy")}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    id: "dataOwner",
    accessorFn: (row) => row.dataOwner,
    header: ({ column }) => (
      <DataGridColumnHeader title="Data Owner" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.dataOwner}</div>,
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
    enableSorting: false,
    size: 75,
  },
];
