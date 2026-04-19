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
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {new Date(row.original.timestamp).toLocaleString("id-ID", {
            dateStyle: "short",
            timeStyle: "medium",
          })}
        </span>
      ),
      size: 150,
    },
    {
      id: "user",
      accessorFn: (row) => row.userName,
      header: "User",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.userName}</span>
          <span className="text-xs text-muted-foreground">{row.original.userRole}</span>
        </div>
      ),
      size: 160,
    },
    {
      id: "action",
      accessorFn: (row) => row.actionType,
      header: "Action",
      cell: ({ row }) => (
        <Badge
          variant={ACTION_VARIANTS[row.original.actionType] ?? "secondary"}
          appearance="light"
          className="capitalize text-xs"
        >
          {row.original.actionType}
        </Badge>
      ),
      size: 100,
    },
    {
      id: "module",
      accessorFn: (row) => row.module,
      header: "Module",
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.original.module.replace(/_/g, " ")}</span>
      ),
      size: 140,
    },
    {
      id: "recordType",
      accessorFn: (row) => row.recordType,
      header: "Record Type",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.recordType}</span>
      ),
      size: 140,
    },
    {
      id: "record",
      accessorFn: (row) => row.recordIdentifier,
      header: "Record",
      cell: ({ row }) => (
        <span className="text-sm font-medium truncate max-w-[180px] block">
          {row.original.recordIdentifier}
        </span>
      ),
      size: 200,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={STATUS_VARIANTS[row.original.status] ?? "secondary"}
          appearance="light"
          className="capitalize text-xs"
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
