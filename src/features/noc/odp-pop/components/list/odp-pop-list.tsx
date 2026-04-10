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
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
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
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { PopData } from "../../types/odp-pop";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";

export function OdpPopList({ 
  onPopSelect 
}: { 
  onPopSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });

  const data = DUMMY_POP_DATA;

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    columns,
    data,
    meta: {
      onPopSelect,
    },
    pageCount: Math.ceil(data.length / (filter.limit || 10)),
    getRowId: (row) => row.id,
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
      recordCount={data.length}
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
      isLoading={false}
    >
      <Card className="mt-0">
        <CardHeader className="flex-col items-stretch pt-4 pb-2 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="size-3" />
                  </Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Search Router..."
                    value={filter.search || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    className="h-8 w-32 ps-9 text-xs"
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
              {/* <CustomerAdvancedFilter /> */}
              Filter Test
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
        <CardFooter>
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
