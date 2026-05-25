"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { getUserColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function UserList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
    status: parseAsString,
  });
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search ?? "");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    const next = debouncedSearch.trim() ? debouncedSearch.trim() : null;
    if (next !== (filter.search ?? null)) {
      void setFilter({ ...filter, search: next });
      void setPagination({ ...pagination, page: 1 });
    }
  }, [debouncedSearch]);

  const { data: usersResp, isLoading } = useUsers({
    page: pagination.page,
    per_page: pagination.limit,
    search: filter.search ?? undefined,
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

    return result;
  }, [data, filter.status]);

  const columns = useMemo(() => getUserColumns(t), [t]);

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
                  placeholder={t("administration.users.searchUsers")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-52 ps-9"
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
              <Select
                value={filter.status || "all"}
                onValueChange={(val) => setFilter({ ...filter, status: val === "all" ? null : val })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={t("administration.users.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("administration.users.all")}</SelectItem>
                  <SelectItem value="active">{t("administration.users.active")}</SelectItem>
                  <SelectItem value="inactive">{t("administration.users.inactive")}</SelectItem>
                  <SelectItem value="locked">{t("administration.users.locked")}</SelectItem>
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
          <DataGridPagination setFilter={setPagination} filter={pagination} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}