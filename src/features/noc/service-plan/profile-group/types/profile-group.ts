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

export const profileGroupSchema = z.object({
  groupName: z.string().min(1, "Group Name is required"),
  dataOwner: z.string().min(1, "Data Owner is required"),
  routersNas: z.string().min(1, "Router is required"),
  type: z.string().min(1, "Type is required"),
  ipPoolModule: z.string().min(1, "IP Pool Module is required"),
  dnsServer: z.string().optional(),
  parentQueue: z.string().optional(),
});

export type ProfileGroupFormValues = z.infer<typeof profileGroupSchema>;

export const DEFAULT_PROFILE_GROUP_VALUES: ProfileGroupFormValues = {
  groupName: "",
  dataOwner: "Sales Retail",
  routersNas: "MikroTik-Bengkulu",
  type: "PPP",
  ipPoolModule: "GROUP ONLY",
  dnsServer: "8.8.8.8",
  parentQueue: "",
};

export const MOCK_PROFILE_GROUP_VALUES: ProfileGroupFormValues = {
  groupName: "Premium Home 50M",
  dataOwner: "Sales Retail",
  routersNas: "MikroTik-Bengkulu",
  type: "PPP",
  ipPoolModule: "GROUP ONLY",
  dnsServer: "8.8.8.8, 1.1.1.1",
  parentQueue: "none",
};

export type ProfileGroupData = ProfileGroupItem;
