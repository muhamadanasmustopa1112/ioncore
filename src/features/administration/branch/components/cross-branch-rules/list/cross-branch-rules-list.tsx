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
import { CrossBranchRuleData } from "../../../types/cross-branch-rules";
import { columns } from "./table/columns";

const DUMMY_RULES: CrossBranchRuleData[] = [
  {
    id: "cbr-001",
    name: "Overflow Dispatch — Jakarta Barat → Jakarta Pusat",
    description: "Allow technicians from Jakarta Barat to handle overflow WOs in Jakarta Pusat",
    ruleType: "dispatch",
    sourceBranch: "Jakarta Barat",
    targetBranch: "Jakarta Pusat",
    condition: "Queue > 5 pending WOs",
    requiresApproval: true,
    approvalLevel: "Team Leader",
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-03-10T10:30:00Z",
  },
  {
    id: "cbr-002",
    name: "Shared Warehouse — DKI Jakarta → Jakarta Timur",
    description: "Sub areas under Jakarta Timur draw stock from DKI Jakarta Regional warehouse",
    ruleType: "inventory",
    sourceBranch: "DKI Jakarta (Regional)",
    targetBranch: "Jakarta Timur",
    condition: "Local stock < threshold",
    requiresApproval: false,
    approvalLevel: "",
    isActive: true,
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-02-05T14:00:00Z",
  },
  {
    id: "cbr-003",
    name: "Cross-Area Sales Lead Transfer",
    description: "Sales rep in Jakarta Selatan may pursue leads in Depok area during off-peak",
    ruleType: "sales",
    sourceBranch: "Jakarta Selatan",
    targetBranch: "Depok",
    condition: "Sales pipeline < 10 active leads",
    requiresApproval: true,
    approvalLevel: "Sales Manager",
    isActive: true,
    createdAt: "2026-02-01T07:30:00Z",
    updatedAt: "2026-02-01T07:30:00Z",
  },
  {
    id: "cbr-004",
    name: "NOC Escalation — Sub Area → Area",
    description: "If no NOC at Sub Area level, monitoring escalates to Area NOC",
    ruleType: "noc",
    sourceBranch: "Ciracas (Sub Area)",
    targetBranch: "Jakarta Timur",
    condition: "Sub Area NOC unavailable",
    requiresApproval: false,
    approvalLevel: "",
    isActive: true,
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-03-15T08:45:00Z",
  },
  {
    id: "cbr-005",
    name: "Technician Overflow — Bandung Barat → Bandung Kota",
    description: "Senior technicians from Bandung Barat assist Bandung Kota on high-priority WOs",
    ruleType: "dispatch",
    sourceBranch: "Bandung Barat",
    targetBranch: "Bandung Kota",
    condition: "Priority P1 WOs unassigned > 30 min",
    requiresApproval: true,
    approvalLevel: "NOC Manager",
    isActive: false,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-20T09:00:00Z",
  },
];

export function CrossBranchRulesList() {
  const [data] = useState<CrossBranchRuleData[]>(DUMMY_RULES);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.ruleType.toLowerCase().includes(q) ||
        r.sourceBranch.toLowerCase().includes(q) ||
        r.targetBranch.toLowerCase().includes(q)
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
                placeholder="Search rules..."
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
