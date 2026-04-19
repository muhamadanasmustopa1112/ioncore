"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Archive, Eye, CheckCircle } from "lucide-react";
import type { ChecklistTemplate } from "../../../../types/checklist-template";
import { WO_TYPE_LABELS, STATUS_LABELS } from "../../../../types/checklist-template";

const STATUS_VARIANTS: Record<string, "success" | "secondary" | "warning" | "info"> = {
  active: "success",
  draft: "warning",
  archived: "secondary",
};

interface ActionsCellProps {
  row: { original: ChecklistTemplate };
  onEdit: (t: ChecklistTemplate) => void;
  onView: (t: ChecklistTemplate) => void;
  onClone: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

function ActionsCell({ row, onEdit, onView, onClone, onPublish, onArchive }: ActionsCellProps) {
  const t = row.original;
  return (
    <div className="flex items-center gap-0.5">
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View / Edit" onClick={() => t.status === "archived" ? onView(t) : onEdit(t)}>
        {t.status === "archived" ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
      </Button>
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Clone" onClick={() => onClone(t.id)}>
        <Copy className="size-3.5" />
      </Button>
      {t.status === "draft" && (
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success hover:text-success" title="Publish" onClick={() => onPublish(t.id)}>
          <CheckCircle className="size-3.5" />
        </Button>
      )}
      {t.status !== "archived" && (
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground" title="Archive" onClick={() => onArchive(t.id)}>
          <Archive className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

interface BuildColumnsOptions {
  onEdit: (t: ChecklistTemplate) => void;
  onView: (t: ChecklistTemplate) => void;
  onClone: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

export function buildColumns(opts: BuildColumnsOptions): ColumnDef<ChecklistTemplate>[] {
  return [
    {
      id: "schemaName",
      accessorFn: (row) => row.schemaName,
      header: "Schema Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.schemaName}</p>
          <p className="text-xs text-muted-foreground">{row.original.description}</p>
        </div>
      ),
      size: 220,
    },
    {
      id: "woType",
      accessorFn: (row) => row.woType,
      header: "WO Type",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{WO_TYPE_LABELS[row.original.woType]}</p>
          {row.original.maintenanceSubtype && (
            <p className="text-xs text-muted-foreground capitalize">
              {row.original.maintenanceSubtype.replace(/_/g, " ")}
            </p>
          )}
        </div>
      ),
      size: 160,
    },
    {
      id: "productType",
      accessorFn: (row) => row.productType,
      header: "Product Type",
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.original.productType}</span>
      ),
      size: 130,
    },
    {
      id: "version",
      accessorFn: (row) => row.schemaVersion,
      header: "Version",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
          v{row.original.schemaVersion}
        </span>
      ),
      size: 80,
    },
    {
      id: "steps",
      accessorFn: (row) => row.steps.length,
      header: "Steps",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.steps.length}</span>
      ),
      size: 70,
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
          {STATUS_LABELS[row.original.status]}
        </Badge>
      ),
      size: 90,
    },
    {
      id: "updatedAt",
      accessorFn: (row) => row.updatedAt,
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString("id-ID")}
        </span>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell row={row} {...opts} />,
      size: 120,
      enableSorting: false,
    },
  ];
}
