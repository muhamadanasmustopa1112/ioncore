import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import type {
  OrderDto,
  OrderListResponse,
  OrderFilters,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../types/orders";

const BASE = `${services.order}/orders`;

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
    userServiceApi.get(BASE, { params: filters }),
  );
}

export function getOrder(id: string) {
  return cast<ApiResponse<OrderDto>>(userServiceApi.get(`${BASE}/${id}`));
}

export function createOrder(payload: CreateOrderPayload) {
  return cast<ApiResponse<OrderDto>>(userServiceApi.post(BASE, payload));
}

export function updateOrderStatus(id: string, payload: UpdateOrderStatusPayload) {
  return cast<ApiResponse<OrderDto>>(
    userServiceApi.patch(`${BASE}/${id}/status`, payload),
  );
}
