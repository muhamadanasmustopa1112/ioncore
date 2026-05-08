"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
  ToolbarActions,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import {
  useOrderList,
  useOrder,
  useUpdateOrderStatus,
} from "../api/orders-queries";
import type { OrderDto, OrderStatus, OrderType } from "../types/orders";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
  ORDER_TYPE_LABELS,
} from "../types/orders";

const PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function OrderDetailSheet({
  orderId,
  open,
  onClose,
}: {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data: order, isLoading } = useOrder(orderId ?? "");
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  const transitions = order ? STATUS_TRANSITIONS[order.status] : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Order Detail</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : !order ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Order not found</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Order Number</p>
                <p className="font-mono font-medium">{order.order_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Status</p>
                <Badge variant={ORDER_STATUS_VARIANTS[order.status]} appearance="light" size="md">
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Type</p>
                <p>{ORDER_TYPE_LABELS[order.order_type]}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Channel</p>
                <p className="capitalize">{order.channel?.toLowerCase() ?? "—"}</p>
              </div>
              {order.plan_name && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs font-medium mb-1">Plan</p>
                  <p>{order.plan_name}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Monthly Price</p>
                <p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.total_monthly_price)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">One-time Charge</p>
                <p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.total_one_time_charge)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Created</p>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Created By</p>
                <p className="truncate">{order.created_by}</p>
              </div>
            </div>

            {order.addon_orders && order.addon_orders.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Add-ons</p>
                <div className="rounded-lg border divide-y text-sm">
                  {order.addon_orders.map((a) => (
                    <div key={a.id} className="flex justify-between items-center px-4 py-2">
                      <span>{a.addon_name}</span>
                      <span className="text-muted-foreground font-mono">
                        {a.addon_price > 0 ? `+${a.addon_price}/mo` : "Free"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transitions.length > 0 && (
              <div className="border-t pt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex gap-3">
                  <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select next status…" />
                    </SelectTrigger>
                    <SelectContent>
                      {transitions.map((s) => (
                        <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (!orderId || !selectedStatus) return;
                      updateStatus({ id: orderId, payload: { status: selectedStatus } }, { onSuccess: () => setSelectedStatus("") });
                    }}
                    disabled={!selectedStatus || isPending}
                  >
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function OrdersViewToggle() {
  const { table } = useDataGrid();
  return (
    <DataGridColumnVisibility
      table={table}
      trigger={<Button variant="outline">View</Button>}
    />
  );
}

export function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = PAGE_SIZE_OPTIONS.includes(parseInt(searchParams.get("per_page") ?? "", 10))
    ? parseInt(searchParams.get("per_page")!, 10)
    : PAGE_SIZE;
  const statusFilter = (searchParams.get("status") as OrderStatus | null) ?? "all";

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const setParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const { data, isLoading } = useOrderList({
    ...(statusFilter !== "all" && { status: statusFilter as OrderStatus }),
    page,
    per_page: perPage,
  });

  const orders: OrderDto[] = data?.orders ?? [];
  const total = data?.metadata?.total ?? 0;

  const columns = useMemo<ColumnDef<OrderDto>[]>(() => [
    {
      id: "order_number",
      accessorKey: "order_number",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Order No." className="font-semibold" />,
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.order_number}</span>,
      size: 160,
    },
    {
      id: "customer_id",
      accessorKey: "customer_id",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Customer ID" className="font-semibold" />,
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.customer_id.slice(0, 8)}…</span>,
      size: 130,
    },
    {
      id: "order_type",
      accessorKey: "order_type",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Type" className="font-semibold" />,
      cell: ({ row }) => <span className="text-sm">{ORDER_TYPE_LABELS[row.original.order_type]}</span>,
      size: 150,
    },
    {
      id: "plan_name",
      accessorKey: "plan_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Plan" className="font-semibold" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.plan_name ?? "—"}</span>,
      size: 180,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Status" className="font-semibold" />,
      cell: ({ row }) => (
        <Badge variant={ORDER_STATUS_VARIANTS[row.original.status]} appearance="light" size="md">
          {ORDER_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
      size: 120,
    },
    {
      id: "grand_total",
      accessorKey: "grand_total",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Grand Total" className="font-semibold" />,
      cell: ({ row }) => (
        <span className="text-sm font-mono">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(row.original.grand_total)}
        </span>
      ),
      size: 160,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Date" className="font-semibold" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.original.created_at).toLocaleDateString()}</span>,
      size: 110,
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <Button variant="ghost" mode="link" size="sm" onClick={() => setSelectedOrderId(row.original.id)}>
          Detail
        </Button>
      ),
      size: 80,
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    columns,
    data: orders,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
    rowCount: total,
    manualPagination: true,
    manualFiltering: true,
    getRowId: (row) => row.id,
    state: { pagination: { pageIndex: page - 1, pageSize: perPage } },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: page - 1, pageSize: perPage })
        : updater;
      setParams({
        page: next.pageIndex + 1 > 1 ? String(next.pageIndex + 1) : null,
        per_page: next.pageSize !== PAGE_SIZE ? String(next.pageSize) : null,
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-5 p-4">
      <PageBreadcrumb
        items={[
          { title: "Operations", path: paths.dashboard.operations.root.getHref() },
          { title: "Orders" },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Orders
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Select
            value={statusFilter}
            onValueChange={(v) => setParams({ status: v === "all" ? null : v, page: null })}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ToolbarActions>
      </Toolbar>

      <DataGrid table={table} isLoading={isLoading} recordCount={total}>
        <DataGridContainer>
          <Card>
            <CardHeader>
              <CardHeading>
                <span className="text-sm text-muted-foreground">
                  {total} order{total !== 1 ? "s" : ""}
                </span>
              </CardHeading>
              <OrdersViewToggle />
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

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
