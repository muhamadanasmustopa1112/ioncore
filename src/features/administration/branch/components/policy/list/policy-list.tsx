"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, RefreshCw, Search, Settings2, X } from "lucide-react";
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
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePolicyList } from "../../../api/policy-queries";
import { getPolicyColumns } from "./table/columns";

interface PolicyListProps {
  branchId: string;
}

export function PolicyList({ branchId }: PolicyListProps) {
  const { t } = useTranslation();
  const { data: policies = [], isLoading, isError, refetch } = usePolicyList(branchId);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredData = useMemo(() => {
    if (!search) return policies;
    const q = search.toLowerCase();
    return policies.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.policyJson.timezone.toLowerCase().includes(q)
    );
  }, [policies, search]);

  const columns = useMemo(() => getPolicyColumns(t), [t]);

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(filteredData.length / pagination.limit),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit })
        : updater;
      setPagination({ page: next.pageIndex + 1, limit: next.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
      isLoading={isLoading && !isError}
      emptyMessage={
        isError ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <AlertCircle className="size-8 text-destructive opacity-70" />
            <p className="text-sm font-medium text-destructive">
              {t("administration.branch.policy.failedToLoad")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("administration.branch.policy.somethingWentWrong")}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-1 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <RefreshCw className="size-3.5" />
              {t("administration.branch.policy.retry")}
            </button>
          </div>
        ) : (
          t("administration.branch.policy.noPoliciesFound")
        )
      }
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="relative w-full sm:w-56">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder={t("administration.branch.policy.searchPolicies")}
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
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant="outline">
                  <Settings2 />
                  {t("administration.branch.policy.view")}
                </Button>
              }
            />
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
          <DataGridPagination setFilter={setPagination} filter={pagination} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}