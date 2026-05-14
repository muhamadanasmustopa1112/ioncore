"use client";

import { useState, useEffect, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { ActionsCellOdp } from "./data-table-actions-odp";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PopData } from "../../../types/pop";


export const getPopColumns = (type: 'pop' | 'odp' = 'pop'): ColumnDef<PopData>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} className="text-foreground" />
    ),
    cell: ({ row, table }) => (
      <div
        className="flex flex-col gap-1 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => (table.options.meta as any)?.onPopSelect(row.original.id)}
      >
        <span className="font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
          {row.original.name}
        </span>
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataGridColumnHeader title="Code" column={column} className="text-foreground" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80">
        {getValue() as string || "-"}
      </div>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <DataGridColumnHeader title="Area" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-foreground/80">
        {row.original.area}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataGridColumnHeader title="Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-foreground/80 truncate max-w-[200px] cursor-help">
              {row.original.address || "-"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px] break-words">
            {row.original.address}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "gps_lat",
    header: ({ column }) => (
      <DataGridColumnHeader title="Latitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80 font-mono text-xs">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "gps_lng",
    header: ({ column }) => (
      <DataGridColumnHeader title="Longitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80 font-mono text-xs">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => {
      const status = (getValue() as string || "UNKNOWN").toUpperCase();
      let variant: any = "secondary";

      if (status === "UP") variant = "success";
      if (status === "DOWN") variant = "destructive";
      if (status === "DEGRADED") variant = "warning";

      return (
        <Badge variant={variant} appearance="light" shape="circle" className="px-2 font-semibold uppercase">
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => type === 'odp' ? <ActionsCellOdp row={row} /> : <ActionsCell row={row} />,
    enableSorting: false,
    size: 50,
  },
];
