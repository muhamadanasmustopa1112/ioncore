"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Eye, MoreHorizontal, Plus, Search, Settings2, X } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGrid, DataGridContainer, useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useAdminLeads } from "../api/leads-queries";
import type { LeadDto, LeadSource, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";

const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "potential", label: "Potential" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
  { value: "active", label: "Active" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold Call" },
  { value: "website", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "social_media_dm", label: "Social Media DM" },
  { value: "voip_call", label: "VoIP Call" },
  { value: "line_call", label: "Line Call" },
  { value: "walk_in", label: "Walk In" },
  { value: "event", label: "Event" },
  { value: "partner", label: "Partner" },
  { value: "cs_referral", label: "CS Referral" },
];

function LeadsViewToggle() {
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

const STATUS_VARIANT: Record<LeadStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "destructive",
  converted: "success",
  lost: "destructive",
  potential: "warning",
};

const PAGE_SIZE = 25;

export function LeadsList() {
  const { t } = useTranslation();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));
  const [branchFilter, setBranchFilter] = useQueryState("branch_id", parseAsString.withDefault(""));
  const [sourceFilter, setSourceFilter] = useQueryState("source", parseAsString.withDefault(""));
  const [searchInput, setSearchInput] = useState(search);
  const router = useRouter();
  const [rerouteLead, setRerouteLead] = useState<LeadDto | null>(null);

  const { data: branchesData } = useBranchList({ per_page: 200 });
  const branches = branchesData ?? [];
  const areaBranches = branches.filter((b) => b.level === "area");

  const { data, isLoading } = useAdminLeads({
    name: search || undefined,
    branch_id: branchFilter || undefined,
    status: (statusFilter as LeadStatus) || undefined,
    source: (sourceFilter as LeadSource) || undefined,
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
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      ),
      size: 110,
    },
    {
      id: "branch_name",
      accessorKey: "branch_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Branch" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.branch_name ?? "-"}
        </span>
      ),
      size: 200,
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
      cell: ({ row }) => {
        const { id } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button mode="icon" variant="ghost" size="sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={paths.dashboard.crmAndSales.leads.detail.getHref(id)}>
                  <Eye className="size-4 mr-2" /> Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRerouteLead(row.original)}>
                <RiArrowRightUpLine className="size-4 mr-2" /> Reroute
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 210,
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
          { title: t("menu.leads") },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("menu.leads")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" onClick={() => router.push(paths.dashboard.crmAndSales.leads.create.getHref())} className="font-semibold">
            <Plus className="size-4" />
            {t("leads.createLead", "Create Lead")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <DataGrid table={table} isLoading={isLoading} recordCount={total}>
        <DataGridContainer>
          <Card>
            <CardHeader>
              <CardHeading>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={t("customers.searchByName")}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applySearch()}
                      className="ps-9 w-52"
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
                  <Select value={statusFilter || "all"} onValueChange={(v) => { void setStatusFilter(v === "all" ? "" : v); void setPage(1); }}>
                    <SelectTrigger className="h-9 w-36">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={branchFilter || "all"} onValueChange={(v) => { void setBranchFilter(v === "all" ? "" : v); void setPage(1); }}>
                    <SelectTrigger className="h-9 w-40">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {areaBranches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sourceFilter || "all"} onValueChange={(v) => { void setSourceFilter(v === "all" ? "" : v); void setPage(1); }}>
                    <SelectTrigger className="h-9 w-40">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {LEAD_SOURCES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
