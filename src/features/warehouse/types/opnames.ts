import type { OpnameStatus, StockOpname } from "./index";

export interface OpnamesListParams {
  page: number;
  limit: number;
  search?: string;
  warehouse_id?: number;
  status?: string;
}

/** List row from GET /warehouse/opnames (items omitted on list). */
export interface OpnamesListItem {
  id: string;
  sessionNumber: string;
  warehouseId: string;
  warehouseName: string;
  status: OpnameStatus;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  initiatedBy: string;
  initiatedByName: string;
  totalDiscrepancies: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpnamesListResponse {
  data: OpnamesListItem[];
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

export function toStockOpname(item: OpnamesListItem): StockOpname {
  return {
    ...item,
    items: [],
  };
}

export function toStockOpnames(items: OpnamesListItem[]): StockOpname[] {
  return items.map(toStockOpname);
}

export interface StartOpnameRequest {
  scope: string;
  scope_category_id?: number;
  session_number: string;
  started_by: string;
  warehouse_id: number;
}

export interface StartOpnameResponse {
  data?: StockOpname;
}
