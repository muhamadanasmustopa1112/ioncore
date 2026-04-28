import { z } from "zod";

export interface OltData {
  id: string;
  code: string;
  name: string;
  area: string;
  address: string;
  gps_lat: number;
  gps_lng: number;
  pop_id: string;
  parent_id: string;
  status: string;
  last_seen: string;
  heartbeat_at: string;
  created_at: string;
  updated_at: string;
  
  // UI Compatibility Fields
  portsUsed?: number;
  totalPorts?: number;
  odpCount?: number;
  ipAddress?: string;
  ip_address?: string;
  model?: string;
}

export interface MetaData {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
}

export interface OltResponse {
  data: OltData[];
  metadata: MetaData;
  recordsFiltered: number;
  recordsTotal: number;
}

export type OltParams = {
  id?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  pop_id?: string;
  area?: string;
};

export const oltSchema = z.object({
  name: z.string().min(1, "Name is required"),
  model: z.string().min(1, "Model is required"),
  status: z.union([z.literal("active"), z.literal("warning"), z.literal("down")]),
  ipAddress: z.string().min(1, "IP Address is required"),
  totalPorts: z.number().min(1, "Total ports must be at least 1"),
  expansion: z.union([z.literal("yes"), z.literal("no")]),
  expansionPorts: z.number().optional(),
});

export type OltFormValues = z.infer<typeof oltSchema>;

export const DEFAULT_OLT_VALUES: OltFormValues = {
  name: "",
  model: "",
  status: "active",
  ipAddress: "",
  totalPorts: 16,
  expansion: "no",
  expansionPorts: undefined,
};
