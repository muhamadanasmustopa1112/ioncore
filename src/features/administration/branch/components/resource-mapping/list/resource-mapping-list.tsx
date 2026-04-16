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
import { ResourceMappingData } from "../../../types/resource-mapping";
import { columns } from "./table/columns";

const DUMMY_MAPPINGS: ResourceMappingData[] = [
  {
    id: "rm-001",
    resourceType: "sales_rep",
    resourceName: "Budi Santoso",
    resourceCode: "EMP-SR-001",
    branchId: "br-area-001",
    branchName: "Jakarta Barat",
    scopeLevel: "area",
    servesMultiple: false,
    additionalBranches: [],
    isActive: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "rm-002",
    resourceType: "team_leader",
    resourceName: "Andi Prasetyo",
    resourceCode: "EMP-TL-012",
    branchId: "br-sub-001",
    branchName: "Ciracas (Sub Area)",
    scopeLevel: "sub_area",
    servesMultiple: true,
    additionalBranches: ["Bambu Apus"],
    isActive: true,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-02-20T11:30:00Z",
  },
  {
    id: "rm-003",
    resourceType: "warehouse",
    resourceName: "Gudang Utama DKI",
    resourceCode: "WH-REG-001",
    branchId: "br-reg-001",
    branchName: "DKI Jakarta (Regional)",
    scopeLevel: "regional",
    servesMultiple: true,
    additionalBranches: ["Jakarta Barat", "Jakarta Pusat", "Jakarta Timur"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "rm-004",
    resourceType: "noc",
    resourceName: "NOC Jakarta Timur",
    resourceCode: "NOC-AREA-002",
    branchId: "br-area-002",
    branchName: "Jakarta Timur",
    scopeLevel: "area",
    servesMultiple: false,
    additionalBranches: [],
    isActive: true,
    createdAt: "2026-01-20T07:00:00Z",
    updatedAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "rm-005",
    resourceType: "sales_rep",
    resourceName: "Dewi Kurniawati",
    resourceCode: "EMP-SR-007",
    branchId: "br-sub-003",
    branchName: "Gambir (Sub Area)",
    scopeLevel: "sub_area",
    servesMultiple: false,
    additionalBranches: [],
    isActive: true,
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "rm-006",
    resourceType: "warehouse",
    resourceName: "Gudang Bandung",
    resourceCode: "WH-AREA-003",
    branchId: "br-area-005",
    branchName: "Bandung Kota",
    scopeLevel: "area",
    servesMultiple: true,
    additionalBranches: ["Bandung Barat"],
    isActive: false,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-04-10T14:00:00Z",
  },
];

export function ResourceMappingList() {
  const [data] = useState<ResourceMappingData[]>(DUMMY_MAPPINGS);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.resourceName.toLowerCase().includes(q) ||
        r.resourceCode.toLowerCase().includes(q) ||
        r.branchName.toLowerCase().includes(q) ||
        r.resourceType.toLowerCase().includes(q)
    );
  }, [data, search]);

  const table = useReactTable({
    columns,
    data: filteredData,
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
      recordCount={filteredData.length}
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
                placeholder="Search resources..."
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
