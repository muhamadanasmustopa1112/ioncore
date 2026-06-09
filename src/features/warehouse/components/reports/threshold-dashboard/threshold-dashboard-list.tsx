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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useInfiniteThresholdDashboard,
  useThresholdDashboard,
} from "@/features/warehouse/api/get-threshold-dashboard";
import type { ThresholdDashboardItem } from "@/features/warehouse/types/threshold-dashboard";
import { useThresholdDashboardColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ThresholdDashboardKpi } from "./threshold-dashboard-kpi";
import { ThresholdDashboardMobileCard } from "./threshold-dashboard-mobile-card";
import { ThresholdAlertDetailDialog } from "./threshold-alert-detail-dialog";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

const STATUS_FILTER_OPTIONS = ["OPEN", "ACKNOWLEDGED"] as const;

export function ThresholdDashboardList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    alert_status: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedAlert, setSelectedAlert] =
    useState<ThresholdDashboardItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = useCallback((item: ThresholdDashboardItem) => {
    setSelectedAlert(item);
    setDetailOpen(true);
  }, []);

  const columns = useThresholdDashboardColumns({ onViewDetail: handleViewDetail });

  const listParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      status: filter.alert_status || undefined,
    }),
    [filter.page, filter.limit, filter.alert_status]
  );

  const {
    data: dashboardResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useThresholdDashboard({
    params: listParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteThresholdDashboard({
    limit: MOBILE_PAGE_SIZE,
    status: filter.alert_status || undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = dashboardResponse?.data ?? [];
  const metadata = dashboardResponse?.metadata;

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
    getRowId: (row: ThresholdDashboardItem) =>
      String(row.threshold_alert_id),
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

  const clearFilters = useCallback(() => {
    setFilter({ alert_status: null, page: 1 });
  }, [setFilter]);

  const hasActiveFilters = !!filter.alert_status;
  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  const filterPanel = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("common.status", "Status")}
        </label>
        <select
          value={filter.alert_status || ""}
          onChange={(e) =>
            setFilter({
              alert_status: e.target.value || null,
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
              {status}
            </option>
          ))}
        </select>
      </div>
      {hasActiveFilters && (
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs font-semibold text-muted-foreground"
            onClick={clearFilters}
          >
            {t("common.clearFilters", "Clear filters")}
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="mt-2 space-y-3 overflow-hidden">
          <ThresholdDashboardKpi
            items={mobileDataAll}
            totalCount={mobileTotalCount}
          />

          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full h-10">
                <Filter className="size-4" />
                {t("common.filter")}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>{filterPanel}</CollapsibleContent>
          </Collapsible>

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
                {t("common.clearFilters", "Clear filters")}
              </Button>
            )}
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-[calc(100vh-480px)] overflow-y-auto space-y-3 pr-1"
          >
            {isMobileLoading && mobileDataAll.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              mobileDataAll.map((item) => (
                <ThresholdDashboardMobileCard
                  key={item.threshold_alert_id}
                  item={item}
                  onDetail={handleViewDetail}
                />
              ))
            )}

            {mobileDataAll.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("warehouse.noThresholdAlerts", "No threshold alerts found")}
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

        <ThresholdAlertDetailDialog
          alert={selectedAlert}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <ThresholdDashboardKpi
          items={tableData}
          totalCount={metadata?.total_data ?? 0}
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
                  <CollapsibleContent>{filterPanel}</CollapsibleContent>
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

      <ThresholdAlertDetailDialog
        alert={selectedAlert}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
