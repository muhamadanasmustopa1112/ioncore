"use client";

import { useMemo, useState } from "react";
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
import { useRoles } from "@/features/user-service/api/roles";
import { getPageCount } from "@/lib/pagination";
import { RoleData } from "../../types";
import { mapRoleToRoleData } from "../../mappers";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function RoleList() {
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data: rolesResp, isLoading } = useRoles({
    page: pagination.page,
    per_page: pagination.limit,
  });
  const data = useMemo<RoleData[]>(
    () => (rolesResp?.data || []).map(mapRoleToRoleData),
    [rolesResp],
  );

  const filteredData = useMemo(() => {
    if (!filter.search) return data;
    const q = filter.search.toLowerCase();
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [data, filter.search]);

  const table = useReactTable({
    columns,
    data: filteredData,
    manualPagination: true,
    pageCount: getPageCount(rolesResp?.metadata, pagination.limit) || 1,
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
      recordCount={rolesResp?.metadata?.total ?? filteredData.length}
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
          <CardHeading className="py-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search roles..."
                  value={filter.search || ""}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-48 ps-9"
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
          <DataGridPagination setFilter={setPagination} filter={pagination} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
