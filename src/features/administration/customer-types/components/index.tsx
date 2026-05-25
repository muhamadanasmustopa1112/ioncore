"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { RiAddLine, RiUserSettingsLine } from "@remixicon/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useCustomerTypeList, useDeleteCustomerType } from "../api/customer-types-queries";
import type { CustomerType } from "../types";
import { useCustomerTypeColumns } from "./list/columns";
import { CustomerTypeFormSheet } from "./form/customer-type-form-sheet";

export function CustomerTypesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useCustomerTypeList({
    search: filter.search || undefined,
    page: filter.page,
    size: filter.limit,
  });

  const deleteType = useDeleteCustomerType();

  const items = data?.items ?? [];
  const total = data?.meta?.total ?? 0;

  const setPagination = (updater: (prev: { page: number; limit: number }) => { page: number; limit: number }) => {
    const next = updater({ page: filter.page, limit: filter.limit });
    setFilter({ page: next.page, limit: next.limit });
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [selected, setSelected] = useState<CustomerType | null>(null);

  const openNew = () => { setMode("new"); setSelected(null); setSheetOpen(true); };
  const openEdit = (row: CustomerType) => { setMode("edit"); setSelected(row); setSheetOpen(true); };
  const handleClose = () => { setSheetOpen(false); setSelected(null); };

  const columns = useCustomerTypeColumns(openEdit, (id) => deleteType.mutate(id));

  const table = useReactTable({
    columns,
    data: items,
    manualPagination: true,
    pageCount: Math.ceil(total / filter.limit),
    getRowId: (row) => row.id,
    state: { pagination: { pageIndex: filter.page - 1, pageSize: filter.limit } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: t("administration.customerTypesPage.breadcrumbAdmin"), path: paths.dashboard.administration.branch.root.getHref() },
          { title: t("administration.customerTypesPage.breadcrumbTitle") },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("administration.customerTypesPage.title")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <RiUserSettingsLine className="size-3.5" />
              {total} {t("administration.customerTypesPage.totalTypes")}
            </Badge>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="primary"
            className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
            onClick={openNew}
          >
            <RiAddLine className="size-4 sm:size-5" />
            {t("administration.customerTypesPage.newType")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4">
        <DataGrid table={table} recordCount={total} tableLayout={{ columnsResizable: true, cellBorder: true }} isLoading={isLoading}>
          <Card className="mt-3">
            <CardHeader>
              <CardHeading className="py-3">
                <div className="relative max-w-sm">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    className="ps-9"
                    placeholder={t("administration.customerTypesPage.searchPlaceholder")}
                    value={filter.search ?? ""}
                    onChange={(e) =>
                      setFilter({ search: e.target.value || null, page: 1, limit: filter.limit })
                    }
                  />
                </div>
              </CardHeading>
            </CardHeader>
            <CardTable>
              <ScrollArea>
                <DataGridContainer>
                  <DataGridTable />
                </DataGridContainer>
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
      </div>

      <CustomerTypeFormSheet
        open={sheetOpen}
        mode={mode}
        selected={selected}
        onClose={handleClose}
      />
    </div>
  );
}
