"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  RiUserLine,
  RiDatabase2Line
} from "@remixicon/react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { PPPProfileItem } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<PPPProfileItem>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Plan Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-foreground py-1">
        {row.original.name}
      </div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "code",
    accessorFn: (row) => row.code,
    header: ({ column }) => (
      <DataGridColumnHeader title="Code" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-foreground py-1">
        {row.original.code}
      </div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "profile_group",
    accessorFn: (row) => row.profile_group,
    header: ({ column }) => (
      <DataGridColumnHeader title="Profile Group" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground font-medium">
        {row.original.profile_group}
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "capital_price_display",
    accessorFn: (row) => row.capital_price_display,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Capital Price"
        column={column}
        className="text-foreground font-semibold justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-semibold text-foreground/80">
        {row.original.capital_price_display}
      </div>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "sell_price_display",
    accessorFn: (row) => row.sell_price_display,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Sell Price"
        column={column}
        className="text-foreground font-semibold justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-bold text-primary">
        {row.original.sell_price_display}
      </div>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "shared_users",
    accessorFn: (row) => row.shared_users,
    header: ({ column }) => (
      <DataGridColumnHeader title="Shared User" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" appearance="light" className="gap-1.5 font-bold">
        <RiUserLine className="size-3" />
        {row.original.shared_users}
      </Badge>
    ),
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
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <RiDatabase2Line className="size-3.5 opacity-50" />
        {row.original.data_owner}
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "vcr_customer_display",
    accessorFn: (row) => row.vcr_customer_display,
    header: ({ column }) => (
      <DataGridColumnHeader title="VCR | Customer" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-foreground" title={row.original.vcr_customer_tooltip?.replace(/<br>/g, '\n')}>
        {row.original.vcr_customer_display || '-'}
      </div>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="text-center font-semibold text-foreground px-2">Action</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ActionsCell row={row as any} />
      </div>
    ),
    enableSorting: false,
    size: 80,
  },
];
