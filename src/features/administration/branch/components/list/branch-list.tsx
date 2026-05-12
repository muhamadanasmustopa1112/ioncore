"use client";

import { useEffect, useState } from "react";
import {
  getCoreRowModel,
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
import { useBranchListPaginated } from "../../api/branch-queries";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

const BRANCH_TYPES = [
  { value: "all",       label: "All" },
  { value: "office",    label: "Office" },
  { value: "noc",       label: "NOC" },
  { value: "warehouse", label: "Warehouse" },
] as const;

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
  const activeType = filter.branch_type || "all";

  const { data: result = { items: [], total: 0 }, isLoading } = useBranchListPaginated({
    page,
    per_page: limit,
    search: filter.search ?? undefined,
    branch_type: activeType !== "all" ? activeType : undefined,
  });

  const branches = result.items;
  const total = result.total;

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
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: limit })
          : updater;
      setFilter({ ...filter, page: next.pageIndex + 1, limit: next.pageSize });
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
      <div className="mt-[10px] space-y-0">
        {/* Type tabs */}
        <div className="flex items-center gap-1 border-b border-border px-1">
          {BRANCH_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter({ ...filter, branch_type: t.value === "all" ? null : t.value, page: 1 })}
              className={[
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:rounded-full after:transition-all",
                activeType === t.value
                  ? "text-primary after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:bg-transparent",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card className="rounded-tl-none rounded-tr-none border-t-0">
          <CardHeader>
            <CardHeading className="py-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search branch..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-64 ps-9"
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
            </CardHeading>
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
            <DataGridPagination filter={filter} setFilter={setFilter} />
          </CardFooter>
        </Card>
      </div>
    </DataGrid>
  );
}
