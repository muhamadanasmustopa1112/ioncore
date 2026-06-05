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
import { DUMMY_STOCK_LEVELS } from "@/features/warehouse/data/dummy-subfeatures";
import { useStockColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { MobileStockHeader } from "./mobile-stock-header";
import { StockMobileCard } from "./stock-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";
import { StockLevel } from "@/features/warehouse/types";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

export function StockList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openStockFormSheet, setSelectedStock } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const columns = useStockColumns();

  const [isLoading] = useState(false);

  const filteredData = useMemo(() => {
    let result = DUMMY_STOCK_LEVELS;

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.stockItemName.toLowerCase().includes(searchLower) ||
          item.stockItemSku.toLowerCase().includes(searchLower) ||
          item.warehouseName.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (item) => item.stockItemCategory === selectedCategory
      );
    }

    return result;
  }, [filter.search, selectedCategory]);

  const data = useMemo(() => {
    const start = (filter.page - 1) * filter.limit;
    const end = start + filter.limit;
    return filteredData.slice(start, end);
  }, [filteredData, filter.page, filter.limit]);

  const metadata = useMemo(
    () => ({
      total_data: filteredData.length,
      total_page: Math.ceil(filteredData.length / filter.limit),
    }),
    [filteredData, filter.limit]
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data,
    pageCount: metadata.total_page,
    getRowId: (row: StockLevel) => String(row.id),
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

  // Mobile infinite scroll
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const hasMore = visibleCount < filteredData.length;

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > SCROLL_THRESHOLD) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + MOBILE_PAGE_SIZE, filteredData.length)
        );
        setIsFetchingMore(false);
      }, 400);
    }
  }, [isFetchingMore, hasMore, filteredData.length]);

  const mobileData = useMemo(
    () => filteredData.slice(0, visibleCount),
    [filteredData, visibleCount]
  );

  const handleMobileDetail = useCallback(
    (item: StockLevel) => {
      setSelectedStock(item);
      openStockFormSheet("details");
    },
    [setSelectedStock, openStockFormSheet]
  );

  // Reset visible count when search changes
  const handleSearchChange = useCallback(
    (value: string) => {
      setFilter({ ...filter, search: value });
      setVisibleCount(MOBILE_PAGE_SIZE);
    },
    [filter, setFilter]
  );

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      setVisibleCount(MOBILE_PAGE_SIZE);
    },
    []
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
        {/* KPI Summary + Category Filters */}
        <MobileStockHeader
          items={DUMMY_STOCK_LEVELS}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("warehouse.searchStock", "Search stock items...")}
            value={filter.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full ps-9"
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

        {/* Results Count */}
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {filteredData.length} {t("common.items", "items")}
            {selectedCategory && (
              <span className="text-muted-foreground/60">
                {" "}
                in {selectedCategory.replace("_", " ")}
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

        {/* Card List with Infinite Scroll */}
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

          {mobileData.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noStockItems", "No stock items found")}
            </div>
          )}

          {isFetchingMore && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!hasMore && mobileData.length > 0 && (
            <div className="text-center py-3 text-[11px] text-muted-foreground">
              {t("common.endOfList", "End of list")} •{" "}
              {filteredData.length} {t("common.items", "items")}
            </div>
          )}
        </div>
      </div>
    );
  }

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
      isLoading={isLoading}
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
  );
}
