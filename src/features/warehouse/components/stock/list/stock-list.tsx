"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, Filter, Loader2, Search, X } from "lucide-react";
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
import { paths } from "@/config/paths";
import {
  useInfiniteStockItems,
  useStockItems,
} from "@/features/warehouse/api/get-stock-items";
import { useThresholdDashboard } from "@/features/warehouse/api/get-threshold-dashboard";
import { REPORT_TABS } from "@/features/warehouse/components/reports/reports-tabs";
import { ThresholdDashboardKpi } from "@/features/warehouse/components/reports/threshold-dashboard/threshold-dashboard-kpi";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";
import { useStockColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { StockItemCategoryFilter } from "./stock-item-category-filter";
import { StockMobileCard } from "./stock-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;
const ALERTS_KPI_LIMIT = 50;

export function StockList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openStockFormSheet, setSelectedStockItem } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const columns = useStockColumns();

  const desktopParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      search: filter.search || undefined,
    }),
    [filter.page, filter.limit, filter.search]
  );

  const {
    data: stockItemsResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useStockItems({
    params: desktopParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteStockItems({
    limit: MOBILE_PAGE_SIZE,
    search: filter.search || undefined,
    queryConfig: { enabled: isMobile },
  });

  const { data: thresholdResponse } = useThresholdDashboard({
    params: { page: 1, limit: ALERTS_KPI_LIMIT },
  });

  const thresholdItems = thresholdResponse?.data ?? [];
  const thresholdTotal = thresholdResponse?.metadata.total_data ?? 0;

  const tableData = stockItemsResponse?.data ?? [];
  const metadata = stockItemsResponse?.metadata;

  const mobileDataAll = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.data) ?? [],
    [infiniteData]
  );

  const mobileTotalCount =
    infiniteData?.pages[0]?.metadata.total_data ?? mobileDataAll.length;

  const mobileData = useMemo(() => {
    if (!selectedCategory) return mobileDataAll;
    return mobileDataAll.filter(
      (item) => item.category_code === selectedCategory
    );
  }, [mobileDataAll, selectedCategory]);

  const filteredTableData = useMemo(() => {
    if (!selectedCategory) return tableData;
    return tableData.filter((item) => item.category_code === selectedCategory);
  }, [tableData, selectedCategory]);

  const categoryFilterItems = isMobile ? mobileDataAll : tableData;

  const alertsLink = `${paths.dashboard.warehouse.reports.root.getHref()}?tab=${REPORT_TABS.thresholdDashboard}`;

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: filteredTableData,
    pageCount: metadata?.total_page ?? 0,
    getRowId: (row: StockItemResponse) => String(row.id),
    state: {
      pagination: {
        pageIndex: filter.page - 1,
        pageSize: filter.limit,
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > SCROLL_THRESHOLD) {
      void fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleMobileDetail = useCallback(
    (item: StockItemResponse) => {
      setSelectedStockItem(item);
      openStockFormSheet("details");
    },
    [setSelectedStockItem, openStockFormSheet]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      void setFilter({ search: value || null, page: 1 });
      setSelectedCategory(null);
    },
    [setFilter]
  );

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const kpiSection = (
    <div className="space-y-3">
      <ThresholdDashboardKpi items={thresholdItems} totalCount={thresholdTotal} />
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" asChild>
          <Link href={alertsLink}>
            {t("warehouse.viewAllAlerts", "View all alerts")}
            <ArrowRight className="size-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </div>
  );

  const searchInput = (
    <div className="relative">
      <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        placeholder={t("warehouse.searchStock", "Search stock items...")}
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
        {kpiSection}

        <StockItemCategoryFilter
          items={categoryFilterItems}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {searchInput}

        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {mobileTotalCount} {t("common.items", "items")}
            {selectedCategory && (
              <span className="text-muted-foreground/60">
                {" "}
                in {selectedCategory}
              </span>
            )}
          </span>
          {(filter.search || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] font-semibold text-muted-foreground px-2"
              onClick={() => {
                handleSearchChange("");
                handleCategoryChange(null);
              }}
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
          {mobileData.map((item) => (
            <StockMobileCard
              key={item.id}
              item={item}
              onDetail={handleMobileDetail}
            />
          ))}

          {mobileData.length === 0 && !isMobileLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noStockItems", "No stock items found")}
            </div>
          )}

          {isMobileLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!hasNextPage && mobileData.length > 0 && (
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
    <div className="space-y-4">
      {kpiSection}

      <StockItemCategoryFilter
        items={categoryFilterItems}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

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
        isLoading={isDesktopLoading || isDesktopFetching}
      >
        <Card className="mt-[10px]">
          <CardHeader>
            <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
              <CardHeading className="py-4">
                <div className="flex items-center gap-2">
                  <div>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline">
                        <Filter />
                        {t("common.filter")}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  {searchInput}
                </div>
                <CollapsibleContent>
                  <div className="flex items-center gap-2 py-[5px] text-sm text-muted-foreground">
                    {t("warehouse.noFilters", "No advanced filters defined yet.")}
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
    </div>
  );
}
