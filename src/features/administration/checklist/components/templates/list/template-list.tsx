"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Search, X } from "lucide-react";
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
import {
  useTemplateList,
  useCloneTemplate,
  usePublishTemplate,
  useDeleteTemplate,
} from "../../../api/checklist-template-queries";
import { useChecklistTemplateStore } from "../../../store/checklist-template";
import { buildColumns } from "./table/columns";
import type { ChecklistTemplate } from "../../../types/checklist-template";

export function TemplateList() {
  const { data: templates = [], isLoading, isError, refetch } = useTemplateList();
  const [search, setSearch] = useState("");

  const openSheet = useChecklistTemplateStore((s) => s.openSheet);
  const cloneTemplate = useCloneTemplate();
  const publishTemplate = usePublishTemplate();
  const deleteTemplate = useDeleteTemplate();

  const filtered = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t) =>
        t.schemaName.toLowerCase().includes(q) ||
        t.productType.toLowerCase().includes(q) ||
        t.woType.toLowerCase().includes(q),
    );
  }, [templates, search]);

  const columns = useMemo(
    () =>
      buildColumns({
        onEdit: (t: ChecklistTemplate) => openSheet("edit", t),
        onView: (t: ChecklistTemplate) => openSheet("details", t),
        onClone: (id: string) => cloneTemplate.mutate(id),
        onPublish: (id: string) => publishTemplate.mutate(id),
        onArchive: (id: string) => deleteTemplate.mutate(id),
      }),
    [openSheet, cloneTemplate, publishTemplate, deleteTemplate],
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
    <DataGrid
      table={table}
      recordCount={filtered.length}
      tableLayout={{
        columnsPinnable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
        rowBorder: true,
      }}
      isLoading={isLoading && !isError}
      emptyMessage={
        isError ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <AlertCircle className="size-8 text-destructive opacity-70" />
            <p className="text-sm font-medium text-destructive">Failed to load templates</p>
            <button onClick={() => refetch()} className="mt-1 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Retry
            </button>
          </div>
        ) : (
          "No checklist templates found"
        )
      }
    >
      <Card className="mt-[10px]">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-9"
              />
              {search && (
                <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setSearch("")}>
                  <X />
                </Button>
              )}
            </div>
          </CardHeading>
          <CardToolbar>
            <DataGridColumnVisibility table={table} trigger={<Button variant="outline"><Search className="size-4" />View</Button>} />
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
