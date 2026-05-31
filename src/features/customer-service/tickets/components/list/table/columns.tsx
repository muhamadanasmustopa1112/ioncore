"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import {
  ticketTypeLabel,
  ticketTypeBadgeVariant,
  statusLabel,
  statusBadgeVariant,
  priorityBadgeVariant,
  channelLabel,
} from "../../../../types/ticket-labels";
import type { Ticket } from "../../../../types";

const TicketColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "ticket_number",
      accessorFn: (row: Ticket) => row.ticket_number,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.ticketNumber", "Ticket #")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.ticket_number}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 160,
    },
    {
      id: "subject",
      accessorFn: (row: Ticket) => row.subject,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.subject", "Subject")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[250px] cursor-pointer">{row.original.subject}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <p className="text-sm">{row.original.subject}</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-48" /> },
      enableSorting: true,
      size: 250,
    },
    {
      id: "customer_name",
      accessorFn: (row: Ticket) => row.customer_name ?? row.reporter_name ?? "N/A",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.customer", "Customer")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]">
          {row.original.customer_name ?? row.original.reporter_name ?? "Public Report"}
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "ticket_type",
      accessorFn: (row: Ticket) => row.ticket_type,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.type", "Type")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={ticketTypeBadgeVariant[row.original.ticket_type]}>
          {ticketTypeLabel[row.original.ticket_type]}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "priority",
      accessorFn: (row: Ticket) => row.priority,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.priority", "Priority")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={priorityBadgeVariant[row.original.priority]}>
          {row.original.priority}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-10 rounded-full" /> },
      enableSorting: true,
      size: 90,
    },
    {
      id: "status",
      accessorFn: (row: Ticket) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge className={statusBadgeVariant[row.original.status]}>
          {statusLabel[row.original.status]}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "channel",
      accessorFn: (row: Ticket) => row.channel,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.channel", "Channel")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{channelLabel[row.original.channel]}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 110,
    },
    {
      id: "created_at",
      accessorFn: (row: Ticket) => row.created_at,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("cs.createdAt", "Created")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.original.created_at), "dd MMM yyyy, HH:mm")}</div>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
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
  ] as ColumnDef<Ticket, unknown>[];
};

export const useTicketColumns = TicketColumns;
