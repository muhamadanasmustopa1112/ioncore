"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuditLogList } from "../../api/audit-log-queries";
import { buildColumns } from "./table/columns";
import type { AuditLog, AuditLogFilters } from "../../types/audit-log";
import type { AuditActionType, AuditModule } from "../../types/audit-log-api";

interface AuditListProps {
  filters: Partial<AuditLogFilters>;
  onViewDetail: (log: AuditLog) => void;
}

export function AuditList({ filters, onViewDetail }: AuditListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search ?? "");
  const [pagination, setPagination] = useState({
    pageIndex: (filters.page ?? 1) - 1,
    pageSize: filters.perPage ?? 20,
  });

  const queryFilters = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      from_date: filters.fromDate,
      to_date: filters.toDate,
      user_id: filters.userIds,
      action_type: filters.actionTypes as AuditActionType[] | undefined,
      module: filters.modules as AuditModule[] | undefined,
      record_type: filters.recordType,
      search: search || undefined,
      sort: "-timestamp",
    }),
    [filters, search, pagination],
  );

  const { data, isLoading, isError, refetch } = useAuditLogList(queryFilters);
  const logs = data?.logs ?? [];

  const columns = useMemo(() => buildColumns(onViewDetail, t), [onViewDetail, t]);

  const table = useReactTable({
    columns,
    data: logs,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data?.pagination.total_pages ?? 0,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <DataGrid
      table={table}
      recordCount={data?.pagination.total ?? 0}
      tableLayout={{
        columnsPinnable: true,
        columnsVisibility: true,
        cellBorder: true,
        rowBorder: true,
      }}
      isLoading={isLoading && !isError}
      emptyMessage={
        isError ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <AlertCircle className="size-8 text-destructive opacity-70" />
            <p className="text-sm font-medium text-destructive">{t("administration.auditLogPage.errorLoad")}</p>
            <button
              onClick={() => refetch()}
              className="mt-1 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {t("administration.auditLogPage.errorRetry")}
            </button>
          </div>
        ) : (
          t("administration.auditLogPage.empty")
        )
      }
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="relative w-full sm:w-72">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder={t("administration.auditLogPage.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-9"
              />
              {search && (
                <Button
                  mode="icon"
                  variant="ghost"
                  className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                  onClick={() => setSearch("")}
                >
                  <X />
                </Button>
              )}
            </div>
          </CardHeading>
          <CardToolbar>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              {t("administration.auditLogPage.exportCsv")}
            </Button>
          </CardToolbar>
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
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
