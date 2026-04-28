import { z } from "zod";

export const popSchema = z.object({
  name: z.string().min(1, "POP Name is required"),
  area: z.string().min(1, "Area is required"),
  latitude: z.string(),
  longitude: z.string(),
  status: z.enum(["active", "warning", "down"]),
});

export type PopFormValues = z.infer<typeof popSchema>;

export const DEFAULT_POP_VALUES: Partial<PopFormValues> = {
  name: "",
  area: "",
  latitude: "",
  longitude: "",
  status: "active",
};

export interface PopData {
  id: string;
  code?: string;
  name: string;
  ip_address?: string;
  description?: string;
  port?: number;
  area: string;
  gps_lat: number;
  gps_lng: number;
  address?: string;
  oltCount?: number;
  odpCount?: number;
  heartbeat_at?: string;
  created_at?: string;
  updated_at?: string;
  status?: "ACTIVE" | "INACTIVE" | "WARNING" | "UNKNOWN";
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