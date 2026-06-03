"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Project } from "../../../types/project";
import { useProjectStore } from "../../../store/project";
import { useDeleteProject } from "../../../api/delete-project";

const statusVariant: Record<string, { variant: "success" | "warning" | "info" | "destructive" | "secondary" }> = {
  planning: { variant: "secondary" },
  in_progress: { variant: "info" },
  on_hold: { variant: "warning" },
  completed: { variant: "success" },
  cancelled: { variant: "destructive" },
};

const healthVariant: Record<string, { variant: "success" | "warning" | "destructive" }> = {
  green: { variant: "success" },
  yellow: { variant: "warning" },
  red: { variant: "destructive" },
};

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

function ActionsCell({ row }: { row: Project }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedItem } = useProjectStore();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedItem(row); openFormSheet("details"); }}>
            <Eye className="size-4" /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedItem(row); openFormSheet("edit"); }}>
            <Pencil className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{row.project_name}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProject(row.id)} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function useProjectColumns(): ColumnDef<Project>[] {
  const { t } = useTranslation();

  return [
    {
      id: "project_name",
      accessorFn: (row) => row.project_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.projects.colProject", "Project")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.project_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.customer_name}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-40" /> },
      enableSorting: true,
      size: 250,
    },
    {
      id: "project_type",
      accessorFn: (row) => row.project_type,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.projects.colType", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.project_type.replace(/_/g, " ")}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
    {
      id: "contract_value",
      accessorFn: (row) => row.contract_value,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.projects.colValue", "Contract Value")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm font-medium">{idr(row.original.contract_value)}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "s_curve_health",
      accessorFn: (row) => row.s_curve_health,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.projects.colHealth", "S-Curve")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => {
        const h = row.original.s_curve_health;
        return (
          <Badge variant={healthVariant[h]?.variant ?? "secondary"} appearance="light" className="text-[10px] font-semibold uppercase">
            {h}
          </Badge>
        );
      },
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 90,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]?.variant ?? "secondary"} appearance="light" className="text-[10px] font-semibold uppercase">
          {row.original.status.replace(/_/g, " ")}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.actions", "Actions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <ActionsCell row={row.original} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ];
}
