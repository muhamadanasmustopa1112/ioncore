"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { BranchData, BranchLevel, BranchType } from "../../../types";
import { ActionsCell } from "./data-table-actions-cell";

const typeConfig: Record<BranchType, { labelKey: string; className: string }> = {
  office:    { labelKey: "office",    className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  noc:       { labelKey: "noc",       className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  warehouse: { labelKey: "warehouse", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  hybrid:    { labelKey: "hybrid",    className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const levelConfig: Record<BranchLevel, { labelKey: string; className: string }> = {
  regional: { labelKey: "regional", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  area: { labelKey: "area", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  sub_area: { labelKey: "subArea", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

export const useBranchColumnTranslations = () => {
  const { t } = useTranslation();
  return {
    code: t("administration.branch.code"),
    branchName: t("administration.branch.branchName"),
    level: t("administration.branch.level"),
    type: t("administration.branch.type"),
    parentBranch: t("administration.branch.parentBranch"),
    polygon: t("administration.branch.polygon"),
    status: t("administration.branch.status"),
    actions: t("administration.branch.actions"),
    active: t("administration.branch.active"),
    inactive: t("administration.branch.inactive"),
    defined: t("administration.branch.defined"),
    none: t("administration.branch.none"),
  };
};

export const getBranchColumns = (
  t: ReturnType<typeof useTranslation>["t"]
): ColumnDef<BranchData>[] => [
  {
    id: "code",
    accessorFn: (row) => row.code,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.code")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {row.original.code}
      </span>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.branchName")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
    enableSorting: true,
    size: 220,
  },
  {
    id: "level",
    accessorFn: (row) => row.level,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.level")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const config = levelConfig[row.original.level];
      return <span className={config.className}>{t(`administration.branch.${config.labelKey}`)}</span>;
    },
    enableSorting: true,
    size: 110,
  },
  {
    id: "branchType",
    accessorFn: (row) => row.branchType,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.type")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => {
      const type = row.original.branchType;
      if (!type || !(type in typeConfig)) {
        return <span className="text-muted-foreground/40">—</span>;
      }
      const config = typeConfig[type as BranchType];
      return <span className={config.className}>{t(`administration.branch.${config.labelKey}`)}</span>;
    },
    enableSorting: true,
    size: 110,
  },
  {
    id: "parentName",
    accessorFn: (row) => row.parentName,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.parentBranch")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <span className={row.original.parentName ? "text-foreground" : "text-muted-foreground/40"}>
        {row.original.parentName ?? "—"}
      </span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "geographic_polygon",
    accessorFn: (row) => row.geographic_polygon,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.polygon")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.geographic_polygon ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
          {t("administration.branch.defined")}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          {t("administration.branch.none")}
        </span>
      ),
    enableSorting: false,
    size: 90,
  },
  {
    id: "active",
    accessorFn: (row) => row.active,
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.status")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) =>
      row.original.active ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {t("administration.branch.active")}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {t("administration.branch.inactive")}
        </span>
      ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title={t("administration.branch.actions")} column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];

export const columns: ColumnDef<BranchData>[] = [];