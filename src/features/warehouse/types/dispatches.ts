export interface DispatchItemInput {
  stock_item_id: number;
  work_order_material_id: number;
  quantity: number;
  qr_payload: string;
  asset_id?: number;
  batch_id?: number;
}

export interface CreateDispatchRequest {
  dispatch_number: string;
  wo_id: string;
  technician_user_id: string;
  source_warehouse_id: number;
  items: DispatchItemInput[];
}

export interface CreateDispatchResponse {
  data: ApiDispatch;
}

export interface ApiDispatchItem {
  id: number;
  dispatch_record_id: number;
  work_order_material_id: number;
  stock_item_id: number;
  asset_id?: number;
  batch_id?: number;
  quantity: number;
  qr_payload: string;
}

export interface ApiDispatch {
  id: number;
  dispatch_number: string;
  wo_id: string;
  technician_user_id: string;
  source_warehouse_id: number;
  status: string;
  signed_off_at?: string;
  items: ApiDispatchItem[];
  created_at: string;
  updated_at: string;
}

export interface DispatchesListParams {
  page?: number;
  limit?: number;
  wo_id?: string;
  technician_user_id?: string;
  source_warehouse_id?: number;
  status?: string;
}

export interface DispatchesListResponse {
  data: ApiDispatch[];
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
