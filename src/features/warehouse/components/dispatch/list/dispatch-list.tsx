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
  useDispatches,
  useInfiniteDispatches,
} from "@/features/warehouse/api/get-dispatches";
import { mapApiDispatchesToRecords } from "@/features/warehouse/utils/map-dispatch";
import { useDispatchColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { MobileDispatchHeader } from "./mobile-dispatch-header";
import { DispatchMobileCard } from "./dispatch-mobile-card";
import { useWarehouseStore } from "../../../store/warehouse";
import { DispatchRecord } from "@/features/warehouse/types";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

const WAREHOUSE_FILTER_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const STATUS_FILTER_OPTIONS = [
  "IN_TRANSIT",
  "PENDING",
  "PREPARING",
  "DISPATCHED",
  "COMPLETED",
  "SIGNED_OFF",
];

export function DispatchList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openDispatchFormSheet, setSelectedDispatch } = useWarehouseStore();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    wo_id: parseAsString,
    technician_user_id: parseAsString,
    source_warehouse_id: parseAsInteger,
    status: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useDispatchColumns();

  const apiParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      wo_id: filter.wo_id || undefined,
      technician_user_id: filter.technician_user_id || undefined,
      source_warehouse_id: filter.source_warehouse_id ?? undefined,
      status: filter.status || undefined,
    }),
    [
      filter.page,
      filter.limit,
      filter.wo_id,
      filter.technician_user_id,
      filter.source_warehouse_id,
      filter.status,
    ]
  );

  const {
    data: dispatchesResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useDispatches({
    params: apiParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteDispatches({
    limit: MOBILE_PAGE_SIZE,
    wo_id: filter.wo_id || undefined,
    technician_user_id: filter.technician_user_id || undefined,
    source_warehouse_id: filter.source_warehouse_id ?? undefined,
    status: filter.status || undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = useMemo(
    () => mapApiDispatchesToRecords(dispatchesResponse?.data ?? []),
    [dispatchesResponse]
  );
  const metadata = dispatchesResponse?.metadata;

  const mobileDataAll = useMemo(
    () =>
      mapApiDispatchesToRecords(
        infiniteData?.pages.flatMap((page) => page.data) ?? []
      ),
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
    getRowId: (row: DispatchRecord) => String(row.id),
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
    (item: DispatchRecord) => {
      setSelectedDispatch(item);
      openDispatchFormSheet("details");
    },
    [setSelectedDispatch, openDispatchFormSheet]
  );

  const handleWoIdChange = useCallback(
    (value: string) => {
      setFilter({ ...filter, wo_id: value || null, page: 1 });
    },
    [filter, setFilter]
  );

  const handleStatusChange = useCallback(
    (status: string | null) => {
      setFilter({ ...filter, status: status || null, page: 1 });
    },
    [filter, setFilter]
  );

  const clearFilters = useCallback(() => {
    setFilter({
      wo_id: null,
      technician_user_id: null,
      source_warehouse_id: null,
      status: null,
      page: 1,
    });
  }, [setFilter]);

  const hasActiveFilters =
    !!filter.wo_id ||
    !!filter.technician_user_id ||
    filter.source_warehouse_id != null ||
    !!filter.status;

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;
  const isFetching = isMobile ? isFetchingNextPage : isDesktopFetching;

  if (isMobile) {
    return (
      <div className="mt-2 space-y-3 overflow-hidden">
        <MobileDispatchHeader
          items={mobileDataAll}
          selectedStatus={filter.status}
          onStatusChange={handleStatusChange}
        />

        <div className="relative">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("warehouse.searchByWoId", "Search by WO ID...")}
            value={filter.wo_id || ""}
            onChange={(e) => handleWoIdChange(e.target.value)}
            className="w-full ps-9"
          />
          {filter.wo_id && (
            <Button
              mode="icon"
              variant="ghost"
              className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => handleWoIdChange("")}
            >
              <X />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {mobileTotalCount} {t("common.items", "items")}
            {filter.status && (
              <span className="text-muted-foreground/60">
                {" "}
                • {filter.status}
              </span>
            )}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] font-semibold text-muted-foreground px-2 cursor-pointer transition-colors duration-200"
              onClick={clearFilters}
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
          {mobileDataAll.map((item) => (
            <DispatchMobileCard
              key={item.id}
              item={item}
              onDetail={handleMobileDetail}
            />
          ))}

          {mobileDataAll.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("warehouse.noDispatches", "No dispatches found")}
            </div>
          )}

          {(isFetching || isFetchingNextPage) && (
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
                      "warehouse.searchByWoId",
                      "Search by WO ID..."
                    )}
                    value={filter.wo_id || ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        wo_id: e.target.value || null,
                        page: 1,
                      })
                    }
                    className="w-64 ps-9"
                  />
                  {filter.wo_id && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                      onClick={() =>
                        setFilter({ ...filter, wo_id: null, page: 1 })
                      }
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </div>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("warehouse.technician", "Technician")}
                    </label>
                    <Input
                      value={filter.technician_user_id || ""}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          technician_user_id: e.target.value || null,
                          page: 1,
                        })
                      }
                      placeholder="tech-bks-001"
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("warehouse.warehouseLabel", "Warehouse")}
                    </label>
                    <select
                      value={filter.source_warehouse_id ?? ""}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          source_warehouse_id: e.target.value
                            ? Number(e.target.value)
                            : null,
                          page: 1,
                        })
                      }
                      className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All warehouses</option>
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
                          ...filter,
                          status: e.target.value || null,
                          page: 1,
                        })
                      }
                      className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All statuses</option>
                      {STATUS_FILTER_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={clearFilters}
                  >
                    {t("common.clearFilters", "Clear filters")}
                  </Button>
                )}
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
