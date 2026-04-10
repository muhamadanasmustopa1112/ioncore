"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Progress } from "@/components/ui/progress";
import { PopOltDetail } from "@/features/noc/odp-pop/data/dummy-olt-details";
import { paths } from "@/config/paths";

export const columns: ColumnDef<PopOltDetail>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="OLT NAME"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground leading-none">
          {row.original.name}
        </span>
        <span className="text-[10px] text-muted-foreground/60 tracking-tighter">
          {row.original.model}
        </span>
      </div>
    ),
    size: 220,
  },
  {
    id: "capacity",
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
              {used} / {total} <span className="text-muted-foreground/50 ml-0.5">Ports</span>
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
    id: "odpCount",
    accessorKey: "odpCount",
    header: ({ column }) => (
      <DataGridColumnHeader
        title="ODP CONNECTED"
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase text-center"
      />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant="secondary"
          className="text-[11px] px-2.5 py-0.5 bg-blue-50 text-primary border-blue-100 shadow-none rounded-md"
        >
          {row.original.odpCount} <span className="ml-1">ODPs</span>
        </Badge>
      </div>
    ),
    size: 140,
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
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link href={paths.dashboard.networkAndOrchestration.odpPop.oltDetail.getHref(row.original.id)}>
          <Button
            variant="primary"
            size="sm"
            className="h-8 px-4 font-black uppercase text-[10px] shadow-sm"
          >
            Manage
          </Button>
        </Link>
      </div>
    ),
    size: 100,
  },
];
