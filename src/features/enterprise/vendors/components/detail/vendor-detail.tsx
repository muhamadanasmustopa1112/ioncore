"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowLeft, Building2, CreditCard, TrendingUp } from "lucide-react";
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
import { useVendor } from "../../api/get-vendor";
import { DUMMY_PURCHASE_HISTORY, DUMMY_PRICE_BENCHMARKS } from "../../data/dummy-vendors";
import { useVendorStore } from "../../store/vendor";
import type { VendorPurchaseHistory, VendorPriceBenchmark } from "../../types/vendor";

const idr = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

function VendorInfoCard({ vendor }: { vendor: NonNullable<ReturnType<typeof useVendor>["data"]> }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vendor.company_name}</h3>
              <Badge variant={vendor.status === "active" ? "success" : "secondary"} appearance="light">{vendor.status}</Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.vendors.form.contactPerson", "Contact")}</span><span className="font-medium">{vendor.contact_person}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.vendors.form.phone", "Phone")}</span><span className="font-medium">{vendor.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.vendors.form.email", "Email")}</span><span className="font-medium">{vendor.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.vendors.form.paymentTerms", "Payment")}</span><span className="font-medium uppercase">{vendor.payment_terms.replace("_", " ")}</span></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground">{t("enterprise.vendors.detail.address", "Address")}</h4>
          <p className="text-sm">{vendor.address}</p>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">{t("enterprise.vendors.detail.categories", "Service Categories")}</h4>
            <div className="flex flex-wrap gap-1.5">
              {vendor.service_categories.map((cat) => (
                <Badge key={cat} variant="info" appearance="light" className="text-xs">{cat.replace("_", " ")}</Badge>
              ))}
            </div>
          </div>
          {(vendor.npwp || vendor.nib) && (
            <div className="space-y-2">
              {vendor.npwp && <div className="flex justify-between text-sm"><span className="text-muted-foreground">NPWP</span><span className="font-medium">{vendor.npwp}</span></div>}
              {vendor.nib && <div className="flex justify-between text-sm"><span className="text-muted-foreground">NIB</span><span className="font-medium">{vendor.nib}</span></div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PurchaseHistoryTable({ vendorId }: { vendorId: string }) {
  const { t } = useTranslation();
  const data = useMemo(() => DUMMY_PURCHASE_HISTORY.filter((p) => p.vendor_id === vendorId), [vendorId]);
  const [columnOrder, setColumnOrder] = useState<string[]>(["item_description", "quantity", "unit_price", "total_price", "purchase_date", "delivery_status"]);

  const columns = useMemo(() => [
    { id: "item_description", accessorFn: (row: VendorPurchaseHistory) => row.item_description, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.purchase.item", "Item")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPurchaseHistory> }) => <div className="font-medium">{row.original.item_description}</div>, meta: { skeleton: <Skeleton className="h-4 w-40" /> }, enableSorting: true, size: 250 },
    { id: "quantity", accessorFn: (row: VendorPurchaseHistory) => `${row.quantity} ${row.unit}`, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.purchase.qty", "Qty")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-16" /> }, enableSorting: true, size: 100 },
    { id: "unit_price", accessorFn: (row: VendorPurchaseHistory) => row.unit_price, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.purchase.unitPrice", "Unit Price")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPurchaseHistory> }) => idr(row.original.unit_price), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 140 },
    { id: "total_price", accessorFn: (row: VendorPurchaseHistory) => row.total_price, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.purchase.total", "Total")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPurchaseHistory> }) => <span className="font-semibold">{idr(row.original.total_price)}</span>, meta: { skeleton: <Skeleton className="h-4 w-28" /> }, enableSorting: true, size: 150 },
    { id: "purchase_date", accessorFn: (row: VendorPurchaseHistory) => row.purchase_date, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.purchase.date", "Date")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 120 },
    { id: "delivery_status", accessorFn: (row: VendorPurchaseHistory) => row.delivery_status, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPurchaseHistory, unknown> }) => <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPurchaseHistory> }) => <Badge variant={row.original.delivery_status === "complete" ? "success" : row.original.delivery_status === "partial" ? "warning" : "secondary"} appearance="light">{row.original.delivery_status}</Badge>, meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> }, enableSorting: true, size: 110 },
  ], [t]);

  const table = useReactTable({ columns, data, getRowId: (row) => row.id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.vendors.purchase.desc", "Purchase records from this vendor")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

function PriceBenchmarkTable() {
  const { t } = useTranslation();
  const data = DUMMY_PRICE_BENCHMARKS;
  const [columnOrder, setColumnOrder] = useState<string[]>(["vendor_name", "last_price", "avg_price_12m", "total_purchases", "last_purchase_date"]);

  const columns = useMemo(() => [
    { id: "vendor_name", accessorFn: (row: VendorPriceBenchmark) => row.vendor_name, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPriceBenchmark, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.benchmark.vendor", "Vendor")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPriceBenchmark> }) => <div className="font-medium">{row.original.vendor_name}</div>, meta: { skeleton: <Skeleton className="h-4 w-36" /> }, enableSorting: true, size: 200 },
    { id: "last_price", accessorFn: (row: VendorPriceBenchmark) => row.last_price, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPriceBenchmark, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.benchmark.lastPrice", "Last Price")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPriceBenchmark> }) => idr(row.original.last_price), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 150 },
    { id: "avg_price_12m", accessorFn: (row: VendorPriceBenchmark) => row.avg_price_12m, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPriceBenchmark, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.benchmark.avgPrice", "Avg 12M")} column={column} className="text-foreground font-semibold" />, cell: ({ row }: { row: import("@tanstack/react-table").Row<VendorPriceBenchmark> }) => idr(row.original.avg_price_12m), meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 150 },
    { id: "total_purchases", accessorFn: (row: VendorPriceBenchmark) => row.total_purchases, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPriceBenchmark, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.benchmark.purchases", "Purchases")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-16" /> }, enableSorting: true, size: 100 },
    { id: "last_purchase_date", accessorFn: (row: VendorPriceBenchmark) => row.last_purchase_date, header: ({ column }: { column: import("@tanstack/react-table").Column<VendorPriceBenchmark, unknown> }) => <DataGridColumnHeader title={t("enterprise.vendors.benchmark.lastDate", "Last Date")} column={column} className="text-foreground font-semibold" />, meta: { skeleton: <Skeleton className="h-4 w-24" /> }, enableSorting: true, size: 120 },
  ], [t]);

  const table = useReactTable({ columns, data, getRowId: (row) => row.vendor_id, state: { columnOrder }, onColumnOrderChange: setColumnOrder, columnResizeMode: "onChange", getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true }}>
      <Card>
        <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">{t("enterprise.vendors.benchmark.desc", "Price comparison across vendors")}</p></CardHeading></CardHeader>
        <CardTable><ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea></CardTable>
        <CardFooter><DataGridPagination filter={{ page: 1, limit: 10 }} setFilter={() => {}} /></CardFooter>
      </Card>
    </DataGrid>
  );
}

export function VendorDetailPage({ vendorId }: { vendorId: string }) {
  const { t } = useTranslation();
  const { data: vendor, isLoading } = useVendor(vendorId);
  const { openFormSheet, setSelectedItem } = useVendorStore();

  if (isLoading) return <div className="px-6 py-4"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-48 w-full" /></div>;
  if (!vendor) return <div className="px-6 py-4 text-muted-foreground">{t("common.notFound", "Not found")}</div>;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
        { title: t("enterprise.vendors.title", "Vendors"), path: paths.dashboard.enterprise.vendors.root.getHref() },
        { title: vendor.company_name },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}><ArrowLeft className="size-5" /></Button>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{vendor.company_name}</ToolbarTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => { setSelectedItem(vendor); openFormSheet("edit"); }}>
            <RiEditLine className="size-4" />
            {t("common.edit", "Edit")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4">
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info"><Building2 className="size-4 mr-1.5" />{t("enterprise.vendors.detail.tabInfo", "Info")}</TabsTrigger>
            <TabsTrigger value="purchases"><CreditCard className="size-4 mr-1.5" />{t("enterprise.vendors.detail.tabPurchases", "Purchase History")}</TabsTrigger>
            <TabsTrigger value="benchmark"><TrendingUp className="size-4 mr-1.5" />{t("enterprise.vendors.detail.tabBenchmark", "Price Benchmark")}</TabsTrigger>
          </TabsList>
          <TabsContent value="info"><div className="mt-3"><VendorInfoCard vendor={vendor} /></div></TabsContent>
          <TabsContent value="purchases"><div className="mt-3"><PurchaseHistoryTable vendorId={vendorId} /></div></TabsContent>
          <TabsContent value="benchmark"><div className="mt-3"><PriceBenchmarkTable /></div></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
