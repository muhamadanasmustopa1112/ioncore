"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Progress } from "@/components/ui/progress";
import { OdpListItem } from "@/features/noc/odp-pop/data/dummy-odp-list";

export const columns: ColumnDef<OdpListItem>[] = [
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
      <span className="font-medium text-foreground">
        {row.original.name}
      </span>
    ),
    size: 200,
  },
  {
    id: "latitude",
    accessorKey: "latitude",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="LATITUDE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.latitude.toFixed(4)}
      </span>
    ),
    size: 110,
  },
  {
    id: "longitude",
    accessorKey: "longitude",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="LONGITUDE"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.longitude.toFixed(4)}
      </span>
    ),
    size: 110,
  },
  {
    id: "ponPort",
    accessorKey: "ponPort",
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
        {row.original.ponPort}
      </Badge>
    ),
    size: 110,
  },
  {
    id: "splitters",
    accessorKey: "splitters",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="SPLITTERS"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase text-center"
      />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="text-foreground font-bold text-sm">
          {row.original.splitters}
        </span>
      </div>
    ),
    size: 100,
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
      const used = row.original.portsUsed;
      const total = row.original.totalPorts;
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
  {
    id: "signalLevel",
    accessorKey: "signalLevel",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="SIGNAL LEVEL"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => {
      const signal = row.original.signalLevel;
      const isGood = signal >= -20;
      const isWarn = signal >= -24 && signal < -20;

      return (
        <Badge
          variant={isGood ? "success" : isWarn ? "warning" : "destructive"}
          appearance="light"
          className="uppercase text-[10px] tracking-tighter font-mono"
        >
          {signal.toFixed(1)} dBm
        </Badge>
      );
    },
    size: 130,
  },
];
