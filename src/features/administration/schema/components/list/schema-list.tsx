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
import { SchemaRecord, SchemaType } from "../../types";
import { DUMMY_SCHEMAS } from "../../data/dummy-schemas";
import { useSchemaStore } from "../../store/schema";
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

  const [data] = useState<SchemaRecord[]>(DUMMY_SCHEMAS);
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredData = useMemo(() => {
    let result = data.filter((r) => r.schema_type === activeSchemaType);

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.customer_type.toLowerCase().includes(q) ||
          r.version.toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, activeSchemaType, filter.search]);

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(filteredData.length / (filter.limit || 10)),
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
      isLoading={false}
    >
      {/* Schema Type Tabs */}
      <div className="flex items-center gap-1 border-b">
        {SCHEMA_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveSchemaType(tab.value)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeSchemaType === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search schemas..."
                  value={filter.search || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className="w-52 ps-9"
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
