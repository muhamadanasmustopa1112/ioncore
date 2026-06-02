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
import type { Reseller } from "../../../types/reseller";
import { useResellerStore } from "../../../store/reseller";

function ActionsCell({ row }: { row: Reseller }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedItem } = useResellerStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedItem(row);
              openFormSheet("details");
            }}
          >
            <Eye className="size-4" /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedItem(row);
              openFormSheet("edit");
            }}
          >
            <Pencil className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{row.legal_name}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setShowDeleteDialog(false)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatusBadge({ status }: { status: Reseller["status"] }) {
  const variant = status === "active" ? "success" : status === "draft" ? "secondary" : status === "suspended" ? "warning" : "destructive";
  return (
    <Badge variant={variant} appearance="light" className="text-[10px] font-semibold uppercase">
      {status}
    </Badge>
  );
}

export function useResellerColumns(): ColumnDef<Reseller>[] {
  const { t } = useTranslation();

  return [
    {
      id: "legal_name",
      accessorFn: (row) => row.legal_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.resellers.colName", "Reseller")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.legal_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.contact_person}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 220,
    },
    {
      id: "parent_sister_company_name",
      accessorFn: (row) => row.parent_sister_company_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.resellers.colSponsor", "Sponsor Company")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.parent_sister_company_name}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "contact_person",
      accessorFn: (row) => row.contact_person,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.resellers.colContact", "Contact")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-sm">{row.original.contact_person}</div>
          <div className="text-xs text-muted-foreground">{row.original.phone}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
