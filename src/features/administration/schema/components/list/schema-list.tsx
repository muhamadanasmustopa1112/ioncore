"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useQueryStates, parseAsString } from "nuqs";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchemaRecord, SchemaType } from "../../types";
import { useSchemaStore } from "../../store/schema";
import { useSchemaList } from "../../api/schema-queries";
import { getPageCount } from "@/lib/pagination";
import { columns } from "./table/columns";

const SCHEMA_TABS: { value: SchemaType; label: string }[] = [
  { value: "billing", label: "Billing" },
  { value: "onboarding", label: "Onboarding" },
  { value: "service", label: "Service" },
  { value: "commission", label: "Commission" },
  { value: "suspension", label: "Suspension" },
];

export function SchemaList() {
  const { activeSchemaType, setActiveSchemaType } =
    useSchemaStore();

  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [activeSchemaType]);

  const { data: queryResult, isLoading } = useSchemaList({
    schemaType: activeSchemaType,
    page: pagination.page,
    size: pagination.limit,
  });

  const rows = queryResult?.schemas ?? [];

  const filteredData = useMemo(() => {
    if (!filter.search) return rows;
    const q = filter.search.toLowerCase();
    return rows.filter(
      (r: SchemaRecord) =>
        r.name.toLowerCase().includes(q) ||
        r.customer_type.toLowerCase().includes(q) ||
        (r.latest_version ?? "").toLowerCase().includes(q)
    );
  }, [rows, filter.search]);

  const pageCountFromMeta = getPageCount(queryResult?.metadata, pagination.limit);

  const table = useReactTable({
    columns,
    data: filteredData,
    manualPagination: true,
    pageCount: pageCountFromMeta || 1,
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
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={queryResult?.metadata?.total ?? filteredData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
      isLoading={isLoading}
    >
      {/* Schema Type Tabs */}
      <Tabs value={activeSchemaType} onValueChange={(v) => setActiveSchemaType(v as SchemaType)}>
        <TabsList
          variant="line"
          size="sm"
          className="w-full justify-start"
        >
          {SCHEMA_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="relative w-full sm:w-52">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search schemas..."
                value={filter.search || ""}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                className="w-full ps-9"
              />
              {filter.search && (
                <Button
                  mode="icon"
                  variant="ghost"
                  className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                  onClick={() => setFilter({ ...filter, search: "" })}
                >
                  <X />
                </Button>
              )}
            </div>
          </CardHeading>
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
