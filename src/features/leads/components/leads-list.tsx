"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Settings2, X } from "lucide-react";
import { RiArrowRightUpLine } from "@remixicon/react";
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
import { useAdminLeads } from "../api/leads-queries";
import type { LeadDto, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";

function LeadsViewToggle() {
  const { table } = useDataGrid();
  return (
    <DataGridColumnVisibility
      table={table}
      trigger={
        <Button variant="outline">
          <Settings2 className="size-4" />
          View
        </Button>
      }
    />
  );
}

const STATUS_VARIANT: Record<LeadStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "destructive",
  converted: "success",
  lost: "secondary",
  potential: "warning",
};

const PAGE_SIZE = 25;

export function LeadsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const [rerouteLead, setRerouteLead] = useState<LeadDto | null>(null);

  const { data, isLoading } = useAdminLeads({
    name: search || undefined,
    page,
    per_page: PAGE_SIZE,
  });

  const leads = data?.leads ?? [];
  const total = data?.metadata?.total ?? 0;

  const columns = useMemo<ColumnDef<LeadDto>[]>(() => [
    {
      id: "lead_name",
      accessorKey: "lead_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Name" className="font-semibold" />,
      cell: ({ row }) => (
        <Button asChild variant="ghost" mode="link" size="sm" className="font-medium text-foreground">
          <Link href={paths.dashboard.crmAndSales.leads.detail.getHref(row.original.id)}>
            {row.original.lead_name}
          </Link>
        </Button>
      ),
      size: 200,
    },
    {
      id: "lead_type",
      accessorKey: "lead_type",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Type" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm capitalize">
          {row.original.lead_type} / {row.original.customer_sub_type}
        </span>
      ),
      size: 160,
    },
    {
      id: "source",
      accessorKey: "source",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Source" className="font-semibold" />,
      cell: ({ row }) => <span className="text-muted-foreground text-sm capitalize">{row.original.source.replace("_", " ")}</span>,
      size: 130,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Status" className="font-semibold" />,
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status] ?? "secondary"} appearance="light" size="md">
          {row.original.status}
        </Badge>
      ),
      size: 110,
    },
    {
      id: "branch_id",
      accessorKey: "branch_id",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Branch ID" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {row.original.branch_id}
        </span>
      ),
      size: 240,
    },
    {
      id: "cable_distance_meters",
      accessorKey: "cable_distance_meters",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Cable (m)" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.cable_distance_meters ?? "—"}
          {row.original.is_excess_cable_accepted && " (excess ok)"}
        </span>
      ),
      size: 110,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Created" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => <span className="text-[0.8125rem] font-semibold text-accent-foreground">Action</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" mode="link" size="sm">
            <Link href={paths.dashboard.crmAndSales.leads.detail.getHref(row.original.id)}>
              Detail
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRerouteLead(row.original)}
            className="gap-1 text-xs"
          >
            <RiArrowRightUpLine className="size-3.5" />
            Reroute
          </Button>
        </div>
      ),
      size: 150,
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    columns,
    data: leads,
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
      setPage(next.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <PageBreadcrumb
        items={[
          { title: "CRM & Sales", path: paths.dashboard.crmAndSales.root.getHref() },
          { title: "Leads" },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Leads
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" onClick={() => router.push(paths.dashboard.crmAndSales.leads.create.getHref())} className="font-semibold">
            <Plus className="size-4" />
            Create Lead
          </Button>
        </ToolbarActions>
      </Toolbar>

      <DataGrid table={table} isLoading={isLoading} recordCount={total}>
        <DataGridContainer>
          <Card>
            <CardHeader>
              <CardHeading>
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name…"
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
                      onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </CardHeading>
              <LeadsViewToggle />
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

      <RerouteLeadSheet
        lead={rerouteLead}
        open={!!rerouteLead}
        onClose={() => setRerouteLead(null)}
      />
    </div>
  );
}
