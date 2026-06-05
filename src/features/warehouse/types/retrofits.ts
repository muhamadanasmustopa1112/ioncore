import type { RetrofitJob } from "./index";

export interface RetrofitsListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface RetrofitsListResponse {
  data: RetrofitJob[];
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
