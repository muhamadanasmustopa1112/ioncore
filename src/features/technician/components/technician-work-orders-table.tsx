"use client";
import { useMemo } from "react";
import Link from "next/link";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer, useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { paths } from "@/config/paths";
import type { WorkOrderDashboardItem, WorkOrderState, WorkOrderType } from "../types/technician-api";

const STATE_VARIANT: Record<WorkOrderState, "primary" | "success" | "warning" | "destructive" | "secondary" | "info"> = {
  created:                    "secondary",
  unassigned:                 "warning",
  assigned:                   "info",
  accepted:                   "primary",
  dispatched:                 "primary",
  in_progress:                "info",
  pending_noc_verification:   "warning",
  completed:                  "success",
  rescheduled:                "warning",
  cancelled:                  "destructive",
};

const STATE_LABELS: Record<WorkOrderState, string> = {
  created:                  "Created",
  unassigned:               "Unassigned",
  assigned:                 "Assigned",
  accepted:                 "Accepted",
  dispatched:               "Dispatched",
  in_progress:              "In Progress",
  pending_noc_verification: "Pending NOC",
  completed:                "Completed",
  rescheduled:              "Rescheduled",
  cancelled:                "Cancelled",
};

const TYPE_LABELS: Record<WorkOrderType, string> = {
  new_installation_broadband:  "New Install (Broadband)",
  new_installation_enterprise: "New Install (Enterprise)",
  maintenance:                 "Maintenance",
  termination:                 "Termination",
};

function ViewToggle() {
  const { table } = useDataGrid();
  return (
    <DataGridColumnVisibility
      table={table}
      trigger={
        <Button variant="outline">
          View
        </Button>
      }
    />
  );
}

interface Props {
  items: WorkOrderDashboardItem[];
  total: number;
  isLoading: boolean;
  page: number;
  perPage: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function TechnicianWorkOrdersTable({
  items,
  total,
  isLoading,
  page,
  perPage,
  pageSizeOptions = [10, 15, 25, 50],
  onPageChange,
  onPerPageChange,
}: Props) {
  const columns = useMemo<ColumnDef<WorkOrderDashboardItem>[]>(() => [
    {
      id: "number",
      accessorKey: "number",
      header: ({ column }) => <DataGridColumnHeader column={column} title="WO Number" className="font-semibold" />,
      cell: ({ row }) => (
        <Button asChild variant="ghost" mode="link" size="sm" className="font-mono font-semibold text-primary">
          <Link href={paths.dashboard.technician.detail.getHref(row.original.id)}>
            {row.original.number}
          </Link>
        </Button>
      ),
      size: 160,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Title" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-foreground max-w-[200px] truncate block">{row.original.title || "—"}</span>
      ),
      size: 220,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Type" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{TYPE_LABELS[row.original.type] ?? row.original.type}</span>
      ),
      size: 190,
    },
    {
      id: "site_name",
      accessorKey: "site_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Location" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm truncate max-w-[220px] block">{row.original.site_name || "—"}</span>
      ),
      size: 220,
    },
    {
      id: "assigned_team",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Engineer" className="font-semibold" />,
      accessorFn: (row) =>
        row.assigned_team?.map((t) => t.technician_name).filter(Boolean).join(", ") || "",
      cell: ({ row }) => {
        const engineers = row.original.assigned_team
          ?.map((t) => t.technician_name)
          .filter(Boolean)
          .join(", ") || "—";
        return <span className="text-muted-foreground text-sm">{engineers}</span>;
      },
      size: 180,
    },
    {
      id: "state",
      accessorKey: "state",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Status" className="font-semibold" />,
      cell: ({ row }) => (
        <Badge variant={STATE_VARIANT[row.original.state] ?? "secondary"} appearance="light" size="md">
          {STATE_LABELS[row.original.state] ?? row.original.state}
        </Badge>
      ),
      size: 130,
    },
    {
      id: "actions",
      header: () => <span className="text-[0.8125rem] font-semibold text-accent-foreground">Action</span>,
      cell: ({ row }) => (
        <Button asChild variant="ghost" mode="link" size="sm">
          <Link href={paths.dashboard.technician.detail.getHref(row.original.id)}>
            Detail
          </Link>
        </Button>
      ),
      size: 80,
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    columns,
    data: items,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
    rowCount: total,
    manualPagination: true,
    getRowId: (row) => row.id,
    state: {
      pagination: { pageIndex: page - 1, pageSize: perPage },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: page - 1, pageSize: perPage })
        : updater;
      if (next.pageSize !== perPage) {
        onPerPageChange(next.pageSize);
      } else {
        onPageChange(next.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      isLoading={isLoading}
      recordCount={total}
      >
      <DataGridContainer>
        <Card>
          <CardHeader>
            <CardHeading>
              <span className="text-sm font-semibold text-muted-foreground">
                {total} work order{total !== 1 ? "s" : ""}
              </span>
            </CardHeading>
            <ViewToggle />
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination sizes={pageSizeOptions} />
          </CardFooter>
        </Card>
      </DataGridContainer>
    </DataGrid>
  );
}
