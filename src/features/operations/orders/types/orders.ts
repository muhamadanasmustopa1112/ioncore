export type OrderType =
  | "new_installation"
  | "relocation"
  | "termination"
  | "upgrade"
  | "downgrade";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  new_installation: "New Installation",
  relocation: "Relocation",
  termination: "Termination",
  upgrade: "Upgrade",
  downgrade: "Downgrade",
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
  addon_id: string;
  addon_name: string;
  price: number;
  one_time_charge: number;
}

export interface OrderDto {
  id: string;
  customer_id: string;
  order_type: OrderType;
  status: OrderStatus;
  broadband_plan_id?: string | null;
  broadband_plan_name?: string | null;
  branch_id: string;
  notes?: string | null;
  addon_orders?: AddonOrderDto[];
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface OrderListMeta {
  page: number;
  size: number;
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
  size?: number;
}

export interface CreateOrderPayload {
  customer_id: string;
  order_type: OrderType;
  broadband_plan_id?: string;
  addon_ids?: string[];
  branch_id?: string;
  notes?: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  notes?: string;
}
