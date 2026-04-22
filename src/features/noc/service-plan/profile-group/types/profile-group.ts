import { z } from "zod";

export type ProfileGroupItem = {
  id: number;
  type: string;
  code: string;
  group_name: string;
  name: string;
  data_owner: string;
  profile_type: string;
  parent_pool: string;
  module: string;
  local_address: string;
  first_address: string;
  last_address: string;
  router_nas: string;
};

export type ProfileGroupMetadata = {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
};

export type ProfileGroupResponse = {
  data: ProfileGroupItem[];
  metadata: ProfileGroupMetadata;
};

export type ProfileGroupParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ProfileGroupData = ProfileGroupItem;

export type CreateProfileGroupRequest = {
  code: string;
  data_owner: string;
  first_address: string;
  last_address: string;
  local_address: string;
  module: string;
  name: string;
  parent_pool: string;
  profile_type: string;
  router_nas: string;
};

export type CreateProfileGroupResponse = {
  message: string;
  data: ProfileGroupItem;
};