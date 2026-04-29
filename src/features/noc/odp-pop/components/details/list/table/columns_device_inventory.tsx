"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { PopDeviceDetail } from "@/features/noc/odp-pop/data/dummy-pop-details";

export const columns: ColumnDef<PopDeviceDetail>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="DEVICE NAME"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.name}</span>
    ),
    size: 180,
  },
  {
    id: "model",
    accessorKey: "model",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="MODEL"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.model}
      </span>
    ),
    size: 150,
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="TYPE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={`text-[10px] px-2 py-0 ${row.original.type === "Core Switch"
          ? "bg-purple-100 text-purple-700"
          : row.original.type === "Router"
            ? "bg-orange-100 text-orange-700"
            : ""
          }`}
      >
        {row.original.type}
      </Badge>
    ),
    size: 110,
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
        variant={row.original.status === "active" ? "success" : "warning"}
        appearance="light"
        className="uppercase text-[10px] tracking-tighter"
      >
        {row.original.status === "active" ? "Online" : "Warning"}
      </Badge>
    ),
    size: 100,
  },
  {
    id: "ipAddress",
    accessorKey: "ipAddress",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="IP ADDRESS"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.ipAddress}
      </span>
    ),
    size: 120,
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
    cell: () => (
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="sm"
          className="h-8 px-4 font-black uppercase text-[10px] shadow-sm"
        >
          Manage
        </Button>
      </div>
    ),
    size: 100,
  },
];
