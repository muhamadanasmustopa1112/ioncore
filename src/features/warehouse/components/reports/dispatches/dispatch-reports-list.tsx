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
import { Loader2 } from "lucide-react";
import { useQueryStates, parseAsInteger } from "nuqs";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useDispatchReports,
  useInfiniteDispatchReports,
} from "@/features/warehouse/api/get-dispatch-reports";
import type { DispatchReportItem } from "@/features/warehouse/types/dispatch-reports";
import { useDispatchReportColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { DispatchReportsKpi } from "./dispatch-reports-kpi";
import { DispatchReportsMobileCard } from "./dispatch-reports-mobile-card";
import { DispatchReportDetailDialog } from "./dispatch-report-detail-dialog";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

function getDispatchRowId(row: DispatchReportItem): string {
  return `${row.dispatch_number}-${row.created_at}`;
}

export function DispatchReportsList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedReport, setSelectedReport] = useState<DispatchReportItem | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = useCallback((item: DispatchReportItem) => {
    setSelectedReport(item);
    setDetailOpen(true);
  }, []);

  const columns = useDispatchReportColumns({ onViewDetail: handleViewDetail });

  const listParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
    }),
    [filter.page, filter.limit]
  );

  const {
    data: reportsResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useDispatchReports({
    params: listParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteDispatchReports({
    limit: MOBILE_PAGE_SIZE,
    queryConfig: { enabled: isMobile },
  });

  const tableData = reportsResponse?.data ?? [];
  const metadata = reportsResponse?.metadata;

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
    getRowId: getDispatchRowId,
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

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  if (isMobile) {
    return (
      <>
        <div className="mt-2 space-y-3 overflow-hidden">
          <DispatchReportsKpi
            items={mobileDataAll}
            totalCount={mobileTotalCount}
          />

          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">
              {mobileTotalCount} {t("common.items", "items")}
            </span>
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
                <DispatchReportsMobileCard
                  key={getDispatchRowId(item)}
                  item={item}
                  onDetail={handleViewDetail}
                />
              ))
            )}

            {mobileDataAll.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("warehouse.noDispatchReports", "No dispatch reports found")}
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

        <DispatchReportDetailDialog
          report={selectedReport}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <DispatchReportsKpi
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

      <DispatchReportDetailDialog
        report={selectedReport}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
