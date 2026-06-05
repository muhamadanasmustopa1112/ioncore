import type { WarehouseAsset } from "./index";

export interface SerializedAssetsListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface SerializedAssetsListResponse {
  data: WarehouseAsset[];
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
