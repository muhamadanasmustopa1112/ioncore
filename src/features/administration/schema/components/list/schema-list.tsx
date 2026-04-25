"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchemaRecord, SchemaType } from "../../types";
import { useSchemaStore } from "../../store/schema";
import { useSchemaList } from "../../api/schema-queries";
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
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data: queryResult, isLoading } = useSchemaList({
    schemaType: activeSchemaType,
    page: filter.page,
    size: filter.limit,
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

  const total = queryResult?.metadata?.total ?? filteredData.length;

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(total / (filter.limit || 10)),
    getRowId: (row) => row.id,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
