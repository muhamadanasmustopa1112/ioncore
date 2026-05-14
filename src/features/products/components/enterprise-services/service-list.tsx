"use client";

import { useState, useMemo } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, RowSelectionState } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { RiAddLine } from "@remixicon/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAdminEnterpriseServices, useDeleteEnterpriseService } from "../../api/products-queries";
import type { EnterpriseService } from "../../types/products";
import { getServiceColumns } from "./service-columns";
import { ServiceSheet } from "./service-sheet";

export function ServiceList() {
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data, isLoading } = useAdminEnterpriseServices({
    name: filter.search || undefined,
    page: filter.page,
    per_page: filter.limit,
  });

  const deleteService = useDeleteEnterpriseService();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit" | "details">("new");
  const [selected, setSelected] = useState<EnterpriseService | null>(null);

  const openNew = () => { setMode("new"); setSelected(null); setSheetOpen(true); };
  const openEdit = (row: EnterpriseService) => { setMode("edit"); setSelected(row); setSheetOpen(true); };
  const openDetail = (row: EnterpriseService) => { setMode("details"); setSelected(row); setSheetOpen(true); };
  const handleClose = () => { setSheetOpen(false); setSelected(null); };

  const services = data?.enterprise_services ?? [];
  const total = data?.metadata?.total ?? 0;

  const setPagination = (updater: (prev: { page: number; limit: number }) => { page: number; limit: number }) => {
    const next = updater({ page: filter.page, limit: filter.limit });
    setFilter({ page: next.page, limit: next.limit });
  };

  const columns = useMemo(
    () => getServiceColumns(openEdit, openDetail, (id) => deleteService.mutate(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useReactTable({
    columns,
    data: services,
    manualPagination: true,
    pageCount: Math.ceil(total / filter.limit),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination: { pageIndex: filter.page - 1, pageSize: filter.limit },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <DataGrid table={table} recordCount={total} tableLayout={{ columnsResizable: true, cellBorder: true }} isLoading={isLoading}>
        <Card className="mt-3">
          <CardHeader>
            <CardHeading className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search service..."
                    value={filter.search || ""}
                    onChange={(e) => setFilter({ search: e.target.value || null, page: 1 })}
                    className="ps-9 w-full"
                  />
                  {filter.search && (
                    <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setFilter({ search: null, page: 1 })}>
                      <X />
                    </Button>
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
            <DataGridPagination
              filter={{ page: filter.page, limit: filter.limit }}
              setFilter={setPagination}
            />
          </CardFooter>
        </Card>
      </DataGrid>
      <ServiceSheet open={sheetOpen} mode={mode} selected={selected} onClose={handleClose} />
    </>
  );
}
