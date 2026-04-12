import { z } from "zod";

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
    schedule: string;
  };
}

export const serviceFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.enum(["residential", "business", "enterprise", "corporate"]),
  sla_uptime: z.number().min(90).max(100),
  sla_response_hours: z.number().int().min(1),
  sla_resolution_hours: z.number().int().min(1),
  bandwidth_type: z.enum(["best_effort", "dedicated", "guaranteed_minimum"]),
  contention_ratio: z.enum(["1:1", "1:4", "1:8"]),
  support_tier: z.enum(["standard", "priority", "dedicated"]),
  maintenance_allowed: z.boolean(),
  maintenance_schedule: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
