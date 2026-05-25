"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { CustomerType } from "../../types";
import { ActionsCell } from "./actions-cell";

export function useCustomerTypeColumns(
  onEdit: (row: CustomerType) => void,
  onDelete: (id: string) => void,
): ColumnDef<CustomerType>[] {
  const { t } = useTranslation();
  return [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("administration.customerTypesPage.colName")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.label}</p>
        </div>
      ),
      enableSorting: true,
      size: 240,
    },
    {
      id: "description",
      accessorFn: (row) => row.description,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("administration.customerTypesPage.colDescription")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.description || "—"}</span>
      ),
      enableSorting: false,
      size: 300,
    },
    {
      id: "is_active",
      accessorFn: (row) => row.is_active,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("administration.customerTypesPage.colStatus")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          row.original.is_active
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        }`}>
          {row.original.is_active ? t("administration.customerTypesPage.statusActive") : t("administration.customerTypesPage.statusInactive")}
        </span>
      ),
      enableSorting: true,
      size: 100,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("administration.customerTypesPage.colActions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />,
      enableSorting: false,
      size: 75,
    },
  ];
}
