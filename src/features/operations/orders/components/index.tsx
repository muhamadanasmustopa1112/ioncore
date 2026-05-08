"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  useOrderList,
  useOrder,
  useUpdateOrderStatus,
} from "../api/orders-queries";
import type {
  OrderDto,
  OrderStatus,
  OrderType,
} from "../types/orders";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
  ORDER_TYPE_LABELS,
} from "../types/orders";

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

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

  const handleStatusUpdate = () => {
    if (!orderId || !selectedStatus) return;
    updateStatus(
      { id: orderId, payload: { status: selectedStatus } },
      { onSuccess: () => setSelectedStatus("") },
    );
  };

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
          <p className="text-muted-foreground text-sm py-8 text-center">
            Order not found
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">Order ID</p>
                <p className="font-mono font-medium">{order.id.slice(0, 12)}…</p>
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
                <p className="text-muted-foreground text-xs font-medium mb-1">Created</p>
                <p>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              {order.plan_name && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs font-medium mb-1">Plan</p>
                  <p>{order.plan_name}</p>
                </div>
              )}
              {/* {order.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs font-medium mb-1">Notes</p>
                  <p className="text-muted-foreground">{order.notes}</p>
                </div>
              )} */}
            </div>

            {order.addon_orders && order.addon_orders.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Add-ons
                </p>
                <div className="rounded-lg border divide-y text-sm">
                  {order.addon_orders.map((a) => (
                    <div key={a.id} className="flex justify-between items-center px-4 py-2">
                      <span>{a.addon_name}</span>
                      <span className="text-muted-foreground font-mono">
                        {/* a.price → a.addon_price */}
                      {a.addon_price > 0 ? `+${a.addon_price}/mo` : "Free"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transitions.length > 0 && (
              <div className="border-t pt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Update Status
                </p>
                <div className="flex gap-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={(v) => setSelectedStatus(v as OrderStatus)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select next status…" />
                    </SelectTrigger>
                    <SelectContent>
                      {transitions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="primary"
                    onClick={handleStatusUpdate}
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

const ORDER_TYPE_OPTIONS: { label: string; value: OrderType | "all" }[] = [
  { label: "All Types", value: "all" },
  { label: "New Installation", value: "new_installation" },
  { label: "Relocation", value: "relocation" },
  { label: "Termination", value: "termination" },
  { label: "Upgrade", value: "upgrade" },
  { label: "Downgrade", value: "downgrade" },
];

const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function OrdersPage() {
  const [typeFilter, setTypeFilter] = useState<OrderType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useOrderList({
    ...(typeFilter !== "all" && { order_type: typeFilter }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    page,
    per_page: 20,
  });

  const orders: OrderDto[] = data?.orders ?? [];
  const total = data?.metadata?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageBreadcrumb
        items={[
          { title: "Operations", path: paths.dashboard.operations.root.getHref() },
          { title: "Orders" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardToolbar>
            <Select
              value={typeFilter}
              onValueChange={(v) => { setTypeFilter(v as OrderType | "all"); setPage(1); }}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => { setStatusFilter(v as OrderStatus | "all"); setPage(1); }}
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
          </CardToolbar>
        </CardHeader>

        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="size-4 animate-spin inline mr-2" />
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-destructive">
                    Failed to load orders
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order.id.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {order.customer_id.slice(0, 8)}…
                  </TableCell>
                  <TableCell>{ORDER_TYPE_LABELS[order.order_type]}</TableCell>
                  <TableCell>
                    <Badge
                      variant={ORDER_STATUS_VARIANTS[order.status]}
                      appearance="light"
                      size="md"
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.plan_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      mode="link"
                      size="sm"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <span className="text-muted-foreground">
              {total} order{total !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
