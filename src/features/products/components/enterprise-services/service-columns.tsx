"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { EnterpriseService, EnterpriseCategory, EnterpriseDeliveryType, EnterprisePricingType } from "../../types/products";

const categoryBadge: Record<EnterpriseCategory, { label: string; className: string }> = {
  connectivity: { label: "Connectivity", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  security:     { label: "Security",     className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  entertainment:{ label: "Entertainment",className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  data_center:  { label: "Data Center",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  managed:      { label: "Managed",      className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  infrastructure:{ label: "Infrastructure", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const deliveryBadge: Record<EnterpriseDeliveryType, string> = {
  ion_direct:      "ION Direct",
  vendor_supplied: "Vendor",
  hybrid:          "Hybrid",
};

const pricingBadge: Record<EnterprisePricingType, string> = {
  fixed:       "Fixed",
  negotiated:  "Negotiated",
  vendor_quoted: "Vendor Quoted",
};

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

function ActionsCell({ row, onEdit, onDetail, onDelete }: { row: EnterpriseService; onEdit: (r: EnterpriseService) => void; onDetail: (r: EnterpriseService) => void; onDelete: (id: string) => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm"><MoreHorizontal className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDetail(row)}><Eye className="size-4 mr-2" /> Detail</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirmOpen(true)}><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enterprise Service?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{row.name}&rdquo; will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(row.id)}
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

export function getServiceColumns(
  onEdit: (r: EnterpriseService) => void,
  onDetail: (r: EnterpriseService) => void,
  onDelete: (id: string) => void,
): ColumnDef<EnterpriseService>[] {
  return [
    {
      id: "name", accessorFn: (r) => r.name,
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      size: 200,
    },
    {
      id: "category", accessorFn: (r) => r.category,
      header: ({ column }) => <DataGridColumnHeader title="Category" column={column} className="font-semibold" />,
      cell: ({ row }) => { const cfg = categoryBadge[row.original.category as EnterpriseCategory] ?? categoryBadge.managed; return <span className={cfg.className}>{cfg.label}</span>; },
      size: 130,
    },
    {
      id: "delivery_type", accessorFn: (r) => r.delivery_type,
      header: ({ column }) => <DataGridColumnHeader title="Delivery" column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="text-sm">{deliveryBadge[row.original.delivery_type as EnterpriseDeliveryType] ?? row.original.delivery_type}</span>,
      size: 120,
    },
    {
      id: "base_price", accessorFn: (r) => r.base_price,
      header: ({ column }) => <DataGridColumnHeader title="Base Price" column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.base_price)}</span>,
      size: 150,
    },
    {
      id: "pricing_type", accessorFn: (r) => r.pricing_type,
      header: ({ column }) => <DataGridColumnHeader title="Pricing" column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="text-sm">{pricingBadge[row.original.pricing_type as EnterprisePricingType] ?? row.original.pricing_type}</span>,
      size: 120,
    },
    {
      id: "is_wo_required", accessorFn: (r) => r.is_wo_required,
      header: ({ column }) => <DataGridColumnHeader title="WO Required" column={column} className="font-semibold" />,
      cell: ({ row }) => row.original.is_wo_required
        ? <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Yes</span>
        : <span className="text-muted-foreground/50 text-xs">No</span>,
      size: 110,
    },
    {
      id: "is_active", accessorFn: (r) => r.is_active,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} className="font-semibold" />,
      cell: ({ row }) => row.original.is_active
        ? <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span>
        : <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Inactive</span>,
      size: 90,
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-foreground text-sm">Actions</span>,
      cell: ({ row }) => <ActionsCell row={row.original} onEdit={onEdit} onDetail={onDetail} onDelete={onDelete} />,
      size: 75, enableSorting: false,
    },
  ];
}
