"use client";

import { Gauge, Loader2, Package, Router } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import { useOrderList } from "@/features/operations/orders/api/orders-queries";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
  ORDER_TYPE_LABELS,
} from "@/features/operations/orders/types/orders";

export function ServiceOverview({ customerId }: { customerId: string }) {
  const { data, isLoading } = useOrderList({ customer_id: customerId, per_page: 10 });
  const orders = data?.orders ?? [];
  const activeOrder = orders.find(
    (o) => o.status === "PROCESSING" || o.status === "CONFIRMED",
  );
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Router className="size-5 text-primary" /> Service Overview
        </CardTitle>
        <CardToolbar>
          <span className="text-xs font-medium text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </span>
        </CardToolbar>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" /> Loading orders…
          </div>
        ) : activeOrder ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-primary text-white rounded-lg">
                <Gauge className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  {ORDER_TYPE_LABELS[activeOrder.order_type]}
                </p>
                <h4 className="text-xl font-bold mt-1">
                  {activeOrder.plan_name ?? "—"}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Order created {new Date(activeOrder.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge
              variant={ORDER_STATUS_VARIANTS[activeOrder.status]}
              appearance="light"
              size="md"
            >
              {ORDER_STATUS_LABELS[activeOrder.status]}
            </Badge>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 mb-6 text-center text-sm text-muted-foreground">
            No active order
          </div>
        )}

        {orders.length > 0 && (
          <>
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
              <Package className="size-4" /> All Orders
            </h4>
            <div className="rounded-lg border divide-y text-sm">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">
                      {ORDER_TYPE_LABELS[order.order_type]}
                      {order.plan_name ? ` — ${order.plan_name}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={ORDER_STATUS_VARIANTS[order.status]}
                    appearance="light"
                    size="md"
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}

        {orders.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No orders for this customer
          </p>
        )}
      </CardContent>
    </Card>
  );
}
