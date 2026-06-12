"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { AlertCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchScope } from "@/hooks/use-branch-scope";
import { useWorkOrderList } from "../api/work-order-queries";
import { useWorkOrderStore } from "../store/work-order";
import { useRegionalList, useAreaList } from "@/features/administration/branch/api/branch-queries";
import type { WorkOrder, WoType, WoStatus } from "../types/work-order";
import {
  WO_TYPE_LABELS,
  WO_STATUS_LABELS,
  WO_STATUS_VARIANTS,
  WO_PRIORITY_LABELS,
  WO_PRIORITY_VARIANTS,
} from "../types/work-order";

export function WorkOrderList() {
  const openSheet = useWorkOrderStore((s) => s.openSheet);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [subAreaFilter, setSubAreaFilter] = useState<string>("all");

  const { data: regionals } = useRegionalList();
  const { data: areas } = useAreaList(areaFilter !== "all" ? areaFilter : "");

  const { showBranchFilter } = useBranchScope("work_orders");

  const filters = useMemo(
    () => ({
      status: statusFilter !== "all" ? (statusFilter as WoStatus) : undefined,
      type: typeFilter !== "all" ? (typeFilter as WoType) : undefined,
      area_id: showBranchFilter && areaFilter !== "all" ? areaFilter : undefined,
      sub_area_id: showBranchFilter && subAreaFilter !== "all" ? subAreaFilter : undefined,
    }),
    [statusFilter, typeFilter, showBranchFilter, areaFilter, subAreaFilter],
  );

  const { data, isLoading, isError, refetch } = useWorkOrderList(filters);

  const workOrders = useMemo(() => data?.workOrders ?? [], [data?.workOrders]);

  const filtered = useMemo(() => {
    if (!search) return workOrders;
    const q = search.toLowerCase();
    return workOrders.filter(
      (wo) =>
        wo.title.toLowerCase().includes(q) ||
        wo.woNumber.toLowerCase().includes(q) ||
        wo.customerName.toLowerCase().includes(q) ||
        wo.serviceAddress.toLowerCase().includes(q)
    );
  }, [workOrders, search]);

  const columns = useMemo<ColumnDef<WorkOrder>[]>(
    () => [
      {
        accessorKey: "woNumber",
        header: "WO #",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.woNumber}</span>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="text-sm font-medium truncate">{row.original.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {row.original.customerName}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="text-xs">{WO_TYPE_LABELS[row.original.type]}</span>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge
            variant={WO_PRIORITY_VARIANTS[row.original.priority]}
            appearance="light"
            className="text-xs"
          >
            {WO_PRIORITY_LABELS[row.original.priority]}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={WO_STATUS_VARIANTS[row.original.status]}
            appearance="light"
            className="text-xs"
          >
            {WO_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: "technicianName",
        header: "Technician",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="text-sm">
              {row.original.technicianName ?? (
                <span className="text-muted-foreground text-xs">Unassigned</span>
              )}
            </span>
            {row.original.cross_area && (
              <Badge
                variant="warning"
                className="text-[9px] uppercase font-bold px-1.5 py-0 bg-amber-500/10 text-amber-600 border border-amber-500/20"
              >
                Cross Area
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "scheduledAt",
        header: "Scheduled",
        cell: ({ row }) =>
          row.original.scheduledAt ? (
            new Date(row.original.scheduledAt).toLocaleDateString("id-ID")
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => openSheet("detail", row.original)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => openSheet("edit", row.original)}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ],
    [openSheet]
  );

  const table = useReactTable({
    columns,
    data: filtered,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} isLoading={isLoading} recordCount={filtered.length}>
      <DataGridContainer>
        <Card>
          <CardHeader>
            <CardHeading>
              <CardToolbar>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="ps-9 w-56"
                    placeholder="Search WO..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {(["CREATED", "IN_PROGRESS", "DONE"] as WoStatus[]).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {WO_STATUS_LABELS[s]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select value={areaFilter} onValueChange={(v) => {
                  setAreaFilter(v);
                  setSubAreaFilter("all");
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {regionals?.map((r: any) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={subAreaFilter} 
                  onValueChange={setSubAreaFilter}
                  disabled={areaFilter === "all"}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sub Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub Areas</SelectItem>
                    {areas?.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {(
                      Object.entries(WO_TYPE_LABELS) as [WoType, string][]
                    ).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardToolbar>
            </CardHeading>
          </CardHeader>

          {isError && (
            <div className="flex items-center gap-2 px-5 py-3 text-sm text-destructive bg-destructive/5">
              <AlertCircle className="size-4 shrink-0" />
              Failed to load work orders.
              <button className="underline ml-1" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

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
      </DataGridContainer>
    </DataGrid>
  );
}
