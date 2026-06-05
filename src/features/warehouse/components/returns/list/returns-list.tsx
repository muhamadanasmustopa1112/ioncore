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
import { Filter, Loader2 } from "lucide-react";
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
  useInfiniteReturns,
  useReturns,
} from "@/features/warehouse/api/get-returns";
import {
  toDeviceReturnRecord,
  type ReturnsListItem,
} from "@/features/warehouse/types/returns";
import { useReturnColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ReturnsMobileCard } from "./returns-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

const WAREHOUSE_FILTER_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const DISPOSITION_FILTER_OPTIONS = [
  "REFURBISH",
  "RESTOCK",
  "DECOMMISSION",
  "PENALTY",
] as const;

export function ReturnsList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openReturnFormSheet, setSelectedReturn } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    warehouse_id: parseAsInteger,
    disposition: parseAsString,
    asset_id: parseAsInteger,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useReturnColumns();

  const listParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      warehouse_id: filter.warehouse_id ?? undefined,
      disposition: filter.disposition || undefined,
      asset_id: filter.asset_id ?? undefined,
    }),
    [
      filter.page,
      filter.limit,
      filter.warehouse_id,
      filter.disposition,
      filter.asset_id,
    ]
  );

  const {
    data: returnsResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useReturns({
    params: listParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteReturns({
    limit: MOBILE_PAGE_SIZE,
    warehouse_id: filter.warehouse_id ?? undefined,
    disposition: filter.disposition || undefined,
    asset_id: filter.asset_id ?? undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = returnsResponse?.data ?? [];
  const metadata = returnsResponse?.metadata;

  const mobileDataAll = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.data) ?? [],
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
    getRowId: (row: ReturnsListItem) => String(row.id),
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
    (item: ReturnsListItem) => {
      setSelectedReturn(toDeviceReturnRecord(item));
      openReturnFormSheet("details");
    },
    [setSelectedReturn, openReturnFormSheet]
  );

  const clearFilters = useCallback(() => {
    setFilter({
      warehouse_id: null,
      disposition: null,
      asset_id: null,
      page: 1,
    });
  }, [setFilter]);

  const hasActiveFilters =
    filter.warehouse_id != null ||
    !!filter.disposition ||
    filter.asset_id != null;

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  if (isMobile) {
    return (
      <div className="mt-2 space-y-3 overflow-hidden">
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
            <ReturnsMobileCard
              key={item.id}
              item={item}
              onDetail={handleMobileDetail}
            />
          ))}

          {mobileDataAll.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noReturns", "No returns found")}
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
              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  <Filter />
                  {t("common.filter")}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3">
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
                      {t("warehouse.disposition", "Disposition")}
                    </label>
                    <select
                      value={filter.disposition || ""}
                      onChange={(e) =>
                        setFilter({
                          disposition: e.target.value || null,
                          page: 1,
                        })
                      }
                      className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="">
                        {t("warehouse.allDispositions", "All dispositions")}
                      </option>
                      {DISPOSITION_FILTER_OPTIONS.map((disposition) => (
                        <option key={disposition} value={disposition}>
                          {disposition}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("warehouse.assetId", "Asset ID")}
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={filter.asset_id ?? ""}
                      onChange={(e) =>
                        setFilter({
                          asset_id: e.target.value
                            ? Number(e.target.value)
                            : null,
                          page: 1,
                        })
                      }
                      placeholder="1"
                      className="text-xs h-9"
                    />
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
