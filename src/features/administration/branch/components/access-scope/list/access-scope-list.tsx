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
import { AccessScopeData } from "../../../types/access-scope";
import { columns } from "./table/columns";

const DUMMY_SCOPES: AccessScopeData[] = [
  {
    id: "as-001",
    subjectType: "role",
    subjectName: "Regional Manager",
    subjectCode: "ROLE-REG-MGR",
    branchScope: ["DKI Jakarta", "Jawa Barat", "Jawa Tengah"],
    scopeLevel: "regional",
    permissionLevel: "full",
    canCrossBranch: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "as-002",
    subjectType: "role",
    subjectName: "Area Manager",
    subjectCode: "ROLE-AREA-MGR",
    branchScope: ["Jakarta Barat", "Jakarta Timur", "Jakarta Selatan"],
    scopeLevel: "area",
    permissionLevel: "admin",
    canCrossBranch: false,
    isActive: true,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
  {
    id: "as-003",
    subjectType: "user",
    subjectName: "Rina Wulandari",
    subjectCode: "EMP-OPS-045",
    branchScope: ["Jakarta Barat"],
    scopeLevel: "area",
    permissionLevel: "write",
    canCrossBranch: false,
    isActive: true,
    createdAt: "2026-01-20T07:30:00Z",
    updatedAt: "2026-01-20T07:30:00Z",
  },
  {
    id: "as-004",
    subjectType: "role",
    subjectName: "Team Leader",
    subjectCode: "ROLE-TL",
    branchScope: ["Ciracas", "Bambu Apus"],
    scopeLevel: "sub_area",
    permissionLevel: "write",
    canCrossBranch: true,
    isActive: true,
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-03-10T11:00:00Z",
  },
  {
    id: "as-005",
    subjectType: "user",
    subjectName: "Hendra Gunawan",
    subjectCode: "EMP-NOC-012",
    branchScope: ["Jakarta Timur", "Jakarta Pusat"],
    scopeLevel: "area",
    permissionLevel: "read",
    canCrossBranch: false,
    isActive: true,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "as-006",
    subjectType: "role",
    subjectName: "Super Admin",
    subjectCode: "ROLE-SUPERADMIN",
    branchScope: [],
    scopeLevel: "all",
    permissionLevel: "full",
    canCrossBranch: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "as-007",
    subjectType: "user",
    subjectName: "Farhan Pratama",
    subjectCode: "EMP-SALES-031",
    branchScope: ["Gambir"],
    scopeLevel: "sub_area",
    permissionLevel: "write",
    canCrossBranch: false,
    isActive: false,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-04-01T09:00:00Z",
  },
];

export function AccessScopeList() {
  const [data] = useState<AccessScopeData[]>(DUMMY_SCOPES);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.subjectName.toLowerCase().includes(q) ||
        r.subjectCode.toLowerCase().includes(q) ||
        r.branchScope.some((b) => b.toLowerCase().includes(q)) ||
        r.permissionLevel.toLowerCase().includes(q)
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
                placeholder="Search access scopes..."
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
