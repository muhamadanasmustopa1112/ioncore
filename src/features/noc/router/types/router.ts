export type RouterItem = {
  id: number;
  nasname: string;
  shortname: string;
  type: string;
  ports: number;
  description: string;
  time_zone: string;
  secret_masked: string;
  server: string;
  api_features: string;
  api_features_icon: string;
  ping_status: string;
  ping_status_label: string;
  router_name: string;
  ip_address: string;
  online_users: number;
  online_users_display: string;
  last_checked: string | null;
  last_checked_display: string;
};

export type RouterMetadata = {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
};

export type RouterResponse = {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: RouterItem[];
  metadata: RouterMetadata;
};

export type RouterParams = {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
};
