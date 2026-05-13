"use client";

import { useState, useMemo } from "react";
import {
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, RowSelectionState,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQueryStates, parseAsString } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useAdminBroadbandPlans, useDeleteBroadbandPlan } from "../../api/products-queries";
import type { BroadbandPlan } from "../../types/products";
import { getPlanColumns } from "./plan-columns";
import { PlanSheet } from "./plan-sheet";

export function PlanList() {
  const [pagination, setPagination] = useState({ limit: 10, page: 1 });
  const [search, setSearch] = useQueryStates({ pl_search: parseAsString, pl_branch: parseAsString });

  const { data: branchesData } = useBranchList({ per_page: 200 });
  const branches = branchesData ?? [];

  const { data, isLoading } = useAdminBroadbandPlans(
    search.pl_branch ? { branch_id: search.pl_branch } : {}
  );
  const deletePlan = useDeleteBroadbandPlan();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit" | "details">("new");
  const [selected, setSelected] = useState<BroadbandPlan | null>(null);

  const openNew = () => { setMode("new"); setSelected(null); setSheetOpen(true); };
  const openEdit = (row: BroadbandPlan) => { setMode("edit"); setSelected(row); setSheetOpen(true); };
  const openDetail = (row: BroadbandPlan) => { setMode("details"); setSelected(row); setSheetOpen(true); };
  const handleClose = () => { setSheetOpen(false); setSelected(null); };

  const plans = data?.broadband_plans ?? [];

  const filtered = useMemo(() => {
    if (!search.pl_search) return plans;
    const q = search.pl_search.toLowerCase();
    return plans.filter((p) => p.name.toLowerCase().includes(q));
  }, [plans, search.pl_search]);

  const columns = useMemo(
    () => getPlanColumns(openEdit, openDetail, (id) => deletePlan.mutate(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useReactTable({
    columns,
    data: filtered,
    pageCount: Math.ceil(filtered.length / pagination.limit),
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
    <>
      <DataGrid table={table} recordCount={filtered.length} tableLayout={{ columnsResizable: true, cellBorder: true }} isLoading={isLoading}>
        <Card className="mt-3">
          <CardHeader>
            <CardHeading className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search plan..."
                    value={search.pl_search || ""}
                    onChange={(e) => setSearch({ pl_search: e.target.value })}
                    className="ps-9 w-full"
                  />
                  {search.pl_search && (
                    <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setSearch({ pl_search: "" })}>
                      <X />
                    </Button>
                  )}
                </div>
                <Select
                  value={search.pl_branch || "all"}
                  onValueChange={(v) => setSearch({ pl_branch: v === "all" ? null : v })}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All branches</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="primary" className="h-9 px-4 text-sm font-semibold" onClick={openNew}>
                  <RiAddLine className="size-4" /> Add Plan
                </Button>
              </div>
            </CardHeading>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridContainer className="w-full"><DataGridTable /></DataGridContainer>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination setFilter={setPagination} filter={pagination} />
          </CardFooter>
        </Card>
      </DataGrid>
      <PlanSheet open={sheetOpen} mode={mode} selected={selected} onClose={handleClose} />
    </>
  );
}
