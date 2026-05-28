"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type RowSelectionState, useReactTable } from "@tanstack/react-table";
import { Filter, Search, X } from "lucide-react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DUMMY_TRANSFERS } from "@/features/warehouse/data/dummy-subfeatures";
import { useTransferColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { StockTransfer } from "@/features/warehouse/types";

export function TransfersList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useTransferColumns();
  const [isLoading] = useState(false);

  const filteredData = useMemo(() => {
    if (!filter.search) return DUMMY_TRANSFERS;
    const searchLower = filter.search.toLowerCase();
    return DUMMY_TRANSFERS.filter((item) => item.sourceWarehouseName.toLowerCase().includes(searchLower) || item.destinationWarehouseName.toLowerCase().includes(searchLower) || item.initiatedByName.toLowerCase().includes(searchLower));
  }, [filter.search]);

  const data = useMemo(() => {
    const start = (filter.page - 1) * filter.limit;
    return filteredData.slice(start, start + filter.limit);
  }, [filteredData, filter.page, filter.limit]);

  const metadata = useMemo(() => ({ total_data: filteredData.length, total_page: Math.ceil(filteredData.length / filter.limit) }), [filteredData, filter.limit]);

  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns, data, pageCount: metadata.total_page,
    getRowId: (row: StockTransfer) => String(row.id),
    state: { pagination: { pageIndex: filter.page - 1, pageSize: filter.limit }, columnOrder, rowSelection },
    onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", enableRowSelection: true, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), manualPagination: true,
  });

  return (
    <DataGrid table={table} recordCount={metadata.total_data} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }} isLoading={isLoading}>
      <Card className="mt-[10px]">
        <CardHeader>
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CardHeading className="py-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild><Button variant="outline"><Filter />{t("common.filter")}</Button></CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input placeholder={t("warehouse.searchTransfers", "Search transfers...")} value={filter.search || ""} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="w-64 ps-9" />
                  {filter.search && <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setFilter({ ...filter, search: "" })}><X /></Button>}
                </div>
              </div>
              <CollapsibleContent><div className="flex items-center gap-2 py-[5px] text-sm text-muted-foreground">{t("warehouse.noFilters", "No advanced filters defined yet.")}</div></CollapsibleContent>
            </CardHeading>
          </Collapsible>
          <DataTableToolbar />
        </CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination setFilter={setFilter} filter={filter} /></CardFooter>
      </Card>
    </DataGrid>
  );
}
