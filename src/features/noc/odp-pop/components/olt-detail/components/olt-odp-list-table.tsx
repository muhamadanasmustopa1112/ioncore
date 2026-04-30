"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter, Plus, Search, X, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTable,
  CardHeader,
  CardHeading,
  CardFooter,
  CardToolbar,
} from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RiRouterLine } from "@remixicon/react";
import { columns } from "../../details/list/table/columns_odp";
import { OdpDialog } from "../../form/add-odp-dialog";
import { useOdpStore } from "../../../store/odp";
import { OdpResponse, OdpFilter } from "../../../types/odp";

interface OltOdpListTableProps {
  data?: OdpResponse;
  isLoading?: boolean;
  filter: OdpFilter;
  setFilter: (
    values: Partial<OdpFilter> | ((old: OdpFilter) => OdpFilter)
  ) => void;
}

export function OltOdpListTable({
  data: odpResponse,
  isLoading,
  filter,
  setFilter
}: OltOdpListTableProps) {
  const { openOdpFormSheet } = useOdpStore();
  const data = useMemo(() => odpResponse?.data || [], [odpResponse]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    pageCount: odpResponse?.metadata?.total_page || 0,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={odpResponse?.metadata?.total_data || 0}
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
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden mt-8">
        <CardHeader className="flex-col items-stretch pt-6 pb-2 px-6">
          <div className="flex items-center justify-between mb-4">
            <CardHeading className="flex items-center gap-3 text-lg font-black tracking-tight text-foreground uppercase">
              <RiRouterLine className="size-5 text-primary" />
              List ODP
            </CardHeading>
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8" onClick={() => openOdpFormSheet("new")}>
                <Plus className="size-4" />
                Add ODP
              </Button>
              <OdpDialog />
            </div>

          </div>

          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="size-3" />
                  </Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Search ODP..."
                    value={filter.search || ""}
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

              <CardToolbar>
                <DataGridColumnVisibility
                  table={table}
                  trigger={
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings2 className="size-3" />
                      View
                    </Button>
                  }
                />
              </CardToolbar>
            </div>

            <CollapsibleContent className="border-t border-border/50 mt-4 pt-4">
              <div className="text-xs text-muted-foreground italic">
                Advanced filters coming soon...
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

        <CardFooter className="bg-card border-t border-border/40 p-4">
          <DataGridPagination setFilter={setFilter} filter={filter} />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
