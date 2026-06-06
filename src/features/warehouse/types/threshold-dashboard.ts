export interface ThresholdDashboardFilterParams {
  status?: string;
}

export interface ThresholdDashboardListParams
  extends ThresholdDashboardFilterParams {
  page: number;
  limit: number;
}

export interface ThresholdDashboardItem {
  threshold_alert_id: number;
  warehouse_id: number;
  warehouse_code: string;
  warehouse_name: string;
  warehouse_type: string;
  stock_item_id: number;
  sku: string;
  item_name: string;
  status: string;
  current_qty: number;
  threshold_qty: number;
  cascade_level: number;
  estimated_days_to_stockout?: number;
  suggested_action: string;
  escalation_warehouse_id?: number;
  auto_transfer_source_warehouse_id?: number;
  auto_transfer_request_id?: number;
  recipient_count: number;
  action_count: number;
  last_action_type?: string;
  last_action_by?: string;
  ack_deadline_at: string;
  acknowledged_at?: string;
  escalated_at: string;
  last_crossed_at: string;
}

export interface ThresholdDashboardListResponse {
  data: ThresholdDashboardItem[];
  metadata: {
    current_page: number;
    limit: number;
    total_page: number;
    total_data: number;
    sort_by: string;
    sort_order: string;
    filter_by: string;
  };
}

export function getThresholdStatusVariant(
  status: string
): "info" | "secondary" | "destructive" | "success" | "warning" {
  const upper = status.toUpperCase();
  if (upper === "OPEN") return "destructive";
  if (upper === "ACKNOWLEDGED") return "success";
  return "secondary";
}

export function getSuggestedActionVariant(
  action: string
): "info" | "secondary" | "destructive" | "success" | "warning" {
  const upper = action.toUpperCase();
  if (upper.includes("TRANSFER")) return "info";
  if (upper.includes("PROCUREMENT")) return "warning";
  return "secondary";
}

export function isStockCritical(item: ThresholdDashboardItem): boolean {
  return (
    item.current_qty <= item.threshold_qty ||
    item.estimated_days_to_stockout === 0
  );
}
