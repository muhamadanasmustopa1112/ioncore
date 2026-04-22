export type BandwidthItem = {
  id: number;
  type: string;
  group_name: string;
  name: string;
  code: string;
  data_owner: string;
  download_mbps: number;
  upload_mbps: number;
  min_rate_up: number;
  max_rate_up: number;
  min_rate_down: number;
  max_rate_down: number;
  min_rate_up_unit: string;
  max_rate_up_unit: string;
  min_rate_down_unit: string;
  max_rate_down_unit: string;
  rate_limit: string;
  attributes?: {
    service_profile: string;
  };
  upload_display: string;
  download_display: string;
};

export type BandwidthMetadata = {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
};

export type BandwidthResponse = {
  data: BandwidthItem[];
  metadata: BandwidthMetadata;
};

export type BandwidthParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type BandwidthData = BandwidthItem;

export type CreateBandwidthRequest = {
  name: string;
  data_owner: string;
  download_mbps: number;
  upload_mbps: number;
  min_rate_up: number;
  max_rate_up: number;
  min_rate_down: number;
  max_rate_down: number;
  min_rate_up_unit: string;
  max_rate_up_unit: string;
  min_rate_down_unit: string;
  max_rate_down_unit: string;
  rate_limit: string;
  attributes?: {
    service_profile: string;
  };
};

export type CreateBandwidthResponse = {
  message: string;
  data: BandwidthItem;
};
