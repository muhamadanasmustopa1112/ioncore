"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RadiusLog } from "../../types/radius-dashboard";
import { RiRadioButtonLine } from "@remixicon/react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

export function useRadiusLogColumns(): ColumnDef<RadiusLog>[] {
  const { t } = useTranslation();
  return useMemo(() => [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colTimestamp")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.timestamp}
      </span>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colUsername")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-foreground">
          {row.original.username}
        </span>
        <span className="text-muted-foreground">
          {row.original.serviceType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nasIp",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colNasIp")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-foreground">{row.original.nasIp}</span>
        <span className="text-muted-foreground">{t("radius.nasPort")}: {row.original.nasPort}</span>
      </div>
    ),
  },
  {
    accessorKey: "callingStationId",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colCallingStation")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.callingStationId}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colStatus")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const configs: Record<string, { variant: any; label: string; bg: string; text: string }> = {
        success: { variant: 'success', label: 'SUCCESS', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
        failed: { variant: 'destructive', label: 'FAILED', bg: 'bg-rose-500/10', text: 'text-rose-600' },
        reject: { variant: 'warning', label: 'REJECT', bg: 'bg-amber-500/10', text: 'text-amber-600' },
        timeout: { variant: 'info', label: 'TIMEOUT', bg: 'bg-blue-500/10', text: 'text-blue-600' },
      };

      const config = configs[status] || configs.timeout;

      return (
        <Badge
          variant={config.variant}
          appearance="light"
          className={`gap-1 border-none px-2.5 h-6 rounded-lg ${config.bg} ${config.text}`}
        >
          <RiRadioButtonLine className="size-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("radius.colReason")} column={column} className="text-foreground" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.reason || (row.original.status === 'success' ? t("radius.authenticated") : t("radius.unknownError"))}
      </span>
    ),
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [t]);
}
