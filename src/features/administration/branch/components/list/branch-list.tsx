"use client";

import { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Filter, Search, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useBranchListPaginated } from "../../api/branch-queries";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function BranchList() {
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
    branch_type: parseAsString,
  });

  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search ?? "");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    const next = debouncedSearch.trim() ? debouncedSearch.trim() : null;
    if (next !== (filter.search ?? null)) {
      setFilter({ ...filter, search: next, page: 1 });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const page = filter.page || 1;
  const limit = filter.limit || 10;

  const { data: result = { items: [], total: 0 }, isLoading } = useBranchListPaginated({
    page,
    per_page: limit,
    search: filter.search ?? undefined,
    branch_type:
      filter.branch_type && filter.branch_type !== "all"
        ? filter.branch_type
        : undefined,
  });

  const branches = result.items;
  const total = result.total;

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    columns,
    data: branches,
    pageCount: Math.max(1, Math.ceil(total / limit)),
    rowCount: total,
    manualPagination: true,
    manualFiltering: true,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: limit })
          : updater;
      setFilter({
        ...filter,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={total}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
      }}
      isLoading={isLoading}
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CardHeading className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Filter
                  </Button>
                </CollapsibleTrigger>
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search branch..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full ps-9"
                  />
                  {searchInput && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                      onClick={() => setSearchInput("")}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </div>
              <CollapsibleContent>
                <div className="flex items-center gap-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Type:</span>
                    <Select
                      value={filter.branch_type || "all"}
                      onValueChange={(val) =>
                        setFilter({
                          ...filter,
                          branch_type: val === "all" ? null : val,
                          page: 1,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="noc">NOC</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
