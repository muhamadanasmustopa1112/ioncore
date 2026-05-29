"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useBulkOperationColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { DUMMY_BULK_OPERATIONS } from "../../data/dummy-bulk-operations";
import type { BulkOperationItem } from "../../types";

export function BulkOperationList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useBulkOperationColumns();

  const data = useMemo(() => {
    let filtered = [...DUMMY_BULK_OPERATIONS];
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (op) =>
          op.description.toLowerCase().includes(searchLower) ||
          op.scope.toLowerCase().includes(searchLower)
      );
    }
    return filtered.slice((filter.page - 1) * filter.limit, filter.page * filter.limit);
  }, [filter]);

  const metadata = useMemo(
    () => ({
      total_data: DUMMY_BULK_OPERATIONS.length,
      total_page: Math.ceil(DUMMY_BULK_OPERATIONS.length / filter.limit),
    }),
    [filter.limit]
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data,
    pageCount: metadata.total_page,
    getRowId: (row: BulkOperationItem) => String(row.id),
    state: {
      pagination: { pageIndex: filter.page - 1, pageSize: filter.limit },
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={metadata.total_data}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
    >
      <Card className="mt-2">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder={t(
                    "bulkOperations.searchPlaceholder",
                    "Search operations..."
                  )}
                  value={filter.search || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className="w-64 ps-9"
                />
                {filter.search && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                    onClick={() => setFilter({ ...filter, search: "" })}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>
          <DataTableToolbar />
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridContainer className="w-full min-w-[900px]">
              <DataGridTable />
            </DataGridContainer>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
