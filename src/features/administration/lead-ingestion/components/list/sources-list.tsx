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
import { Search, Settings2, X } from "lucide-react";
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
import { useLeadIngestionStore } from "../../store/lead-ingestion";
import { columns } from "./table/columns";

export function SourcesList() {
  const sources = useLeadIngestionStore((s) => s.sources);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(() => {
    if (!search) return sources;
    const q = search.toLowerCase();
    return sources.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.apiKey.toLowerCase().includes(q)
    );
  }, [sources, search]);

  const table = useReactTable({
    columns,
    data: filtered,
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
      recordCount={filtered.length}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
      isLoading={false}
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="relative w-full sm:w-60">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search sources..."
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
                  View
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
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
