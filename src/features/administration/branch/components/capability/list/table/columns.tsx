"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CapabilityData } from "../../../../types/capability";
import { ActionsCell } from "./actions-cell";

export const getCapabilityColumns = (
  t: (key: string) => string,
): ColumnDef<CapabilityData>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.name")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-medium">{row.original.name}</span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.description")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => (
      <span
        className={
          row.original.description
            ? "text-foreground"
            : "text-muted-foreground/40"
        }
      >
        {row.original.description || "—"}
      </span>
    ),
    enableSorting: false,
    size: 240,
  },
  {
    id: "enabled_count",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.featuresEnabled")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const json = row.original.capabilityJson;
      const total = Object.keys(json).length;
      const enabled = Object.values(json).filter(Boolean).length;
      return (
        <span className="text-sm font-medium">
          <span className="text-emerald-600 dark:text-emerald-400">
            {enabled}
          </span>
          <span className="text-muted-foreground">/{total}</span>
        </span>
      );
    },
    enableSorting: false,
    size: 130,
  },
  {
    id: "capabilities",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.activeFeatures")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => {
      const json = row.original.capabilityJson;
      const active = Object.entries(json)
        .filter(([, v]) => v)
        .map(([k]) => k.replace(/_/g, " "));
      return active.length > 0 ? (
        <span className="text-foreground text-xs">
          {active.slice(0, 3).join(", ")}
          {active.length > 3 && (
            <span className="text-muted-foreground"> +{active.length - 3}</span>
          )}
        </span>
      ) : (
        <span className="text-muted-foreground/40 text-xs">
          {t("common.none")}
        </span>
      );
    },
    enableSorting: false,
    size: 220,
  },
  {
    id: "isActive",
    accessorFn: (row) => row.isActive,
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.status")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {t("administration.branch.capability.active")}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {t("administration.branch.capability.inactive")}
        </span>
      ),
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader
        title={t("administration.branch.capability.actions")}
        column={column}
        className="text-foreground font-semibold"
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 75,
  },
];

export const columns: ColumnDef<CapabilityData>[] = [];
