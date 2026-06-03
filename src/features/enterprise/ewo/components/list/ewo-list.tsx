"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
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
import { useEwos } from "../../api/get-ewos";
import { useEwoColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import type { EwoStatus, EwoType, EwoPriority } from "../../types/ewo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EwoList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
    status: parseAsString,
    ewo_type: parseAsString,
    priority: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useEwoColumns();

  const params = useMemo(() => ({
    page: filter.page,
    per_page: filter.limit,
    search: filter.search || undefined,
    status: (filter.status as EwoStatus) || undefined,
    ewo_type: (filter.ewo_type as EwoType) || undefined,
    priority: (filter.priority as EwoPriority) || undefined,
  }), [filter]);

  const { data: ewoData, isLoading, isFetching } = useEwos(params);

  const data = useMemo(() => ewoData?.ewos ?? [], [ewoData]);
  const total = ewoData?.metadata?.total ?? 0;

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

  const hasActiveFilters = filter.status || filter.ewo_type || filter.priority;

  return (
    <DataGrid table={table} recordCount={total} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }} isLoading={isLoading || isFetching}>
      <Card className="mt-[10px]">
        <CardHeader>
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CardHeading className="py-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline"><Filter />{t("common.filter", "Filter")}{hasActiveFilters ? ` (1)` : ""}</Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder={t("enterprise.ewo.searchPlaceholder", "Search EWOs...")}
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
              <CollapsibleContent>
                <div className="flex flex-wrap items-center gap-2 py-2">
                  <Select value={filter.status || ""} onValueChange={(v) => setFilter({ status: v || null, page: 1 })}>
                    <SelectTrigger className="w-40"><SelectValue placeholder={t("common.status", "Status")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("common.all", "All")}</SelectItem>
                      <SelectItem value="draft">{t("enterprise.ewo.status.draft", "Draft")}</SelectItem>
                      <SelectItem value="assigned">{t("enterprise.ewo.status.assigned", "Assigned")}</SelectItem>
                      <SelectItem value="in_progress">{t("enterprise.ewo.status.inProgress", "In Progress")}</SelectItem>
                      <SelectItem value="completed">{t("enterprise.ewo.status.completed", "Completed")}</SelectItem>
                      <SelectItem value="closed">{t("enterprise.ewo.status.closed", "Closed")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filter.ewo_type || ""} onValueChange={(v) => setFilter({ ewo_type: v || null, page: 1 })}>
                    <SelectTrigger className="w-32"><SelectValue placeholder={t("enterprise.ewo.colType", "Type")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("common.all", "All")}</SelectItem>
                      <SelectItem value="ewo_x">EWO-X</SelectItem>
                      <SelectItem value="ewo_y">EWO-Y</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filter.priority || ""} onValueChange={(v) => setFilter({ priority: v || null, page: 1 })}>
                    <SelectTrigger className="w-36"><SelectValue placeholder={t("enterprise.ewo.colPriority", "Priority")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("common.all", "All")}</SelectItem>
                      <SelectItem value="low">{t("enterprise.ewo.priority.low", "Low")}</SelectItem>
                      <SelectItem value="medium">{t("enterprise.ewo.priority.medium", "Medium")}</SelectItem>
                      <SelectItem value="high">{t("enterprise.ewo.priority.high", "High")}</SelectItem>
                      <SelectItem value="critical">{t("enterprise.ewo.priority.critical", "Critical")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={() => setFilter({ status: null, ewo_type: null, priority: null, page: 1 })}>
                      {t("common.clearFilters", "Clear")}
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </CardHeading>
          </Collapsible>
          <DataTableToolbar />
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
