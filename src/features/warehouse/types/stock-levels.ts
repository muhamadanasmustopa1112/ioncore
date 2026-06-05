import type { StockLevel } from "./index";

export interface StockLevelsListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface StockLevelsListResponse {
  data: StockLevel[];
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
