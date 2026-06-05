export interface CreateStockItemPayload {
  active: boolean;
  brand: string;
  category_id: number;
  default_install_wo_subtype: string;
  default_maintenance_schedule_id?: string;
  default_required_skills: string[];
  model: string;
  name: string;
  requires_serial_at_intake: boolean;
  sku: string;
  sub_warehouse_allowed: boolean;
  unit: string;
  valuation_method: string;
}

export interface StockItemResponse {
  id: number;
  name: string;
  sku: string;
  brand: string;
  model: string;
  category_id: number;
  unit: string;
  active: boolean;
  valuation_method: string;
  requires_serial_at_intake: boolean;
  sub_warehouse_allowed: boolean;
  default_install_wo_subtype: string;
  default_maintenance_schedule_id?: string;
  default_required_skills: string[];
  created_at: string;
  updated_at: string;
}

export interface StockItemsListResponse {
  data: StockItemResponse[];
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
