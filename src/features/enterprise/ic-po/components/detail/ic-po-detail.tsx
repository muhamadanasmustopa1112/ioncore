"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowLeft, Building2, FileText, GitBranch } from "lucide-react";
import { RiEditLine, RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useIcPo } from "../../api/get-ic-po";
import { useIcPoStore } from "../../store/ic-po";
import type { IntercompanyPoLine } from "../../types/ic-po";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  accepted: "success",
  rejected: "destructive",
  issued: "info",
  pending_approval: "warning",
  draft: "secondary",
  in_fulfillment: "info",
  closed: "secondary",
};

const TIMELINE_STEPS = ["draft", "pending_approval", "issued", "accepted", "in_fulfillment", "closed"] as const;

function StatusTimeline({ status }: { status: string }) {
  const { t } = useTranslation();
  const labels: Record<string, string> = {
    draft: t("enterprise.icPo.status.draft", "Draft"),
    pending_approval: t("enterprise.icPo.status.pendingApproval", "Pending Approval"),
    issued: t("enterprise.icPo.status.issued", "Issued"),
    accepted: t("enterprise.icPo.status.accepted", "Accepted"),
    rejected: t("enterprise.icPo.status.rejected", "Rejected"),
    in_fulfillment: t("enterprise.icPo.status.inFulfillment", "In Fulfillment"),
    closed: t("enterprise.icPo.status.closed", "Closed"),
  };

  const rejected = status === "rejected";

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="font-semibold text-sm text-muted-foreground mb-4">{t("enterprise.icPo.detail.timeline", "Status Timeline")}</h4>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {TIMELINE_STEPS.map((step, i) => {
            const currentIndex = TIMELINE_STEPS.indexOf(status as typeof TIMELINE_STEPS[number]);
            const isCompleted = !rejected && currentIndex >= i;
            const isCurrent = step === status;
            return (
              <div key={step} className="flex items-center">
                <div className={`flex flex-col items-center gap-1 min-w-[80px] ${isCurrent ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"}`}>
                  <div className={`size-3 rounded-full border-2 ${isCompleted ? "bg-primary border-primary" : "border-muted-foreground/30"} ${isCurrent ? "ring-2 ring-primary/30" : ""}`} />
                  <span className="text-[10px] text-center leading-tight whitespace-nowrap">{labels[step]}</span>
                </div>
                {i < TIMELINE_STEPS.length - 1 && <div className={`h-0.5 w-6 mx-0.5 rounded ${isCompleted && !rejected ? "bg-primary" : "bg-muted-foreground/20"}`} />}
              </div>
            );
          })}
        </div>
        {rejected && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <span className="font-semibold">{t("enterprise.icPo.detail.rejected", "Rejected")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IcPoInfoCard({ po }: { po: NonNullable<ReturnType<typeof useIcPo>["data"]> }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GitBranch className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{po.id}</h3>
            <Badge variant={statusVariant[po.status] ?? "secondary"} appearance="light" className="text-[10px] font-semibold uppercase">
              {po.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.form.issuer", "Issuer")}</span><span className="font-medium">{po.issuer_company_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.form.receiver", "Receiver")}</span><span className="font-medium">{po.receiver_company_name}</span></div>
          {po.project_id && <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.form.projectId", "Project")}</span><span className="font-medium">{po.project_id}</span></div>}
          {po.boq_version_id && <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.detail.boqVersion", "BOQ Version")}</span><span className="font-medium">{po.boq_version_id}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.colTotal", "Total")}</span><span className="font-bold text-base">{idr(po.total_amount)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.detail.createdAt", "Created")}</span><span className="font-medium">{new Date(po.created_at).toLocaleDateString("id-ID")}</span></div>
          {po.accepted_at && <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.detail.acceptedAt", "Accepted")}</span><span className="font-medium">{new Date(po.accepted_at).toLocaleDateString("id-ID")}</span></div>}
          {po.rejection_reason && <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.icPo.detail.rejectionReason", "Rejection")}</span><span className="font-medium text-destructive">{po.rejection_reason}</span></div>}
        </div>
        {po.pdf_url && (
          <a href={po.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <FileText className="size-4" />
            {t("enterprise.icPo.detail.viewPdf", "View PDF")}
            <RiExternalLinkLine className="size-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function LinesTable({ lines }: { lines: IntercompanyPoLine[] }) {
  const { t } = useTranslation();
  const [columnOrder, setColumnOrder] = useState<string[]>(["service_name", "quantity", "unit", "unit_price", "total", "expected_delivery_date"]);

  const columns = useMemo(() => [
    {
      id: "service_name",
      accessorFn: (row: IntercompanyPoLine) => row.service_name,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.form.serviceName", "Service")} column={column} className="text-foreground font-semibold" />,
      cell: ({ row }: { row: import("@tanstack/react-table").Row<IntercompanyPoLine> }) => <div className="font-medium">{row.original.service_name}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-40" /> },
      enableSorting: true,
      size: 220,
    },
    {
      id: "quantity",
      accessorFn: (row: IntercompanyPoLine) => row.quantity,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.form.quantity", "Qty")} column={column} className="text-foreground font-semibold" />,
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: true,
      size: 80,
    },
    {
      id: "unit",
      accessorFn: (row: IntercompanyPoLine) => row.unit,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.form.unit", "Unit")} column={column} className="text-foreground font-semibold" />,
      meta: { skeleton: <Skeleton className="h-4 w-12" /> },
      enableSorting: false,
      size: 80,
    },
    {
      id: "unit_price",
      accessorFn: (row: IntercompanyPoLine) => row.unit_price,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.form.unitPrice", "Unit Price")} column={column} className="text-foreground font-semibold" />,
      cell: ({ row }: { row: import("@tanstack/react-table").Row<IntercompanyPoLine> }) => idr(row.original.unit_price),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "total",
      accessorFn: (row: IntercompanyPoLine) => row.quantity * row.unit_price,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.detail.lineTotal", "Total")} column={column} className="text-foreground font-semibold" />,
      cell: ({ row }: { row: import("@tanstack/react-table").Row<IntercompanyPoLine> }) => <span className="font-semibold">{idr(row.original.quantity * row.original.unit_price)}</span>,
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "expected_delivery_date",
      accessorFn: (row: IntercompanyPoLine) => row.expected_delivery_date,
      header: ({ column }: { column: import("@tanstack/react-table").Column<IntercompanyPoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.icPo.detail.deliveryDate", "Delivery")} column={column} className="text-foreground font-semibold" />,
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 120,
    },
  ], [t]);

  const table = useReactTable({ columns, data: lines, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={lines.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.icPo.detail.linesDesc", "Service line items in this PO")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

export function IcPoDetailPage({ icPoId }: { icPoId: string }) {
  const { t } = useTranslation();
  const { data: po, isLoading } = useIcPo(icPoId);
  const { openFormSheet, setSelectedItem } = useIcPoStore();

  if (isLoading) return <div className="px-6 py-4"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-48 w-full" /></div>;
  if (!po) return <div className="px-6 py-4 text-muted-foreground">{t("common.notFound", "Not found")}</div>;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
        { title: t("enterprise.icPo.title", "Intercompany PO"), path: paths.dashboard.enterprise.icPo.root.getHref() },
        { title: po.id },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}><ArrowLeft className="size-5" /></Button>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{po.id}</ToolbarTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => { setSelectedItem(po); openFormSheet("edit"); }}>
            <RiEditLine className="size-4" />
            {t("common.edit", "Edit")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IcPoInfoCard po={po} />
          <StatusTimeline status={po.status} />
        </div>
        <LinesTable lines={po.lines} />
      </div>
    </div>
  );
}
