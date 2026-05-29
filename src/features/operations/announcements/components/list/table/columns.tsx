"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { Announcement, AnnouncementPriority } from "../../../types";

const priorityBadgeClass: Record<AnnouncementPriority, string> = {
  normal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const priorityLabel: Record<AnnouncementPriority, string> = {
  normal: "Normal",
  urgent: "Urgent",
};

function truncateRoles(roles: string[]): string {
  if (roles.length === 0) return "—";
  if (roles.length <= 2) return roles.join(", ");
  return `${roles[0]}, ${roles[1]} +${roles.length - 2}`;
}

export const useAnnouncementColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "title",
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.title", "Title")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-medium text-foreground truncate max-w-[250px] cursor-pointer">{row.original.title}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <p className="text-sm">{row.original.title}</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-48" /> },
      enableSorting: true,
      size: 250,
    },
    {
      id: "priority",
      accessorFn: (row) => row.priority,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.priority", "Priority")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={priorityBadgeClass[row.original.priority]}>
          {priorityLabel[row.original.priority]}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "target_roles",
      accessorFn: (row) => row.target_roles,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.targetRoles", "Target Roles")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-muted-foreground text-sm truncate max-w-[180px] cursor-pointer">
              {truncateRoles(row.original.target_roles)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px]">
            <p className="text-sm">{row.original.target_roles.join(", ")}</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: false,
      size: 180,
    },
    {
      id: "created_at",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.createdAt", "Created")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.original.created_at), "dd MMM yyyy, HH:mm")}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "acknowledgment_progress",
      accessorFn: (row) => row.acknowledgment_summary,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.ackProgress", "Acknowledgment")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => {
        const { total_recipients, acknowledged_count } = row.original.acknowledgment_summary;
        const pct = total_recipients > 0 ? Math.round((acknowledged_count / total_recipients) * 100) : 0;
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={pct} className="h-2 w-16" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{pct}%</span>
          </div>
        );
      },
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: false,
      size: 140,
    },
    {
      id: "expires_at",
      accessorFn: (row) => row.expires_at,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("announcements.expiresAt", "Expires")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.original.expires_at), "dd MMM yyyy, HH:mm")}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.actions", "Actions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<Announcement>[];
};
