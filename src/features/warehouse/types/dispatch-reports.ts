export interface DispatchReportsListParams {
  page: number;
  limit: number;
}

export interface DispatchReportItem {
  dispatch_number: string;
  wo_id: string;
  technician_user_id: string;
  source_warehouse_id: number;
  line_count: number;
  total_quantity: number;
  created_at: string;
}

export interface DispatchReportsListResponse {
  data: DispatchReportItem[];
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

export const WAREHOUSE_LABELS: Record<number, string> = {
  1: "Gudang Jakarta Utara",
  2: "Gudang Bandung Utara",
  3: "Gudang Surabaya",
};

export function getWarehouseLabel(id: number): string {
  return WAREHOUSE_LABELS[id] ?? `Warehouse #${id}`;
}
