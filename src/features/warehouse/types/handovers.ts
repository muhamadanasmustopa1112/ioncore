import type { WorkOrder } from "./index";

export interface HandoversListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface HandoversListResponse {
  data: WorkOrder[];
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
