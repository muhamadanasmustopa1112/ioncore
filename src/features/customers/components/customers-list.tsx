"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Plus, Search, Settings2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid, DataGridContainer, useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { useCustomerList } from "../api/customers-queries";
import type { CustomerDto, CustomerStatus } from "../types/customers-api";
import "@/i18n";

function CustomersViewToggle() {
  const { t } = useTranslation();
  const { table } = useDataGrid();
  return (
    <DataGridColumnVisibility
      table={table}
      trigger={
        <Button variant="outline">
          <Settings2 className="size-4" />
          {t("common.view")}
        </Button>
      }
    />
  );
}


const STATUS_VARIANT: Record<CustomerStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  pending: "warning",
  active: "success",
  suspended: "warning",
  deactivated: "secondary",
  churned: "destructive",
};

const PAGE_SIZE = 25;

export function CustomersList() {
  const { t } = useTranslation();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [searchInput, setSearchInput] = useState(search);
  const router = useRouter();

  const { data, isLoading } = useCustomerList({
    search: search || undefined,
    page,
    size: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const total = data?.meta?.total ?? 0;

  const columns = useMemo<ColumnDef<CustomerDto>[]>(() => [
    {
      id: "full_name",
      accessorKey: "full_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("customers.fullName")} className="font-semibold" />,
      cell: ({ row }) => (
        <Button asChild variant="ghost" mode="link" size="sm" className="font-medium text-foreground">
          <Link href={paths.dashboard.crmAndSales.customer.detail.getHref(row.original.id)}>
            {row.original.full_name}
          </Link>
        </Button>
      ),
      size: 200,
    },
    {
      id: "customer_type",
      accessorKey: "customer_type",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("common.type")} className="font-semibold" />,
      cell: ({ row }) => {
        const type = row.original.customer_type;
        const cls =
          type === "residential"
            ? "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : type === "business"
              ? "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
              : "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        return <span className={cls}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
      },
      size: 130,
    },
    {
      id: "nik",
      accessorKey: "nik",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("customers.nik")} className="font-semibold" />,
      cell: ({ row }) => (
        <span className={row.original.nik ? "font-mono text-xs" : "text-muted-foreground/40"}>
          {row.original.nik ?? "—"}
        </span>
      ),
      size: 180,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("common.status")} className="font-semibold" />,
      cell: ({ row }) => {
        const statusKey = row.original.status;
        const translatedStatus = t(`customers.statusLabels.${statusKey}`, { defaultValue: statusKey });
        return (
          <Badge variant={STATUS_VARIANT[row.original.status] ?? "secondary"} appearance="light" size="md">
            {translatedStatus}
          </Badge>
        );
      },
      size: 110,
    },
    {
      id: "branch_id",
      accessorKey: "branch_id",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("customers.branch")} className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.branch_name ?? row.original.branch_id}
        </span>
      ),
      size: 200,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => <DataGridColumnHeader column={column} title={t("common.createdAt")} className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => <span className="text-[0.8125rem] font-semibold text-accent-foreground">{t("common.action")}</span>,
      cell: ({ row }) => (
        <Button asChild variant="ghost" mode="link" size="sm">
          <Link href={paths.dashboard.crmAndSales.customer.detail.getHref(row.original.id)}>
            {t("common.details")}
          </Link>
        </Button>
      ),
      size: 80,
      enableSorting: false,
    },
  ], [t]);

  const table = useReactTable({
    columns,
    data: items,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    rowCount: total,
    manualPagination: true,
    manualFiltering: true,
    getRowId: (row) => row.id,
    state: {
      pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: page - 1, pageSize: PAGE_SIZE })
        : updater;
      void setPage(next.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const applySearch = () => {
    void setSearch(searchInput.trim());
    void setPage(1);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.crmAndSales"), path: paths.dashboard.crmAndSales.root.getHref() },
          { title: t("customers.title") },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("customers.title")}
          </ToolbarTitle>
        </ToolbarHeading>
        {/* <ToolbarActions>
          <Button variant="primary" onClick={() => router.push(paths.dashboard.crmAndSales.customer.create.getHref())} className="font-semibold">
            <Plus className="size-4" />
            Create Customer
          </Button>
        </ToolbarActions> */}
      </Toolbar>

      <DataGrid table={table} isLoading={isLoading} recordCount={total}>
        <DataGridContainer>
          <Card>
            <CardHeader>
              <CardHeading>
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("customers.searchByName")}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applySearch()}
                    className="ps-9 w-60"
                  />
                  {searchInput && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                      onClick={() => { setSearchInput(""); void setSearch(""); void setPage(1); }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </CardHeading>
              <CustomersViewToggle />
            </CardHeader>
            <CardTable>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
            <CardFooter>
              <DataGridPagination />
            </CardFooter>
          </Card>
        </DataGridContainer>
      </DataGrid>

    </div>
  );
}
