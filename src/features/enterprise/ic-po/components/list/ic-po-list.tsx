"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIcPos } from "../../api/get-ic-pos";
import { useIcPoColumns } from "./table/columns";

export function IcPoList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useIcPoColumns();

  const params = useMemo(() => ({
    page: filter.page,
    per_page: filter.limit,
    search: filter.search || undefined,
  }), [filter]);

  const { data: icPoData, isLoading, isFetching } = useIcPos(params);

  const data = useMemo(() => icPoData?.items ?? [], [icPoData]);
  const total = icPoData?.metadata?.total ?? 0;

  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data,
    pageCount: Math.ceil(total / filter.limit),
    getRowId: (row) => row.id,
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <DataGrid table={table} recordCount={total} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }} isLoading={isLoading || isFetching}>
      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder={t("enterprise.icPo.searchPlaceholder", "Search IC-POs...")}
                  value={filter.search || ""}
                  onChange={(e) => setFilter({ search: e.target.value || null, page: 1 })}
                  className="w-64 ps-9"
                />
                {filter.search && (
                  <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setFilter({ search: null })}>
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridContainer className="w-full">
              <DataGridTable />
            </DataGridContainer>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination
            filter={{ page: filter.page, limit: filter.limit }}
            setFilter={(updater: (prev: { page: number; limit: number }) => { page: number; limit: number }) => {
              const next = updater({ page: filter.page, limit: filter.limit });
              setFilter({ page: next.page, limit: next.limit });
            }}
          />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
