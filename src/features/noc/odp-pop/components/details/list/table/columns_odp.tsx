"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Progress } from "@/components/ui/progress";
import { OdpData } from "@/features/noc/odp-pop/types/odp";

export const columns: ColumnDef<OdpData>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="ODP NAME"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 cursor-pointer hover:opacity-70 transition-opacity">
        <span className="font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
          {row.original.name}
        </span>
      </div>
    ),
    size: 200,
  },
  {
    id: "gps_lat",
    accessorKey: "gps_lat",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="LATITUDE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {Number(row.original.gps_lat || 0).toFixed(4)}
      </span>
    ),
    size: 110,
  },
  {
    id: "gps_lng",
    accessorKey: "gps_lng",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="LONGITUDE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {Number(row.original.gps_lng || 0).toFixed(4)}
      </span>
    ),
    size: 110,
  },
  {
    id: "olt_port",
    accessorKey: "olt_port",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="PON PORT"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="text-[11px] px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 shadow-none rounded-md uppercase font-mono tracking-tight"
      >
        {row.original.olt_port || "N/A"}
      </Badge>
    ),
    size: 110,
  },
  {
    id: "portCapacity",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="PORT CAPACITY"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => {
      const used = row.original.occupied_port ?? row.original.ports_used ?? 0;
      const total = row.original.total_port ?? row.original.total_ports ?? 8;
      const percentage = (used / total) * 100;

      return (
        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter">
            <span className="text-foreground">
              {used} / {total}{" "}
              <span className="text-muted-foreground/50 ml-0.5">Ports</span>
            </span>
            <span
              className={
                percentage > 90
                   ? "text-destructive"
                   : percentage > 70
                     ? "text-orange-500"
                     : "text-primary"
              }
            >
              {Math.round(percentage)}%
            </span>
          </div>
          <Progress
            value={percentage}
            className="h-1.5"
            indicatorClassName={
              percentage > 90
                ? "bg-destructive"
                : percentage > 70
                  ? "bg-orange-500"
                  : "bg-primary"
            }
          />
        </div>
      );
    },
    size: 160,
  },
];
