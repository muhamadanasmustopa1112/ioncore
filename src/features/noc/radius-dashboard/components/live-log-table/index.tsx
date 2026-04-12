"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Filter, Search, X } from "lucide-react";

import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import {
  Card,
  CardHeader,
  CardHeading,
  CardTable,
  CardFooter
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RiHistoryLine } from "@remixicon/react";

import { radiusLogColumns } from "./columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { useRadiusDashboardStore } from "../../store/use-radius-dashboard-store";

export function RadiusLiveLogTable() {
  const { logs, isLoading } = useRadiusDashboardStore();

  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: logs,
    columns: radiusLogColumns,
    pageCount: Math.ceil(logs.length / (filter.limit || 10)),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={logs.length}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
        width: "auto",
      }}
      isLoading={isLoading}
    >
      <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden mt-8">
        <CardHeader className="flex-col items-stretch pt-6 pb-4 px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <RiHistoryLine className="size-4 text-primary" />
            </div>
            <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
              Live Authentication Logs
            </CardHeading>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-2">
                      <Filter className="size-3.5" />
                      Filter
                    </Button>
                  </CollapsibleTrigger>

                  <div className="relative">
                    <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      placeholder="Search Logs..."
                      value={filter.search || ""}
                      onChange={(e) =>
                        setFilter({ ...filter, search: e.target.value })
                      }
                      className="h-10 w-64 ps-9 text-xs font-semibold bg-muted/30 border-none rounded-xl"
                    />
                    {filter.search && (
                      <Button
                        mode="icon"
                        variant="ghost"
                        className="absolute end-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                        onClick={() => setFilter({ ...filter, search: "" })}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Collapsible>
            </div>

            <DataTableToolbar />
          </div>

          <Collapsible open={openFilter}>
            <CollapsibleContent className="border-t border-border/50 mt-4 py-4">
              <div className="text-xs font-bold text-muted-foreground bg-muted/20 p-4 rounded-2xl border-2 border-dashed border-border/50 text-center">
                Advanced log filters (NAS Client, MAC Address, Reason) will be available soon.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardTable className="p-0 border-t border-border/50">
          <ScrollArea>
            <DataGridContainer className="w-full">
              <div className="min-w-max">
                <DataGridTable />
              </div>
            </DataGridContainer>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>

        <CardFooter className="px-6 py-4 border-t border-border/50">
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
