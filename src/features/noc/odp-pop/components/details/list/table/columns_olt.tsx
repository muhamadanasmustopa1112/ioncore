"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Progress } from "@/components/ui/progress";
import { OltData } from "@/features/noc/odp-pop/types/olt";
import { OltActionsCell } from "./olt-actions-cell";

export function useOltColumns(): ColumnDef<OltData>[] {
  const { t } = useTranslation();
  return [
  {
    id: "code",
    accessorKey: "code",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("odpPop.oltCode", "OLT CODE")}
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
        title={t("common.name")}
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
    id: "ports",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("odpPop.portCapacity", "PORT CAPACITY")}
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase"
      />
    ),
    cell: ({ row }) => {
      const used = row.original.occupied_port ?? 0;
      const total = row.original.total_port ?? 16;
      const percentage = (used / total) * 100;

      return (
        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter">
            <span className="text-foreground font-bold">
              {used} / {total}
              <span className="text-muted-foreground/50 ml-1">Ports</span>
            </span>
            <span
              className={
                percentage > 90
                  ? "text-destructive"
                  : percentage > 70
                    ? "text-orange-500"
                    : "text-primary font-bold"
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
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("common.actions")}
        column={column}
        className="text-[10px] text-muted-foreground font-black tracking-widest uppercase text-center"
      />
    ),
    cell: ({ row }) => <OltActionsCell row={row} />,
    size: 100,
  },
  ];
}
