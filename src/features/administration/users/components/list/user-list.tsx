"use client";

import { useMemo, useState } from "react";
import { useUsers } from "@/features/user-service/api/users";
import { getPageCount } from "@/lib/pagination";
import { mapAuthUserToUserData } from "../../mappers";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserData } from "../../types";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function UserList() {
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
    status: parseAsString,
  });
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data: usersResp, isLoading } = useUsers({
    page: pagination.page,
    per_page: pagination.limit,
  });
  const data = useMemo<UserData[]>(
    () => (usersResp?.data || []).map(mapAuthUserToUserData),
    [usersResp],
  );

  const filteredData = useMemo(() => {
    let result = data;

    if (filter.status && filter.status !== "all") {
      result = result.filter((r) => r.status === filter.status);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, filter.search, filter.status]);

  const table = useReactTable({
    columns,
    data: filteredData,
    manualPagination: true,
    pageCount: getPageCount(usersResp?.metadata, pagination.limit) || 1,
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
      void setPagination({ page: next.pageIndex + 1, limit: next.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={usersResp?.metadata?.total ?? filteredData.length}
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
                  placeholder="Search users..."
                  value={filter.search || ""}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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
              <Select
                value={filter.status || "all"}
                onValueChange={(val) => setFilter({ ...filter, status: val === "all" ? null : val })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
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
          <DataGridPagination
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setFilter={(updater: any) => {
              const next = typeof updater === "function" ? updater(pagination) : updater;
              void setPagination(next);
            }}
            filter={pagination}
          />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
