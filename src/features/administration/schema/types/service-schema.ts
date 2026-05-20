import { z } from "zod";

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const maintenanceScheduleItemSchema = z.object({
  day: z.enum(DAY_KEYS),
  start_time: z.string(),
  end_time: z.string(),
});

export type MaintenanceScheduleItem = z.infer<typeof maintenanceScheduleItemSchema>;

export interface ServiceContent {
  schema_name: string;
  customer_type: string;
  sla: {
    uptime_guarantee_percentage: number;
    response_time_hours: number;
    resolution_time_hours: number;
  };
  bandwidth_profile: {
    type: "best_effort" | "dedicated" | "guaranteed_minimum";
    contention_ratio: "1:1" | "1:4" | "1:8";
  };
  support_tier: "standard" | "priority" | "dedicated";
  maintenance_window: {
    allowed: boolean;
    schedule: MaintenanceScheduleItem[];
  };
  temporary_activation_window_hours: number;
}

export const serviceFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.string().min(1, "Customer type is required"),
  sla_uptime: z.number().min(90).max(100),
  sla_response_hours: z.number().int().min(1),
  sla_resolution_hours: z.number().int().min(1),
  bandwidth_type: z.enum(["best_effort", "dedicated", "guaranteed_minimum"]),
  contention_ratio: z.enum(["1:1", "1:4", "1:8"]),
  support_tier: z.enum(["standard", "priority", "dedicated"]),
  maintenance_allowed: z.boolean(),
  maintenance_schedule: z.array(maintenanceScheduleItemSchema).optional(),
  temporary_activation_window_hours: z.number().int().min(1),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
