export type OrderType =
  | "NEW_CONNECTION"
  // | "RELOCATION" // just dummy
  // | "TERMINATION" // just dummy
  // | "UPGRADE" // just dummy 
  // | "DOWNGRADE"; // just dummy

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  NEW_CONNECTION: "New Connection",
  // RELOCATION: "Relocation", // just dummy
  // TERMINATION: "Termination", // just dummy
  // UPGRADE: "Upgrade", // just dummy
  // DOWNGRADE: "Downgrade", // just dummy
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_VARIANTS: Record<
  OrderStatus,
  "warning" | "primary" | "info" | "success" | "destructive"
> = {
  PENDING: "warning",
  CONFIRMED: "primary",
  PROCESSING: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export interface AddonOrderDto {
  id: string;
  order_id: string;
  addon_id: string;
  addon_name: string;
  addon_price: number;
  addon_one_time_charge: number;
  created_at: string;
  created_by: string;
}

export interface OrderDto {
  id: string;
  order_number: string;
  customer_id: string;
  lead_id: string;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  plan_one_time_charge: number;
  order_type: OrderType;
  channel: string;
  status: OrderStatus;
  order_attribute: Record<string, unknown>;
  grand_total: number;
  total_monthly_price: number;
  total_one_time_charge: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface OrderDetail extends OrderDto {
  addon_orders: AddonOrderDto[];
}

export interface OrderListMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface OrderListResponse {
  orders: OrderDto[];
  metadata?: OrderListMeta;
}

export interface OrderFilters {
  customer_id?: string;
  status?: OrderStatus;
  order_type?: OrderType;
  page?: number;
  per_page?: number;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customer_id: string;
  order_type: OrderType;
  plan_id: string;
  latitude: number;
  longitude: number;
  addon_orders?: { addon_id: string; addon_attribute?: Record<string, unknown> }[];
  lead_id?: string;
  channel?: string;
  excess_cable_meters?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  notes?: string;
}
