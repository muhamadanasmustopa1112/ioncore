"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { OltData } from "@/features/noc/odp-pop/types/olt";
import { OltActionsCell } from "./olt-actions-cell";

export const columns: ColumnDef<OltData>[] = [
  {
    id: "code",
    accessorKey: "code",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="OLT CODE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-primary font-black">{row.original.code}</span>
    ),
    size: 200,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="NAME"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-medium">{row.original.name}</span>
    ),
    size: 200,
  },
  {
    id: "area",
    accessorKey: "area",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="AREA"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.area}
      </span>
    ),
    size: 150,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="STATUS"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "ACTIVE" ? "success" : "warning"}
        appearance="light"
        className="uppercase text-[10px] tracking-tighter"
      >
        {row.original.status || "UNKNOWN"}
      </Badge>
    ),
    size: 100,
  },
  {
    id: "address",
    accessorKey: "address",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="ADDRESS"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <p className="text-muted-foreground truncate max-w-[300px]">
        {row.original.address}
      </p>
    ),
    size: 300,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="ACTIONS"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase text-center"
      />
    ),
    cell: ({ row }) => <OltActionsCell row={row} />,
    size: 100,
  },
];
