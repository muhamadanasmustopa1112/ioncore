import { z } from "zod";

export const provisioningSchema = z.object({
  deviceType: z.enum(["OLT", "SWITCH", "ROUTER", "UPS", "OTHER"]),
  deviceName: z.string().min(1, "Device name is required"),
  deviceModel: z.string().min(1, "Device model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  ipAddress: z
    .string()
    .min(1, "IP address is required")
    .regex(
      /^(\d{1,3}\.){3}\d{1,3}$/,
      "Invalid IP address format"
    ),
  macAddress: z
    .string()
    .min(1, "MAC address is required")
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC address format (e.g. AA:BB:CC:DD:EE:FF)"
    ),
  status: z.enum(["active", "standby", "maintenance"]),
});

export type ProvisioningFormValues = z.infer<typeof provisioningSchema>;

export const DEFAULT_PROVISIONING_VALUES: Partial<ProvisioningFormValues> = {
  deviceType: "OLT",
  status: "active",
  deviceName: "",
  deviceModel: "",
  serialNumber: "",
  ipAddress: "",
  macAddress: "",
};
