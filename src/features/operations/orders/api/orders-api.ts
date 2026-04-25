import { api } from "@/lib/api-client";
import type {
  OrderDto,
  OrderListResponse,
  OrderFilters,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../types/orders";

const BASE = "/order/api/v1/orders";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  message: string;
  data: T | null;
  error: string;
  metadata: unknown;
}

export function listOrders(filters?: OrderFilters) {
  return cast<ApiResponse<OrderListResponse>>(
    api.get(BASE, { params: filters }),
  );
}

export function getOrder(id: string) {
  return cast<ApiResponse<OrderDto>>(api.get(`${BASE}/${id}`));
}

export function createOrder(payload: CreateOrderPayload) {
  return cast<ApiResponse<OrderDto>>(api.post(BASE, payload));
}

export function updateOrderStatus(id: string, payload: UpdateOrderStatusPayload) {
  return cast<ApiResponse<OrderDto>>(
    api.patch(`${BASE}/${id}/status`, payload),
  );
}
