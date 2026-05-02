"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { BroadbandPlan, BroadbandCustomerType } from "../../types/products";

const customerTypeBadge: Record<BroadbandCustomerType, { label: string; className: string }> = {
  broadband: { label: "Broadband", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  business:  { label: "Business",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  both:      { label: "Both",      className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
};

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

interface ActionsProps {
  row: BroadbandPlan;
  onEdit: (row: BroadbandPlan) => void;
  onDetail: (row: BroadbandPlan) => void;
  onDelete: (id: string) => void;
}

function ActionsCell({ row, onEdit, onDetail, onDelete }: ActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button mode="icon" variant="ghost" size="sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDetail(row)}>
          <Eye className="size-4 mr-2" /> Detail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(row)}>
          <Pencil className="size-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row.id)}>
          <Trash2 className="size-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getPlanColumns(
  onEdit: (row: BroadbandPlan) => void,
  onDetail: (row: BroadbandPlan) => void,
  onDelete: (id: string) => void,
): ColumnDef<BroadbandPlan>[] {
  return [
    {
      id: "name",
      accessorFn: (r) => r.name,
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      size: 200,
    },
    {
      id: "speed",
      header: ({ column }) => <DataGridColumnHeader title="Speed" column={column} className="font-semibold" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          ↓ {row.original.speed_download_mbps} / ↑ {row.original.speed_upload_mbps} Mbps
        </span>
      ),
      size: 180,
    },
    {
      id: "price",
      accessorFn: (r) => r.price,
      header: ({ column }) => <DataGridColumnHeader title="Price / mo" column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.price)}</span>,
      size: 150,
    },
    {
      id: "one_time_charge",
      accessorFn: (r) => r.one_time_charge,
      header: ({ column }) => <DataGridColumnHeader title="OTC" column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.one_time_charge)}</span>,
      size: 150,
    },
    {
      id: "customer_type",
      accessorFn: (r) => r.customer_type,
      header: ({ column }) => <DataGridColumnHeader title="Customer Type" column={column} className="font-semibold" />,
      cell: ({ row }) => {
        const cfg = customerTypeBadge[row.original.customer_type] ?? customerTypeBadge.broadband;
        return <span className={cfg.className}>{cfg.label}</span>;
      },
      size: 130,
    },
    {
      id: "is_active",
      accessorFn: (r) => r.is_active,
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
      size: 75,
      enableSorting: false,
    },
  ];
}
