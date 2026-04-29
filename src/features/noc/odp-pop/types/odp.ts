import { z } from "zod";

export const odpSchema = z.object({
  name: z.string().min(1, "ODP name is required"),
  ponPort: z.string().min(1, "PON port is required"),
  latitude: z
    .number({ error: "Latitude is required" })
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  longitude: z
    .number({ error: "Longitude is required" })
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  totalPorts: z
    .number({ error: "Total ports is required" })
    .min(1, "Minimum 1 port"),
  portsUsed: z
    .number({ error: "Ports used is required" })
    .min(0, "Cannot be negative"),
  status: z.enum(["active", "warning", "down"]),
});

export type OdpFormValues = z.infer<typeof odpSchema>;

export const DEFAULT_ODP_VALUES: Partial<OdpFormValues> = {
  name: "",
  ponPort: "",
  latitude: undefined,
  longitude: undefined,
  totalPorts: undefined,
  portsUsed: 0,
  status: "active",
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

