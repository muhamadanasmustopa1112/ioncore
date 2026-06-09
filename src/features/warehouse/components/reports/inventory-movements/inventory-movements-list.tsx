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
  useInfiniteInventoryMovements,
  useInventoryMovements,
} from "@/features/warehouse/api/get-inventory-movements";
import { useCategories } from "@/features/warehouse/api/get-categories";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";
import { useReportColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { MobileReportsHeader } from "./mobile-reports-header";
import { ReportsMobileCard } from "./reports-mobile-card";
import { InventoryMovementsKpi } from "./inventory-movements-kpi";
import { MovementDetailDialog } from "./movement-detail-dialog";

const MOBILE_PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 0.8;

const WAREHOUSE_FILTER_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const MOVEMENT_TYPE_FILTER_OPTIONS = [
  "REFURBISH_RESTOCK",
  "DISPATCH",
  "PURCHASE_RECEIPT",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "RETURN",
  "OPNAME_ADJUSTMENT",
  "CONSUMPTION",
] as const;

export function InventoryMovementsList() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    warehouse_id: parseAsInteger,
    stock_item_id: parseAsInteger,
    asset_id: parseAsInteger,
    batch_id: parseAsInteger,
    category_id: parseAsInteger,
    movement_type: parseAsString,
    reference_id: parseAsString,
  });
  const { data: categoriesResponse } = useCategories();
  const categoryOptions = categoriesResponse?.data ?? [];
  const [openFilter, setOpenFilter] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedMovement, setSelectedMovement] =
    useState<InventoryMovementItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = useCallback((item: InventoryMovementItem) => {
    setSelectedMovement(item);
    setDetailOpen(true);
  }, []);

  const columns = useReportColumns({ onViewDetail: handleViewDetail });

  const listParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      warehouse_id: filter.warehouse_id ?? undefined,
      stock_item_id: filter.stock_item_id ?? undefined,
      asset_id: filter.asset_id ?? undefined,
      batch_id: filter.batch_id ?? undefined,
      category_id: filter.category_id ?? undefined,
      movement_type: filter.movement_type || undefined,
      reference_id: filter.reference_id || undefined,
    }),
    [
      filter.page,
      filter.limit,
      filter.warehouse_id,
      filter.stock_item_id,
      filter.asset_id,
      filter.batch_id,
      filter.category_id,
      filter.movement_type,
      filter.reference_id,
    ]
  );

  const {
    data: movementsResponse,
    isLoading: isDesktopLoading,
    isFetching: isDesktopFetching,
  } = useInventoryMovements({
    params: listParams,
    queryConfig: { enabled: !isMobile },
  });

  const {
    data: infiniteData,
    isLoading: isMobileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteInventoryMovements({
    limit: MOBILE_PAGE_SIZE,
    warehouse_id: filter.warehouse_id ?? undefined,
    stock_item_id: filter.stock_item_id ?? undefined,
    asset_id: filter.asset_id ?? undefined,
    batch_id: filter.batch_id ?? undefined,
    category_id: filter.category_id ?? undefined,
    movement_type: filter.movement_type || undefined,
    reference_id: filter.reference_id || undefined,
    queryConfig: { enabled: isMobile },
  });

  const tableData = movementsResponse?.data ?? [];
  const metadata = movementsResponse?.metadata;

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
    getRowId: (row: InventoryMovementItem) => String(row.id),
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

  const handleTypeChange = useCallback(
    (type: string | null) => {
      setFilter({ movement_type: type, page: 1 });
    },
    [setFilter]
  );

  const clearFilters = useCallback(() => {
    setFilter({
      warehouse_id: null,
      stock_item_id: null,
      asset_id: null,
      batch_id: null,
      category_id: null,
      movement_type: null,
      reference_id: null,
      page: 1,
    });
  }, [setFilter]);

  const hasActiveFilters =
    filter.warehouse_id != null ||
    filter.stock_item_id != null ||
    filter.asset_id != null ||
    filter.batch_id != null ||
    filter.category_id != null ||
    !!filter.movement_type ||
    !!filter.reference_id;

  const isLoading = isMobile ? isMobileLoading : isDesktopLoading;

  const filterPanel = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.warehouseLabel", "Warehouse")}
        </label>
        <select
          value={filter.warehouse_id ?? ""}
          onChange={(e) =>
            setFilter({
              warehouse_id: e.target.value ? Number(e.target.value) : null,
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
          {t("warehouse.stockItemId", "Stock Item ID")}
        </label>
        <Input
          type="number"
          min={1}
          value={filter.stock_item_id ?? ""}
          onChange={(e) =>
            setFilter({
              stock_item_id: e.target.value ? Number(e.target.value) : null,
              page: 1,
            })
          }
          placeholder="1"
          className="text-xs h-9"
        />
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
              asset_id: e.target.value ? Number(e.target.value) : null,
              page: 1,
            })
          }
          placeholder="1"
          className="text-xs h-9"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.batchId", "Batch ID")}
        </label>
        <Input
          type="number"
          min={1}
          value={filter.batch_id ?? ""}
          onChange={(e) =>
            setFilter({
              batch_id: e.target.value ? Number(e.target.value) : null,
              page: 1,
            })
          }
          placeholder="1"
          className="text-xs h-9"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.category", "Category")}
        </label>
        <select
          value={filter.category_id ?? ""}
          onChange={(e) =>
            setFilter({
              category_id: e.target.value ? Number(e.target.value) : null,
              page: 1,
            })
          }
          className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          <option value="">
            {t("warehouse.allCategories", "All categories")}
          </option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.movementType", "Movement Type")}
        </label>
        <select
          value={filter.movement_type || ""}
          onChange={(e) =>
            setFilter({
              movement_type: e.target.value || null,
              page: 1,
            })
          }
          className="flex w-full bg-background border border-input h-9 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          <option value="">
            {t("warehouse.allMovementTypes", "All movement types")}
          </option>
          {MOVEMENT_TYPE_FILTER_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.referenceId", "Reference ID")}
        </label>
        <Input
          value={filter.reference_id || ""}
          onChange={(e) =>
            setFilter({
              reference_id: e.target.value || null,
              page: 1,
            })
          }
          placeholder="1"
          className="text-xs h-9"
        />
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
          <MobileReportsHeader
            items={mobileDataAll}
            totalCount={mobileTotalCount}
            selectedType={filter.movement_type}
            onTypeChange={handleTypeChange}
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
                <ReportsMobileCard
                  key={item.id}
                  item={item}
                  onDetail={handleViewDetail}
                />
              ))
            )}

            {mobileDataAll.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("warehouse.noReports", "No stock movements found")}
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

        <MovementDetailDialog
          movement={selectedMovement}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <InventoryMovementsKpi
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

      <MovementDetailDialog
        movement={selectedMovement}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
