"use client";

import { useState, useMemo } from "react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, RowSelectionState } from "@tanstack/react-table";
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
import { useAdminEnterpriseServices, useDeleteEnterpriseService } from "../../api/products-queries";
import type { EnterpriseService } from "../../types/products";
import { getServiceColumns } from "./service-columns";
import { ServiceSheet } from "./service-sheet";

export function ServiceList() {
  const { data, isLoading } = useAdminEnterpriseServices();
  const deleteService = useDeleteEnterpriseService();

  const [pagination, setPagination] = useState({ limit: 10, page: 1 });
  const [search, setSearch] = useQueryStates({ es_search: parseAsString });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit" | "details">("new");
  const [selected, setSelected] = useState<EnterpriseService | null>(null);

  const openNew = () => { setMode("new"); setSelected(null); setSheetOpen(true); };
  const openEdit = (row: EnterpriseService) => { setMode("edit"); setSelected(row); setSheetOpen(true); };
  const openDetail = (row: EnterpriseService) => { setMode("details"); setSelected(row); setSheetOpen(true); };
  const handleClose = () => { setSheetOpen(false); setSelected(null); };

  const services = data?.enterprise_services ?? [];

  const filtered = useMemo(() => {
    if (!search.es_search) return services;
    const q = search.es_search.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q));
  }, [services, search.es_search]);

  const columns = useMemo(
    () => getServiceColumns(openEdit, openDetail, (id) => deleteService.mutate(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useReactTable({
    columns, data: filtered,
    pageCount: Math.ceil(filtered.length / pagination.limit),
    getRowId: (row) => row.id,
    state: { rowSelection }, enableRowSelection: true, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(),
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
                  <Input placeholder="Search service..." value={search.es_search || ""} onChange={(e) => setSearch({ es_search: e.target.value })} className="ps-9 w-full" />
                  {search.es_search && (
                    <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setSearch({ es_search: "" })}><X /></Button>
                  )}
                </div>
                <Button variant="primary" className="h-9 px-4 text-sm font-semibold" onClick={openNew}>
                  <RiAddLine className="size-4" /> Add Service
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
      <ServiceSheet open={sheetOpen} mode={mode} selected={selected} onClose={handleClose} />
    </>
  );
}
