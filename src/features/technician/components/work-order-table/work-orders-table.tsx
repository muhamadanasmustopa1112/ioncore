"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useWorkOrderColumns, STATE_STYLES, STATE_I18N_KEY, TYPE_I18N_KEY } from "./columns";
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

export function WorkOrdersTable({
  items,
  metadata,
  isLoading,
  page,
  onPageChange,
  perPage,
  onPerPageChange,
}: Props) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useWorkOrderColumns();
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
            {t("workOrder.noWorkOrders")}
          </div>
        ) : (
          items.map((order) => {
            const engineers = order.assigned_team
              ?.map((tm) => tm.technician_name)
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
                    {t(STATE_I18N_KEY[order.state]) ?? order.state}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 line-clamp-1">
                  {order.title || "—"}
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  {t(TYPE_I18N_KEY[order.type]) ?? order.type}
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
