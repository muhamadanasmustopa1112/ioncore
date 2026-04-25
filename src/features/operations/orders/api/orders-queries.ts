import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} from "./orders-api";
import type { OrderFilters, CreateOrderPayload, UpdateOrderStatusPayload } from "../types/orders";

export const orderKeys = {
  all: ["orders"] as const,
  list: (filters: OrderFilters) => [...orderKeys.all, "list", filters] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrderList(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async () => {
      const res = await listOrders(filters);
      return res.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const res = await getOrder(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order created");
    },
    onError: () => toast.error("Failed to create order"),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusPayload }) =>
      updateOrderStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });
}
