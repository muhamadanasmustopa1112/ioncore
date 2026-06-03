"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowLeft, Building2, FileText, Send, Wallet } from "lucide-react";
import { RiEditLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { paths } from "@/config/paths";
import { useReseller } from "../../api/get-reseller";
import { DUMMY_RESELLER_AGREEMENTS, DUMMY_RESELLER_SUBMISSIONS, DUMMY_RESELLER_SETTLEMENTS } from "../../data/dummy-resellers";
import { useResellerStore } from "../../store/reseller";
import type { ResellerAgreement, ResellerSubmission, ResellerSettlement } from "../../types/reseller";

const idr = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

function InfoCard({ reseller }: { reseller: NonNullable<ReturnType<typeof useReseller>["data"]> }) {
  const { t } = useTranslation();
  const statusVariant = reseller.status === "active" ? "success" : reseller.status === "draft" ? "secondary" : reseller.status === "suspended" ? "warning" : "destructive";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{reseller.legal_name}</h3>
              <Badge variant={statusVariant} appearance="light">{reseller.status}</Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.form.contactPerson", "Contact")}</span><span className="font-medium">{reseller.contact_person}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.form.phone", "Phone")}</span><span className="font-medium">{reseller.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.form.email", "Email")}</span><span className="font-medium">{reseller.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.form.taxId", "Tax ID")}</span><span className="font-medium">{reseller.tax_id}</span></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground">{t("enterprise.resellers.detail.address", "Address")}</h4>
          <p className="text-sm">{reseller.address}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.detail.sponsor", "Sponsor Company")}</span><span className="font-medium">{reseller.parent_sister_company_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.detail.tenantId", "Platform Tenant ID")}</span><span className="font-medium">{reseller.platform_tenant_id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.resellers.detail.onboarding", "Onboarding")}</span><span className="font-medium">{reseller.onboarding_date}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AgreementsTable({ resellerId }: { resellerId: string }) {
  const { t } = useTranslation();
  const data = useMemo(() => DUMMY_RESELLER_AGREEMENTS.filter((a) => a.reseller_id === resellerId), [resellerId]);
  const [columnOrder, setColumnOrder] = useState<string[]>(["wholesale_monthly_fee", "revenue_share_pct", "reporting_day", "compliance_start_month", "status"]);

  const columns = useMemo(() => [
    { id: "wholesale_monthly_fee", accessorFn: (row: ResellerAgreement) => row.wholesale_monthly_fee, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerAgreement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.agreement.wholesaleFee", "Wholesale Fee")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerAgreement> }) => idr(row.original.wholesale_monthly_fee), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 160 },
    { id: "revenue_share_pct", accessorFn: (row: ResellerAgreement) => row.revenue_share_pct, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerAgreement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.agreement.revenueShare", "Revenue Share")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerAgreement> }) => `${row.original.revenue_share_pct}%`, meta: { skeleton: <Skeleton className="h-4 w-16" /> }, enableSorting: true, size: 130 },
    { id: "reporting_day", accessorFn: (row: ResellerAgreement) => row.reporting_day, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerAgreement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.agreement.reportingDay", "Report Day")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerAgreement> }) => row.original.reporting_day, meta: { skeleton: <Skeleton className="h-4 w-12" /> }, enableSorting: true, size: 110 },
    { id: "compliance_start_month", accessorFn: (row: ResellerAgreement) => row.compliance_start_month, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerAgreement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.agreement.complianceStart", "Compliance Start")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-20" /> }, enableSorting: true, size: 140 },
    { id: "status", accessorFn: (row: ResellerAgreement) => row.status, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerAgreement, unknown> }) => <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerAgreement> }) => <Badge variant={row.original.status === "active" ? "success" : row.original.status === "draft" ? "secondary" : row.original.status === "suspended" ? "warning" : "destructive"} appearance="light" className="text-[10px] font-semibold uppercase">{row.original.status}</Badge>, meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> }, enableSorting: true, size: 100 },
  ], [t]);

  const table = useReactTable({ columns, data, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.resellers.agreement.desc", "Reseller agreement terms and conditions")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

function SubmissionsTable({ resellerId }: { resellerId: string }) {
  const { t } = useTranslation();
  const data = useMemo(() => DUMMY_RESELLER_SUBMISSIONS.filter((s) => s.reseller_id === resellerId), [resellerId]);
  const [columnOrder, setColumnOrder] = useState<string[]>(["period_yyyy_mm", "subscriber_count", "collected_amount", "submitted_at", "status"]);

  const columns = useMemo(() => [
    { id: "period_yyyy_mm", accessorFn: (row: ResellerSubmission) => row.period_yyyy_mm, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSubmission, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.submission.period", "Period")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSubmission> }) => <span className="font-medium">{row.original.period_yyyy_mm}</span>, meta: { skeleton: <Skeleton className="h-4 w-20" /> }, enableSorting: true, size: 110 },
    { id: "subscriber_count", accessorFn: (row: ResellerSubmission) => row.subscriber_count, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSubmission, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.submission.subscribers", "Subscribers")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-16" /> }, enableSorting: true, size: 120 },
    { id: "collected_amount", accessorFn: (row: ResellerSubmission) => row.collected_amount, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSubmission, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.submission.collected", "Collected")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSubmission> }) => idr(row.original.collected_amount), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 150 },
    { id: "submitted_at", accessorFn: (row: ResellerSubmission) => row.submitted_at, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSubmission, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.submission.submittedAt", "Submitted")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSubmission> }) => new Date(row.original.submitted_at).toLocaleDateString("id-ID"), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 120 },
    { id: "status", accessorFn: (row: ResellerSubmission) => row.status, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSubmission, unknown> }) => <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSubmission> }) => <Badge variant={row.original.status === "confirmed" ? "success" : row.original.status === "pending" ? "info" : "destructive"} appearance="light" className="text-[10px] font-semibold uppercase">{row.original.status}</Badge>, meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> }, enableSorting: true, size: 110 },
  ], [t]);

  const table = useReactTable({ columns, data, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.resellers.submission.desc", "Monthly collection submissions")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

function SettlementsTable({ resellerId }: { resellerId: string }) {
  const { t } = useTranslation();
  const data = useMemo(() => DUMMY_RESELLER_SETTLEMENTS.filter((s) => s.reseller_id === resellerId), [resellerId]);
  const [columnOrder, setColumnOrder] = useState<string[]>(["period_yyyy_mm", "wholesale_fee", "revenue_share_amount", "total_due", "payment_status"]);

  const columns = useMemo(() => [
    { id: "period_yyyy_mm", accessorFn: (row: ResellerSettlement) => row.period_yyyy_mm, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSettlement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.settlement.period", "Period")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSettlement> }) => <span className="font-medium">{row.original.period_yyyy_mm}</span>, meta: { skeleton: <Skeleton className="h-4 w-20" /> }, enableSorting: true, size: 110 },
    { id: "wholesale_fee", accessorFn: (row: ResellerSettlement) => row.wholesale_fee, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSettlement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.settlement.wholesaleFee", "Wholesale Fee")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSettlement> }) => idr(row.original.wholesale_fee), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 150 },
    { id: "revenue_share_amount", accessorFn: (row: ResellerSettlement) => row.revenue_share_amount, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSettlement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.settlement.revenueShare", "Revenue Share")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSettlement> }) => idr(row.original.revenue_share_amount), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 150 },
    { id: "total_due", accessorFn: (row: ResellerSettlement) => row.total_due, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSettlement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.settlement.totalDue", "Total Due")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSettlement> }) => <span className="font-semibold">{idr(row.original.total_due)}</span>, meta: { skeleton: <Skeleton className="h-4 w-28" /> }, enableSorting: true, size: 160 },
    { id: "payment_status", accessorFn: (row: ResellerSettlement) => row.payment_status, header: ({ column }: { column: import("@tanstack/react-table").Column<ResellerSettlement, unknown> }) => <DataGridColumnHeader title={t("enterprise.resellers.settlement.paymentStatus", "Payment")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<ResellerSettlement> }) => <Badge variant={row.original.payment_status === "paid" ? "success" : row.original.payment_status === "pending" ? "warning" : "destructive"} appearance="light" className="text-[10px] font-semibold uppercase">{row.original.payment_status}</Badge>, meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> }, enableSorting: true, size: 120 },
  ], [t]);

  const table = useReactTable({ columns, data, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.resellers.settlement.desc", "Payment settlements and dues")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

export function ResellerDetailPage({ resellerId }: { resellerId: string }) {
  const { t } = useTranslation();
  const { data: reseller, isLoading } = useReseller(resellerId);
  const { openFormSheet, setSelectedItem } = useResellerStore();

  if (isLoading) return <div className="px-6 py-4"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-48 w-full" /></div>;
  if (!reseller) return <div className="px-6 py-4 text-muted-foreground">{t("common.notFound", "Not found")}</div>;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
        { title: t("enterprise.resellers.title", "Resellers"), path: paths.dashboard.enterprise.resellers.root.getHref() },
        { title: reseller.legal_name },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}><ArrowLeft className="size-5" /></Button>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{reseller.legal_name}</ToolbarTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => { setSelectedItem(reseller); openFormSheet("edit"); }}>
            <RiEditLine className="size-4" />
            {t("common.edit", "Edit")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4">
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info"><Building2 className="size-4 mr-1.5" />{t("enterprise.resellers.detail.tabInfo", "Info")}</TabsTrigger>
            <TabsTrigger value="agreements"><FileText className="size-4 mr-1.5" />{t("enterprise.resellers.detail.tabAgreements", "Agreements")}</TabsTrigger>
            <TabsTrigger value="submissions"><Send className="size-4 mr-1.5" />{t("enterprise.resellers.detail.tabSubmissions", "Submissions")}</TabsTrigger>
            <TabsTrigger value="settlements"><Wallet className="size-4 mr-1.5" />{t("enterprise.resellers.detail.tabSettlements", "Settlements")}</TabsTrigger>
          </TabsList>
          <TabsContent value="info"><div className="mt-3"><InfoCard reseller={reseller} /></div></TabsContent>
          <TabsContent value="agreements"><div className="mt-3"><AgreementsTable resellerId={resellerId} /></div></TabsContent>
          <TabsContent value="submissions"><div className="mt-3"><SubmissionsTable resellerId={resellerId} /></div></TabsContent>
          <TabsContent value="settlements"><div className="mt-3"><SettlementsTable resellerId={resellerId} /></div></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
