"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardTable, CardFooter, CardHeader } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { paths } from "@/config/paths";
import type { WorkOrderDashboardItem, Metadata, WorkOrderState, WorkOrderType } from "../../types/technician-api";
import { columns as columnsDef } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

interface Props {
  items: WorkOrderDashboardItem[];
  metadata: Metadata | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange?: (limit: number) => void;
}

// Duplicate styles for mobile view fallback
const STATE_STYLES: Record<WorkOrderState, string> = {
  created: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  unassigned: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900",
  assigned: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  accepted: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900",
  dispatched: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-900",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  pending_noc_verification: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900",
  rescheduled: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900",
};

const STATE_LABELS: Record<WorkOrderState, string> = {
  created: "Created",
  unassigned: "Unassigned",
  assigned: "Assigned",
  accepted: "Accepted",
  dispatched: "Dispatched",
  in_progress: "In Progress",
  pending_noc_verification: "Pending NOC",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const TYPE_LABELS: Record<WorkOrderType, string> = {
  new_installation_broadband: "New Install (Broadband)",
  new_installation_enterprise: "New Install (Enterprise)",
  maintenance: "Maintenance",
  termination: "Termination",
};

export function WorkOrdersTable({
  items,
  metadata,
  isLoading,
  page,
  onPageChange,
  perPage,
  onPerPageChange,
}: Props) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useMemo(() => columnsDef, []);
  const totalData = metadata?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalData / perPage));

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: items,
    pageCount: totalPages,
    getRowId: (row: WorkOrderDashboardItem) => String(row.id),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  // Adapt local filter shape for DataGridPagination expected interface
  const mockFilter = { page, limit: perPage };
  const mockSetFilter = (updater: any) => {
    const next = typeof updater === "function" ? updater(mockFilter) : updater;
    if (next.page !== page) {
      onPageChange(next.page);
    }
    if (next.limit !== perPage && onPerPageChange) {
      onPerPageChange(next.limit);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile List View Fallback (Retained existing layout for mobile utility) */}
      <div className="md:hidden bg-white dark:bg-slate-900 rounded shadow-sm border border-outline overflow-hidden divide-y divide-outline">
        {isLoading ? (
          <div className="px-4 py-12 text-center">
            <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-12 text-center text-slate-400 text-sm">
            No work orders found.
          </div>
        ) : (
          items.map((order) => {
            const engineers = order.assigned_team
              ?.map((t) => t.technician_name)
              .filter(Boolean)
              .join(" & ") || "—";

            return (
              <Link
                key={order.id}
                href={paths.dashboard.technician.detail.getHref(order.id)}
                className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                    {order.number}
                  </span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${STATE_STYLES[order.state] ?? ""}`}>
                    {STATE_LABELS[order.state] ?? order.state}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 line-clamp-1">
                  {order.title || "—"}
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  {TYPE_LABELS[order.type] ?? order.type}
                </p>
                <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="text-blue-500 size-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{order.site_name || "—"}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Standardized Desktop DataGrid */}
      <div className="hidden md:block">
        <DataGrid
          table={table}
          recordCount={totalData}
          tableLayout={{
            columnsPinnable: true,
            columnsMovable: true,
            columnsVisibility: true,
            columnsResizable: true,
            cellBorder: true,
          }}
          isLoading={isLoading}
        >
          <Card>
            <CardHeader>
              <DataTableToolbar />
            </CardHeader>
            <CardTable className="px-0">
              <ScrollArea>
                <DataGridContainer className="w-full min-h-[400px]">
                  <DataGridTable />
                </DataGridContainer>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
            <CardFooter className="p-2 border-t border-outline bg-muted/20">
              <DataGridPagination setFilter={mockSetFilter} filter={mockFilter} />
            </CardFooter>
          </Card>
        </DataGrid>
      </div>
    </div>
  );
}
