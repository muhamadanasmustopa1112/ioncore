"use client";

import { useEffect, useMemo, useState } from "react";
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
import { DataGridTableDndRowHandle, DataGridTableDndRows } from "@/components/ui/data-grid-table-dnd-rows";
import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function EmployeeList() {
  const columns: ColumnDef<Employee>[] = useMemo(() => {
    return [
      {
        id: 'drag',
        cell: ({ row }) => <DataGridTableDndRowHandle rowId={row.id} />,
        size: 50,
      },
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
                className="text-mono hover:text-primary-active mb-px text-sm font-medium"
              >
                {row.original.fullname}
              </Link>
              <span className="text-muted-foreground text-xs font-normal">
                {row.original.job?.job_name}
              </span>
              {/* <span
                className="text-primary cursor-pointer"
                onClick={handleEmployeeDetailsOpen}
              >
                {row.original.guid}
              </span> */}
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
            <div className="font-normal">{row.original.nickname}</div>
            <div className="text-muted-foreground text-xs">
              {row.original.email}
            </div>
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
            <div className="font-normal">{row.original.outlet?.outlet_name}</div>
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
    status: parseAsString
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
  const [openFilter, setOpenFilter] = useState<boolean>(false)

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
  const [data, setData] = useState<Employee[]>([])

  const dataIds = useMemo<UniqueIdentifier[]>(() => data?.map(({ guid }) => guid as UniqueIdentifier), [data]);

  // const data = useMemo(() => {
  //   return userData?.response?.data ?? [];
  // }, [userData]);

  useEffect(() => {
    setData(userData?.response?.data ?? [])
  }, [userData?.response?.data])

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  };

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
          rowsDraggable: true
        }}
        isLoading={isLoading || isFetching}
      >
        <Card>
        <CardHeader>
            <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
              <CardHeading className="py-[15px]">
                <div className="flex items-center gap-2.5">
                  <div>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline">
                        <Filter />
                        {sortOrder !== "latest" && (
                          <Badge size="sm" variant="outline">
                            {sortOrder.charAt(0).toUpperCase() +
                              sortOrder.slice(1)}
                          </Badge>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      placeholder="Search..."
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
                  <div className="relative">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outlet_1">Outlet 1</SelectItem>
                        <SelectItem value="outlet_2">Outlet 2</SelectItem>
                        <SelectItem value="outlet_3">Outlet 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <ToggleGroup value={filter.status || "all"} type="single" variant="outline" 
                      onValueChange={(value) => setFilter({ ...filter, status: value || "all" })}
                    >
                      <ToggleGroupItem value="all">All</ToggleGroupItem>
                      <ToggleGroupItem value="active">Active</ToggleGroupItem>
                      <ToggleGroupItem value="inactive">Not Active</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="flex items-center gap-2.5 py-[10px]">
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brand_1">Brand 1</SelectItem>
                          <SelectItem value="brand_2">Brand 2</SelectItem>
                          <SelectItem value="brand_3">Brand 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sub Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sub_brand_1">Sub Brand 1</SelectItem>
                          <SelectItem value="sub_brand_2">Sub Brand 2</SelectItem>
                          <SelectItem value="sub_brand_3">Sub Brand 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Job" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job_1">Job 1</SelectItem>
                          <SelectItem value="job_2">Job 2</SelectItem>
                          <SelectItem value="job_3">Job 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="department_1">Department 1</SelectItem>
                          <SelectItem value="department_2">Department 2</SelectItem>
                          <SelectItem value="department_3">Department 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gender_1">Gender 1</SelectItem>
                          <SelectItem value="gender_2">Gender 2</SelectItem>
                          <SelectItem value="gender_3">Gender 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Marital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marital_1">Marital 1</SelectItem>
                          <SelectItem value="marital_2">Marital 2</SelectItem>
                          <SelectItem value="marital_3">Marital 3</SelectItem>
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
              <DataGridTableDndRows handleDragEnd={handleDragEnd} dataIds={dataIds}/>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination setFilter={setFilter} filter={filter} />
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
