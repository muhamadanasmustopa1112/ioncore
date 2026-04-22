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
  id: number;
  name: string;
  ip_address?: string;
  description?: string;
  port?: number;
  olt_name?: string;
  olt_port?: number;
  area: string;
  latitude: number;
  longitude: number;
  parent_pop_id?: number;
  parent_pop?: string;
}

export interface OdpResponse {
  data: OdpData[];
}

