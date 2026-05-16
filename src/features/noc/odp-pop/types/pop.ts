import { z } from "zod";

export const popSchema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  code: z.string().min(1, "Code is required"),
  gps_lat: z.string().min(1, "Latitude is required (please pick a point on the map)"),
  gps_lng: z.string().min(1, "Longitude is required (please pick a point on the map)"),
  name: z.string().min(1, "POP Name is required"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["UP", "DOWN", "DEGRADED", "UNKNOWN"]),
});

export type PopFormValues = z.infer<typeof popSchema>;

export const DEFAULT_POP_VALUES: Partial<PopFormValues> = {
  branch_id: "",
  code: "",
  gps_lat: "",
  gps_lng: "",
  name: "",
  status: "UP",
  address: "",
};

export interface PopData {
  id: string;
  code?: string;
  name: string;
  ip_address?: string;
  description?: string;
  port?: number;
  area: string;
  gps_lat: string;
  gps_lng: string;
  address?: string;
  oltCount?: number;
  odpCount?: number;
  heartbeat_at?: string;
  created_at?: string;
  updated_at?: string;
  status?: "UP" | "DOWN" | "DEGRADED" | "UNKNOWN";
  branch?: {
    id: string;
    name: string;
  };
  parent_id?: string;
  isValidated?: boolean;
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

export interface PopResponse {
  data: PopData[];
  metadata: MetaData;
  recordsFiltered: number;
  recordsTotal: number;
}

export type PopParams = {
  id?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
};