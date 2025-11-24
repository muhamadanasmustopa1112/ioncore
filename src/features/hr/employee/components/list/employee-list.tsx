"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiFilePdf2Line } from "@remixicon/react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Filter, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeRequest, useEmployees } from "../../api/get-users";
import { useEmployeeStore } from "../../store/employee";
import { Employee } from "../../types";
import { EmployeeDetailsSheet } from "../details/employee-details-sheet";
import { EmployeeFormSheet } from "../form/employee-form-sheet";
import { ActionsCell } from "./table/data-table-actions-cell";
import { DataTableToolbar } from "./table/data-table-toolbar";

export function EmployeeList() {
  const columns: ColumnDef<Employee>[] = useMemo(() => {
    return [
      {
        id: "fullname",
        accessorFn: (row) => row.fullname,
        header: ({ column }) => (
          <DataGridColumnHeader title="Fullname" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarImage src={row.original.url_profile_picture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href="#"
                className="text-mono hover:text-primary-active mb-px text-sm font-bold"
              >
                {row.original.fullname}
              </Link>
              <span className="text-muted-foreground text-sm font-normal">
                {row.original.job?.job_name}
              </span>
              <span
                className="text-primary cursor-pointer"
                onClick={handleEmployeeDetailsOpen}
              >
                {row.original.guid}
              </span>
            </div>
          </div>
        ),
        enableSorting: true,
        size: 300,
        meta: {
          headerTitle: "Full Name",
          headerClassName: "",
          skeleton: (
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-[90px]" />
                <Skeleton className="h-5 w-[70px]" />
              </div>
            </div>
          ),
        },
      },
      {
        id: "account_info",
        accessorFn: (row) => row.nickname,
        header: ({ column }) => (
          <DataGridColumnHeader title="Account Info" column={column} />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-bold">{row.original.nickname}</div>
            <div className="text-muted-foreground">{row.original.email}</div>
          </div>
        ),
        enableSorting: true,
        size: 250,
        meta: {
          headerTitle: "Account Info",
          headerClassName: "",
          skeleton: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-[90px]" />
              <Skeleton className="h-5 w-[70px]" />
            </div>
          ),
        },
      },
      {
        id: "outlet",
        accessorFn: (row) => row.outlet?.outlet_name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Outlet" column={column} />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-bold">{row.original.outlet?.outlet_name}</div>
            <div className="text-muted-foreground">
              {row.original.job?.join_date
                ? format(row.original.job?.join_date, "dd MMMM yyyy")
                : "-"}
            </div>
          </div>
        ),
        enableSorting: true,
        size: 250,
        meta: {
          headerClassName: "",
          skeleton: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-[90px]" />
              <Skeleton className="h-5 w-[70px]" />
            </div>
          ),
        },
      },
      {
        id: "cv",
        accessorFn: (row) => row.cv_file_url,
        header: ({ column }) => (
          <DataGridColumnHeader title="CV" column={column} />
        ),
        cell: ({ row }) => {
          if (row.original.cv_file_url) {
            return (
              <a
                href={row.original.cv_file_url}
                target="_blank"
                className="flex items-center justify-center"
              >
                <RiFilePdf2Line className="text-muted-foreground h-8 w-8" />
              </a>
            );
          }
          return "";
        },
        enableSorting: true,
        size: 80,
        meta: {
          headerTitle: "CV",
          headerClassName: "",
          skeleton: <Skeleton className="h-5 w-[70px]" />,
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 60,
        meta: {
          headerClassName: "",
          skeleton: <Skeleton className="h-5 w-[70px]" />,
        },
      },
    ];
  }, []);

  const {
    form,
    setForm,
    employeeSheetOpen,
    closeEmployeeFormSheet,
    openEmployeeFormSheet,
  } = useEmployeeStore();

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
  const [isEmployeeSheetOpen, setIsEmployeeSheetOpen] = useState(false);

  const handleEmployeeDetailsOpen = () => {
    setIsEmployeeSheetOpen(true);
  };

  const handleEmployeeDetailsClose = () => {
    setIsEmployeeSheetOpen(false);
  };

  const handleEditFromEmployeeDetails = () => {
    openEmployeeFormSheet("edit");
  };

  const handleEmployeeFormClose = () => {
    closeEmployeeFormSheet();
  };

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

  const { data: userData, isLoading, isFetching } = useEmployees({ request });

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
        pageSize: filter.limit ?? 10,
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
          columnsResizable: true,
          cellBorder: true,
        }}
        isLoading={isLoading || isFetching}
      >
        <Card className="mt-[10px]">
          <CardHeader>
            <CardHeading>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search Users..."
                    value={filter.search || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    className="w-40 ps-9"
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
                      <div className="text-muted-foreground text-xs font-medium">
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
                              className="flex grow items-center justify-between gap-1.5 font-normal"
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

      {/* Customer Details Sheet */}
      <EmployeeDetailsSheet
        open={isEmployeeSheetOpen}
        onOpenChange={handleEmployeeDetailsClose}
        onEditClick={handleEditFromEmployeeDetails}
      />

      {/* Customer Form Sheet */}
      <EmployeeFormSheet
        mode={form ?? "new"}
        open={employeeSheetOpen}
        onOpenChange={handleEmployeeFormClose}
      />
    </>
  );
}
