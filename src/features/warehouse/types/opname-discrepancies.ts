export interface OpnameDiscrepanciesFilterParams {
  warehouse_id?: number;
  status?: string;
}

export interface OpnameDiscrepanciesListParams
  extends OpnameDiscrepanciesFilterParams {
  page: number;
  limit: number;
}

export interface OpnameDiscrepancyItem {
  opname_session_id: number;
  session_number: string;
  warehouse_id: number;
  warehouse_code: string;
  warehouse_name: string;
  session_status: string;
  stock_item_id: number;
  sku: string;
  item_name: string;
  variance_id: number;
  variance_qty: number;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OpnameDiscrepanciesListResponse {
  data: OpnameDiscrepancyItem[];
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

export function getSessionStatusVariant(
  status: string
): "info" | "secondary" | "destructive" | "success" | "warning" {
  const upper = status.toUpperCase();
  if (upper === "RESOLVED") return "success";
  if (upper === "OPEN" || upper === "IN_PROGRESS") return "warning";
  if (upper === "PENDING") return "info";
  return "secondary";
}

export function getVarianceQtyClass(qty: number): string {
  if (qty < 0) return "text-red-600 dark:text-red-400";
  if (qty > 0) return "text-emerald-600 dark:text-emerald-400";
  return "text-foreground";
}
