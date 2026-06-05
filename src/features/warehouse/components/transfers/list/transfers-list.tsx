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
  useInfiniteTransfers,
  useTransfers,
} from "@/features/warehouse/api/get-transfers";
import { toStockTransfers } from "@/features/warehouse/types/transfers";
import { useTransferColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { MobileTransferHeader } from "./mobile-transfer-header";
import { TransferMobileCard } from "./transfer-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";
import { StockTransfer } from "@/features/warehouse/types";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

export function TransfersList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openTransferFormSheet, setSelectedTransfer } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const columns = useTransferColumns();

  const desktopParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      search: filter.search || undefined,
    }),
    [filter.page, filter.limit, filter.search]
  );

  const {
    data: transfersResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useTransfers({
    params: desktopParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteTransfers({
    limit: MOBILE_PAGE_SIZE,
    search: filter.search || undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = useMemo(
    () => toStockTransfers(transfersResponse?.data ?? []),
    [transfersResponse]
  );
  const metadata = transfersResponse?.metadata;

  const mobileDataAll = useMemo(
    () =>
      toStockTransfers(
        infiniteData?.pages.flatMap((page) => page.data) ?? []
      ),
    [infiniteData]
  );

  const mobileTotalCount =
    infiniteData?.pages[0]?.metadata.total_data ?? mobileDataAll.length;

  const mobileData = useMemo(() => {
    if (!selectedStatus) return mobileDataAll;
    return mobileDataAll.filter((item) => item.status === selectedStatus);
  }, [mobileDataAll, selectedStatus]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: tableData,
    pageCount: metadata?.total_page ?? 0,
    getRowId: (row: StockTransfer) => String(row.id),
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
    (item: StockTransfer) => {
      setSelectedTransfer(item);
      openTransferFormSheet("details");
    },
    [setSelectedTransfer, openTransferFormSheet]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilter({ ...filter, search: value || null, page: 1 });
    },
    [filter, setFilter]
  );

  const handleStatusChange = useCallback((status: string | null) => {
    setSelectedStatus(status);
  }, []);

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  if (isMobile) {
    return (
      <div className="mt-2 space-y-3">
        <MobileTransferHeader
          items={mobileDataAll}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />

        <div className="relative">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("warehouse.searchTransfers", "Search transfers...")}
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

        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {mobileTotalCount} {t("common.items", "items")}
            {selectedStatus && (
              <span className="text-muted-foreground/60">
                {" "}
                • {selectedStatus.replace("_", " ")}
              </span>
            )}
          </span>
          {(filter.search || selectedStatus) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] font-semibold text-muted-foreground px-2"
              onClick={() => {
                handleSearchChange("");
                handleStatusChange(null);
              }}
            >
              {t("common.clearFilters", "Clear filters")}
            </Button>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[calc(100vh-420px)] overflow-y-auto space-y-3 pr-1"
        >
          {mobileData.map((item) => (
            <TransferMobileCard
              key={item.id}
              item={item}
              onDetail={handleMobileDetail}
            />
          ))}

          {mobileData.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noTransfers", "No transfers found")}
            </div>
          )}

          {(isMobileLoading || isFetchingNextPage) && (
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
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    {t("common.filter")}
                  </Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder={t(
                      "warehouse.searchTransfers",
                      "Search transfers..."
                    )}
                    value={filter.search || ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        search: e.target.value || null,
                        page: 1,
                      })
                    }
                    className="w-64 ps-9"
                  />
                  {filter.search && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                      onClick={() =>
                        setFilter({ ...filter, search: null, page: 1 })
                      }
                    >
                      <X />
                    </Button>
                  )}
                </div>
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
