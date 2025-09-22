"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Filter, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmployeeRequest, useEmployees } from "../api/get-users";
import { Employee } from "../types";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function EmployeeList() {
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fullname", desc: false },
  ]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const request = useMemo<EmployeeRequest>(() => {
    return {
      filter: {
        set_guid: false,
        guid: "e28c301f-9773-4197-9979-f86f15c5df34",
        set_fullname: !!filter.search,
        fullname: filter.search || "",
        set_nickname: false,
        nickname: "",
        set_gender: false,
        gender: "Laki-laki",
        set_marital: false,
        marital: "Kawin",
        set_education: false,
        education: "SMA",
        set_join_date: false,
        join_date: "",
        set_nik: false,
        nik: "",
        set_id_card: false,
        id_card: "",
        set_email: false,
        email: "",
        set_phone_number: false,
        phone_number: "",
        set_job_id: false,
        job_id: [],
        set_department_id: false,
        department_id: "",
        set_group_id: false,
        group_id: "",
        set_brand_id: false,
        brand_id: "",
        set_status: true,
        status: "all",
        set_outlet_id: false,
        outlet_id: "0d049ef3-a3b0-4bdd-995d-e62db54ad26f",
        set_is_perbantuan: false,
        is_perbantuan: false,
        set_perbantuan_outlet_id: false,
        perbantuan_outlet_id: "",
      },
      limit: filter.limit,
      page: filter.page,
      order: "created_at",
      sort: "DESC",
    };
  }, [filter]);

  const { data: userData, isLoading } = useEmployees({ request });

  const data = useMemo(() => {
    return userData?.response?.data ?? [];
  }, [userData]);

  const meta = useMemo(() => {
    return userData?.response ?? {};
  }, [userData]);

  const table = useReactTable({
    columns,
    data,
    pageCount: meta?.total_page ?? 0,
    getRowId: (row: Employee) => String(row.guid),
    state: {
      pagination: {
        pageIndex: filter.page - 1 || 0,
        pageSize: filter.limit ?? 0,
      },
      columnOrder,
      // sorting,
      // rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={meta?.total_data || 0}
        tableLayout={{
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
          cellBorder: true,
        }}
        isLoading={isLoading}
      >
        <Card>
          <CardHeader>
            <CardHeading>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search Users..."
                    value={filter.search || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    className="ps-9 w-40"
                  />
                  {filter.search && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setFilter({ ...filter, search: "" })}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter />
                      Sort Order
                      {sortOrder !== "latest" && (
                        <Badge size="sm" variant="outline">
                          {sortOrder.charAt(0).toUpperCase() +
                            sortOrder.slice(1)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-3" align="start">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground">
                        Sort By
                      </div>
                      <div className="space-y-3">
                        {["latest", "older", "oldest"].map((order) => (
                          <div
                            key={order}
                            className="flex items-center gap-2.5"
                          >
                            <Checkbox
                              id={order}
                              checked={sortOrder === order}
                              onCheckedChange={(checked) =>
                                checked && setSortOrder(order)
                              }
                            />
                            <Label
                              htmlFor={order}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              {order.charAt(0).toUpperCase() + order.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeading>
            <DataTableToolbar />
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>
    </>
  );
}
