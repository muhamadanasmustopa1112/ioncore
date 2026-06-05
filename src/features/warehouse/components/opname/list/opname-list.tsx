"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Filter, Loader2, Search, X } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useInfiniteOpnames,
  useOpnames,
} from "@/features/warehouse/api/get-opnames";
import { toStockOpnames } from "@/features/warehouse/types/opnames";
import { useOpnameColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { MobileOpnameHeader } from "./mobile-opname-header";
import { OpnameMobileCard } from "./opname-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";
import type { StockOpname } from "@/features/warehouse/types";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

const WAREHOUSE_FILTER_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const STATUS_FILTER_OPTIONS = [
  "scheduled",
  "in_progress",
  "completed",
  "adjusted",
] as const;

export function OpnameList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openOpnameFormSheet, setSelectedOpname } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
    warehouse_id: parseAsInteger,
    status: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useOpnameColumns();

  const listParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      search: filter.search || undefined,
      warehouse_id: filter.warehouse_id ?? undefined,
      status: filter.status || undefined,
    }),
    [
      filter.page,
      filter.limit,
      filter.search,
      filter.warehouse_id,
      filter.status,
    ]
  );

  const {
    data: opnamesResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useOpnames({
    params: listParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteOpnames({
    limit: MOBILE_PAGE_SIZE,
    search: filter.search || undefined,
    warehouse_id: filter.warehouse_id ?? undefined,
    status: filter.status || undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = useMemo(
    () => toStockOpnames(opnamesResponse?.data ?? []),
    [opnamesResponse]
  );
  const metadata = opnamesResponse?.metadata;

  const mobileDataAll = useMemo(
    () =>
      toStockOpnames(infiniteData?.pages.flatMap((page) => page.data) ?? []),
    [infiniteData]
  );

  const mobileTotalCount =
    infiniteData?.pages[0]?.metadata.total_data ?? mobileDataAll.length;

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: tableData,
    pageCount: metadata?.total_page ?? 0,
    getRowId: (row: StockOpname) => String(row.id),
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > SCROLL_THRESHOLD) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleMobileDetail = useCallback(
    (item: StockOpname) => {
      setSelectedOpname(item);
      openOpnameFormSheet("details");
    },
    [setSelectedOpname, openOpnameFormSheet]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilter({ search: value || null, page: 1 });
    },
    [setFilter]
  );

  const handleStatusChange = useCallback(
    (status: string | null) => {
      setFilter({ status: status || null, page: 1 });
    },
    [setFilter]
  );

  const clearFilters = useCallback(() => {
    setFilter({
      search: null,
      status: null,
      warehouse_id: null,
      page: 1,
    });
  }, [setFilter]);

  const hasActiveFilters =
    !!filter.search || !!filter.status || filter.warehouse_id != null;

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  const searchInput = (
    <div className="relative">
      <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        placeholder={t("warehouse.searchOpname", "Search opname...")}
        value={filter.search || ""}
        onChange={(e) => handleSearchChange(e.target.value)}
        className={isMobile ? "w-full ps-9" : "w-64 ps-9"}
      />
      {filter.search && (
        <Button
          mode="icon"
          variant="ghost"
          className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={() => handleSearchChange("")}
        >
          <X />
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="mt-2 space-y-3 overflow-hidden">
        <MobileOpnameHeader
          items={mobileDataAll}
          selectedStatus={filter.status ?? null}
          onStatusChange={handleStatusChange}
        />

        {searchInput}

        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {mobileTotalCount} {t("common.items", "items")}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] font-semibold text-muted-foreground px-2"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[calc(100vh-420px)] overflow-y-auto space-y-3 pr-1"
        >
          {mobileDataAll.map((item) => (
            <OpnameMobileCard
              key={item.id}
              item={item}
              onDetail={handleMobileDetail}
            />
          ))}

          {mobileDataAll.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noOpnames", "No opnames found")}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!hasNextPage && mobileDataAll.length > 0 && (
            <div className="text-center py-3 text-[11px] text-muted-foreground">
              {t("common.endOfList", "End of list")} • {mobileTotalCount}{" "}
              {t("common.items", "items")}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={metadata?.total_data ?? 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
      isLoading={isLoading || isDesktopFetching}
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CardHeading className="py-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    {t("common.filter")}
                  </Button>
                </CollapsibleTrigger>
                {searchInput}
              </div>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("warehouse.warehouseLabel", "Warehouse")}
                    </label>
                    <select
                      value={filter.warehouse_id ?? ""}
                      onChange={(e) =>
                        setFilter({
                          warehouse_id: e.target.value
                            ? Number(e.target.value)
                            : null,
                          page: 1,
                        })
                      }
                      className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="">
                        {t("warehouse.allWarehouses", "All warehouses")}
                      </option>
                      {WAREHOUSE_FILTER_OPTIONS.map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("common.status", "Status")}
                    </label>
                    <select
                      value={filter.status || ""}
                      onChange={(e) =>
                        setFilter({
                          status: e.target.value || null,
                          page: 1,
                        })
                      }
                      className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="">
                        {t("warehouse.allStatuses", "All statuses")}
                      </option>
                      {STATUS_FILTER_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
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
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
