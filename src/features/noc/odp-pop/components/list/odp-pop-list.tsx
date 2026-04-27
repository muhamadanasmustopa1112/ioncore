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
import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getPopColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { PopResponse } from "../../types/pop";

export function OdpPopList({
  onPopSelect,
  type = 'pop',
  data: popData,
  isLoading,
  filter,
  setFilter
}: {
  onPopSelect?: (id: string) => void;
  type?: 'pop' | 'odp';
  data?: PopResponse;
  isLoading?: boolean;
  filter: any;
  setFilter: (state: any) => void;
}) {
  const data = useMemo(() => popData?.data || [], [popData]);

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    columns: useMemo(() => getPopColumns(type), [type]),
    data,
    meta: {
      onPopSelect,
    },
    pageCount: Math.ceil((popData?.recordsTotal || 0) / (filter?.limit || 10)),
    getRowId: (row) => String(row.id),
    state: {
      rowSelection,
    },
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
      recordCount={popData?.recordsTotal || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        columnsResizable: true,
        cellBorder: true,
        width: "auto",
      }}
      tableClassNames={{
        base: "w-auto min-w-full",
      }}
      isLoading={isLoading}
    >
      <Card className="mt-0">
        <CardHeader className="flex-col items-stretch pt-4 pb-2 px-4 shadow-none border-none">
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Filter className="size-3.5 mr-2" />
                    <span className="text-xs">Filter</span>
                  </Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Search POP..."
                    value={filter?.search || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    className="h-8 w-48 ps-9 text-xs"
                  />
                  {filter.search && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 h-5 w-5 -translate-y-1/2"
                      onClick={() => setFilter({ ...filter, search: "" })}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
              </div>

              <DataTableToolbar />
            </div>

            <CollapsibleContent className="border-t border-border/50 mt-4 pt-4">
              <div className="p-4 text-center text-xs text-muted-foreground italic">
                Advanced filtering options will be available soon.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardTable className="p-0 border-t border-border/50">
          <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-max">
              <DataGridTable />
            </div>
          </div>
        </CardTable>
        <CardFooter className="py-3 mt-auto">
          <DataGridPagination
            setFilter={setFilter}
            filter={filter}
          />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
