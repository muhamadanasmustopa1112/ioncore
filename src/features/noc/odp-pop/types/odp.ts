import { z } from "zod";

export const odpSchema = z.object({
  code: z.string().min(1, "Code is required"),
  gps_lat: z.string().optional().nullable(),
  gps_lng: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  olt_id: z.string().min(1, "OLT ID is required"),
  parent_id: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  total_port: z.number().min(1, "Total port must be at least 1"),
});

export type OdpFormValues = z.infer<typeof odpSchema>;

export type OdpPayload = Omit<OdpFormValues, "gps_lat" | "gps_lng"> & {
  gps_lat: number;
  gps_lng: number;
};

export const DEFAULT_ODP_VALUES: OdpFormValues = {
  code: "",
  gps_lat: "0",
  gps_lng: "0",
  name: "",
  olt_id: "",
  parent_id: null,
  status: "UP",
  total_port: 16,
};

export interface OdpData {
  id: string;
  olt_id: string;
  name: string;
  code: string;
  ip_address?: string;
  description?: string;
  port?: number;
  olt_name?: string;
  olt_port?: number;
  area: string;
  gps_lat: number;
  gps_lng: number;
  status: string;
  address: string;
  ports_used?: number;
  total_ports?: number;
  total_port?: number;
  occupied_port?: number;
  heartbeat_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OdpResponse {
  data: OdpData[];
  metadata: MetaData;
  recordsFiltered: number;
  recordsTotal: number;
}

/**
 * Filter configuration for ODP list/table
 */
export interface OdpFilter {
  limit: number;
  page: number;
  search: string | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export type OdpParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  olt_id?: string;
  pop_id?: string;
};

export interface MetaData {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
}

