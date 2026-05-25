"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Progress } from "@/components/ui/progress";
import { OdpData } from "@/features/noc/odp-pop/types/odp";

import { OdpActionsCell } from "./odp-actions-cell";

export function useOdpColumns(): ColumnDef<OdpData>[] {
  const { t } = useTranslation();
  return [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("odpPop.odpName", "ODP NAME")}
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-foreground">
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
        title={t("odpPop.latitude", "LATITUDE")}
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
        title={t("odpPop.longitude", "LONGITUDE")}
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
        title={t("odpPop.ponPort", "PON PORT")}
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
        title={t("odpPop.portCapacity")}
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
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("common.status")}
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "UP" ? "success" : row.original.status === "DOWN" ? "destructive" : "warning"}
        appearance="light"
        className="text-[11px] px-2.5 py-0.5 shadow-none rounded-md uppercase font-mono tracking-tight"
      >
        {row.original.status || "N/A"}
      </Badge>
    ),
    size: 110,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("common.actions")}
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase text-center"
      />
    ),
    cell: ({ row }) => <OdpActionsCell row={row} />,
    size: 100,
  },
  ];
}

export const columns = useOdpColumns;

