"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  RiUserLine,
  RiSignalTowerLine,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiDatabase2Line
} from "@remixicon/react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { thousandSeparator } from "@/lib/string";
import { PPPProfileData } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<PPPProfileData>[] = [
  {
    id: "planeName",
    accessorFn: (row) => row.planeName,
    header: ({ column }) => (
      <DataGridColumnHeader title="Plan Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-foreground py-1">
        {row.original.planeName}
      </div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "profileGroup",
    accessorFn: (row) => row.profileGroup,
    header: ({ column }) => (
      <DataGridColumnHeader title="Profile Group" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground font-medium">
        {row.original.profileGroup}
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "bandwidth",
    accessorFn: (row) => row.bandwidth,
    header: ({ column }) => (
      <DataGridColumnHeader title="Bandwidth" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <Badge variant="info" appearance="light" className="gap-1.5 font-bold uppercase tracking-tight">
        <RiSignalTowerLine className="size-3" />
        {row.original.bandwidth}
      </Badge>
    ),
    enableSorting: true,
    size: 250,
  },
  {
    id: "capitalPrice",
    accessorFn: (row) => row.capitalPrice,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Capital Price"
        column={column}
        className="text-foreground font-semibold justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-semibold text-foreground/80">
        <span className="text-[10px] text-muted-foreground mr-1 font-bold">Rp</span>
        {thousandSeparator(row.original.capitalPrice)}
      </div>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "sellPrice",
    accessorFn: (row) => row.sellPrice,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Sell Price"
        column={column}
        className="text-foreground font-semibold justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-bold text-primary">
        <span className="text-[10px] opacity-70 mr-1">Rp</span>
        {thousandSeparator(row.original.sellPrice)}
      </div>
    ),
    enableSorting: true,
    size: 160,
  },
  {
    id: "sharedUser",
    accessorFn: (row) => row.sharedUser,
    header: ({ column }) => (
      <DataGridColumnHeader title="Shared User" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" appearance="light" className="gap-1.5 font-bold">
        <RiUserLine className="size-3" />
        {row.original.sharedUser}
      </Badge>
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
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <RiDatabase2Line className="size-3.5 opacity-50" />
        {row.original.dataOwner}
      </div>
    ),
    enableSorting: true,
    size: 180,
  },
  {
    id: "vcrCustomer",
    accessorFn: (row) => row.vcrCustomer,
    header: ({ column }) => (
      <DataGridColumnHeader title="VCR | Customer" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-foreground">
        {row.original.vcrCustomer || '-'}
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
        <ActionsCell row={row} />
      </div>
    ),
    enableSorting: false,
    size: 80,
  },
];
