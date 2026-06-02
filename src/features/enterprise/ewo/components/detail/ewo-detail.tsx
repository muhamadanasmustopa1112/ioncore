"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowLeft, Building2, ClipboardList, MapPin, Calendar, User, Wrench, Clock } from "lucide-react";
import { RiEditLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { paths } from "@/config/paths";
import { useEwo } from "../../api/get-ewo";
import { useEwoStore } from "../../store/ewo";
import type { EwoLine, EwoStatus, EwoPriority, EwoStatusHistory } from "../../types/ewo";

const idr = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<EwoStatus, "secondary" | "info" | "warning" | "success"> = {
  draft: "secondary", assigned: "info", in_progress: "warning", completed: "success", closed: "secondary",
};

const priorityVariant: Record<EwoPriority, "secondary" | "info" | "warning" | "destructive"> = {
  low: "secondary", medium: "info", high: "warning", critical: "destructive",
};

function EwoInfoCard({ ewo }: { ewo: NonNullable<ReturnType<typeof useEwo>["data"]> }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardList className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{ewo.ewo_number}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant={statusVariant[ewo.status]} appearance="light" className="text-[10px] font-semibold capitalize">
                {ewo.status.replace("_", " ")}
              </Badge>
              <Badge variant={priorityVariant[ewo.priority]} appearance="light" className="text-[10px] font-semibold capitalize">
                {ewo.priority}
              </Badge>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.ewo.colProject", "Project")}</span><span className="font-medium">{ewo.project_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.ewo.form.projectId", "Project ID")}</span><span className="font-medium">{ewo.project_id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.ewo.form.icPoId", "IC-PO ID")}</span><span className="font-medium">{ewo.ic_po_id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.ewo.colCompany", "Company")}</span><span className="font-medium">{ewo.executing_company_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.ewo.colType", "Type")}</span><span className="font-medium">{ewo.ewo_type === "ewo_x" ? "EWO-X" : "EWO-Y"}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentCard({ ewo }: { ewo: NonNullable<ReturnType<typeof useEwo>["data"]> }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">{t("enterprise.ewo.detail.assignment", "Assignment")}</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2"><User className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("enterprise.ewo.colTechnician", "Technician")}</span><span className="font-medium ml-auto">{ewo.assigned_technician_name || "-"}</span></div>
          <div className="flex items-center gap-2"><Calendar className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("enterprise.ewo.form.scheduledDate", "Scheduled")}</span><span className="font-medium ml-auto">{ewo.scheduled_date}</span></div>
          <div className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("enterprise.ewo.form.siteName", "Site")}</span><span className="font-medium ml-auto">{ewo.site_name}</span></div>
          <div className="flex items-start gap-2"><Building2 className="size-4 text-muted-foreground mt-0.5" /><span className="text-muted-foreground">{t("enterprise.ewo.form.siteAddress", "Address")}</span><span className="font-medium ml-auto text-right max-w-[200px]">{ewo.site_address}</span></div>
        </div>
        {ewo.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">{t("enterprise.ewo.form.notes", "Notes")}</p>
            <p className="text-sm">{ewo.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LinesTable({ lines }: { lines: EwoLine[] }) {
  const { t } = useTranslation();
  const [columnOrder, setColumnOrder] = useState<string[]>(["service_name", "description", "quantity", "unit_price", "total", "status"]);

  const columns = useMemo(() => [
    { id: "service_name", accessorFn: (row: EwoLine) => row.service_name, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.ewo.lines.service", "Service")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<EwoLine> }) => <div className="font-medium">{row.original.service_name}</div>, meta: { skeleton: <Skeleton className="h-4 w-32" /> }, enableSorting: true, size: 180 },
    { id: "description", accessorFn: (row: EwoLine) => row.description, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.ewo.lines.description", "Description")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<EwoLine> }) => <span className="text-sm text-muted-foreground">{row.original.description}</span>, meta: { skeleton: <Skeleton className="h-4 w-40" /> }, enableSorting: false, size: 250 },
    { id: "quantity", accessorFn: (row: EwoLine) => `${row.quantity} ${row.unit}`, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.ewo.lines.qty", "Qty")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-16" /> }, enableSorting: true, size: 80 },
    { id: "unit_price", accessorFn: (row: EwoLine) => row.unit_price, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.ewo.lines.unitPrice", "Unit Price")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<EwoLine> }) => idr(row.original.unit_price), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 140 },
    { id: "total", accessorFn: (row: EwoLine) => row.quantity * row.unit_price, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("enterprise.ewo.lines.total", "Total")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<EwoLine> }) => <span className="font-semibold">{idr(row.original.quantity * row.original.unit_price)}</span>, meta: { skeleton: <Skeleton className="h-4 w-28" /> }, enableSorting: true, size: 150 },
    { id: "status", accessorFn: (row: EwoLine) => row.status, header: ({ column }: { column: import("@tanstack/react-table").Column<EwoLine, unknown> }) => <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<EwoLine> }) => <Badge variant={row.original.status === "completed" ? "success" : row.original.status === "in_progress" ? "warning" : "secondary"} appearance="light" className="text-[10px] capitalize">{row.original.status.replace("_", " ")}</Badge>, meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> }, enableSorting: true, size: 110 },
  ], [t]);

  const table = useReactTable({ columns, data: lines, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={lines.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.ewo.detail.linesDesc", "Work order line items")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

function StatusTimeline({ history }: { history: EwoStatusHistory[] }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="font-semibold text-sm text-muted-foreground mb-4">{t("enterprise.ewo.detail.timeline", "Status Timeline")}</h4>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
          {history.map((h) => (
            <div key={h.id} className="relative flex items-start gap-3">
              <div className="absolute -left-4 top-1.5 size-3 rounded-full border-2 border-primary bg-background" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[h.to_status]} appearance="light" className="text-[10px] font-semibold capitalize">
                    {h.to_status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(h.changed_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t("enterprise.ewo.detail.changedBy", "By")}: {h.changed_by}</span>
                </div>
                {h.notes && <p className="text-xs text-muted-foreground mt-1">{h.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EwoDetailPage({ ewoId }: { ewoId: string }) {
  const { t } = useTranslation();
  const { data: ewo, isLoading } = useEwo(ewoId);
  const { openFormSheet, setSelectedItem } = useEwoStore();

  if (isLoading) return <div className="px-6 py-4"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-48 w-full" /></div>;
  if (!ewo) return <div className="px-6 py-4 text-muted-foreground">{t("common.notFound", "Not found")}</div>;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
        { title: t("enterprise.ewo.title", "EWO"), path: paths.dashboard.enterprise.ewo.root.getHref() },
        { title: ewo.ewo_number },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}><ArrowLeft className="size-5" /></Button>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{ewo.ewo_number}</ToolbarTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => { setSelectedItem(ewo); openFormSheet("edit"); }}>
            <RiEditLine className="size-4" />
            {t("common.edit", "Edit")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EwoInfoCard ewo={ewo} />
          <AssignmentCard ewo={ewo} />
        </div>
        <LinesTable lines={ewo.lines} />
        <StatusTimeline history={ewo.status_history} />
      </div>
    </div>
  );
}
