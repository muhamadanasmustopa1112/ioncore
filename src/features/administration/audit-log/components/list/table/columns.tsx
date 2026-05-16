"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { AuditLog } from "../../../types/audit-log";

const ACTION_VARIANTS: Record<string, "success" | "destructive" | "warning" | "info" | "secondary"> = {
  create: "success",
  update: "info",
  delete: "destructive",
  archive: "secondary",
  publish: "success",
  approve: "success",
  reject: "destructive",
  override: "warning",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "destructive"> = {
  success: "success",
  partial: "warning",
  failed: "destructive",
};

interface ActionsCellProps {
  row: { original: AuditLog };
  onView: (log: AuditLog) => void;
}

function ActionsCell({ row, onView }: ActionsCellProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2"
      onClick={() => onView(row.original)}
    >
      <Eye className="size-3.5 mr-1" />
      View
    </Button>
  );
}

export function buildColumns(onView: (log: AuditLog) => void): ColumnDef<AuditLog>[] {
  return [
    {
      id: "timestamp",
      accessorFn: (row) => row.timestamp,
      header: "Time",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {new Date(row.original.timestamp).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
      size: 160,
    },
    {
      id: "user",
      accessorFn: (row) => row.user?.name,
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        const name = user?.name || row.original.userName || "—";
        const email = user?.email || row.original.userEmail;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            {email && email !== name && (
              <span className="text-[10px] text-muted-foreground">{email}</span>
            )}
          </div>
        );
      },
      size: 200,
    },
    {
      id: "activity",
      accessorFn: (row) => row.actionType,
      header: "Activity",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.actionType}</span>
          {row.original.changeReason && (
            <span className="text-[11px] text-muted-foreground truncate max-w-[300px]">
              {row.original.changeReason}
            </span>
          )}
        </div>
      ),
      size: 300,
      minSize: 200,
    },
    {
      id: "ipAddress",
      accessorFn: (row) => row.ipAddress,
      header: "IP Address",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.original.ipAddress || "—"}
        </span>
      ),
      size: 120,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={STATUS_VARIANTS[row.original.status] ?? "secondary"}
          appearance="light"
          className="capitalize text-[10px] px-1.5 h-5"
        >
          {row.original.status}
        </Badge>
      ),
      size: 90,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell row={row} onView={onView} />,
      size: 80,
      enableSorting: false,
    },
  ];
}
