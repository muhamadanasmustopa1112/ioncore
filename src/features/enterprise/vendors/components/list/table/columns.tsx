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
import type { Vendor } from "../../../types/vendor";
import { useVendorStore } from "../../../store/vendor";
import { useDeleteVendor } from "../../../api/delete-vendor";

function ActionsCell({ row }: { row: Vendor }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedItem } = useVendorStore();
  const { mutate: deleteVendor, isPending: isDeleting } = useDeleteVendor();

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
              This will permanently delete &ldquo;{row.company_name}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVendor(row.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function useVendorColumns(): ColumnDef<Vendor>[] {
  const { t } = useTranslation();

  return [
    {
      id: "company_name",
      accessorFn: (row) => row.company_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.vendors.colCompany", "Company")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.company_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.contact_person}</div>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "service_categories",
      accessorFn: (row) => row.service_categories.join(", "),
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.vendors.colCategories", "Categories")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.service_categories.map((cat) => (
            <Badge key={cat} variant="secondary" appearance="light" className="text-[10px] font-semibold px-1.5">
              {cat}
            </Badge>
          ))}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: false,
      size: 180,
    },
    {
      id: "payment_terms",
      accessorFn: (row) => row.payment_terms,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.vendors.colPaymentTerms", "Payment Terms")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.payment_terms.toUpperCase()}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: false,
      size: 100,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "success" : "secondary"}
          appearance="light"
          className="text-[10px] font-semibold uppercase"
        >
          {row.original.status}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 90,
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
