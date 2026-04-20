export type PPPProfileItem = {
  id: number;
  type: string;
  code: string;
  group_name: string;
  name: string;
  data_owner: string;
  plan_validity: string;
  shared_users: string;
  service_type: string;
  privileges: string;
  vat: string;
  profile_group: string;
  promo: string;
  capital_price_display: string;
  sell_price_display: string;
  vcr_customer_display: string;
  vcr_customer_tooltip: string;
  popover_content: string;
  capital_price?: number;
  sell_price?: number;
  customer_count?: number;
};

export type PPPProfileMetadata = {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
};

export type PPPProfileResponse = {
  data: PPPProfileItem[];
  metadata: PPPProfileMetadata;
};

export type PPPProfileParams = {
  page?: number;
  limit?: number;
  search?: string;
};
