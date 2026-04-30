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
  total_port?: number;
  occupied_port?: number;
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

/**
 * Filter configuration for OLT list/table
 */
export interface OltFilter {
  limit: number;
  page: number;
  search: string | null;
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
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  parent_id: z.string().optional().nullable(),
  pop_id: z.string().min(1, "POP is required"),
  status: z.string().min(1, "Status is required"),
  total_port: z.number().min(1, "Total ports must be at least 1"),
});

export type OltFormValues = z.infer<typeof oltSchema>;

export const DEFAULT_OLT_VALUES: OltFormValues = {
  code: "",
  name: "",
  parent_id: null,
  pop_id: "",
  status: "UP",
  total_port: 16,
};
