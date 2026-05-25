"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Addon, AddonType } from "../../types/products";

const typeBadge: Record<AddonType, { label: string; className: string }> = {
  digital:  { label: "Digital",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  physical: { label: "Physical", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  service:  { label: "Service",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

function ActionsCell({ row, onEdit, onDetail, onDelete }: { row: Addon; onEdit: (r: Addon) => void; onDetail: (r: Addon) => void; onDelete: (id: string) => void }) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm"><MoreHorizontal className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDetail(row)}><Eye className="size-4 mr-2" /> {t("administration.productsPage.actionDetail")}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row)}><Pencil className="size-4 mr-2" /> {t("administration.productsPage.actionEdit")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirmOpen(true)}><Trash2 className="size-4 mr-2" /> {t("administration.productsPage.actionDelete")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.productsPage.confirmDeleteAddonTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{row.name}&rdquo; {t("administration.productsPage.confirmDeletePlanDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("administration.productsPage.confirmCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(row.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("administration.productsPage.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function useAddonColumns(
  onEdit: (r: Addon) => void,
  onDetail: (r: Addon) => void,
  onDelete: (id: string) => void,
): ColumnDef<Addon>[] {
  const { t } = useTranslation();
  return [
    {
      id: "name", accessorFn: (r) => r.name,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colName")} column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      size: 200,
    },
    {
      id: "type", accessorFn: (r) => r.type,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colType")} column={column} className="font-semibold" />,
      cell: ({ row }) => { const cfg = typeBadge[row.original.type]; return <span className={cfg.className}>{cfg.label}</span>; },
      size: 110,
    },
    {
      id: "price", accessorFn: (r) => r.price,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colPrice")} column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.price)}</span>,
      size: 150,
    },
    {
      id: "one_time_charge", accessorFn: (r) => r.one_time_charge,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colOTC")} column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.one_time_charge)}</span>,
      size: 150,
    },
    {
      id: "is_wo_required", accessorFn: (r) => r.is_wo_required,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colWORequired")} column={column} className="font-semibold" />,
      cell: ({ row }) => row.original.is_wo_required
        ? <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{t("administration.productsPage.woYes")}</span>
        : <span className="text-muted-foreground/50 text-xs">{t("administration.productsPage.woNo")}</span>,
      size: 110,
    },
    {
      id: "is_active", accessorFn: (r) => r.is_active,
      header: ({ column }) => <DataGridColumnHeader title={t("administration.productsPage.colStatus")} column={column} className="font-semibold" />,
      cell: ({ row }) => row.original.is_active
        ? <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{t("administration.productsPage.statusActive")}</span>
        : <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">{t("administration.productsPage.statusInactive")}</span>,
      size: 90,
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-foreground text-sm">{t("administration.productsPage.colActions")}</span>,
      cell: ({ row }) => <ActionsCell row={row.original} onEdit={onEdit} onDetail={onDetail} onDelete={onDelete} />,
      size: 75, enableSorting: false,
    },
  ];
}
