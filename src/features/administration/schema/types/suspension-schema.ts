import { z } from "zod";

export interface SuspensionContent {
  schema_name: string;
  customer_type: string;
  suspension: {
    automatic: boolean;
    trigger: "after_grace_period" | "manual";
    requires_manual_approval: boolean;
    requires_executive_approval: boolean;
    ion_radius_action: "full_block" | "throttle";
    throttle_speed_kbps: number;
    notification: boolean;
    notification_channels: string[];
  };
  restoration: {
    automatic: boolean;
    trigger: "on_payment_confirmed" | "manual";
    requires_manual_trigger: boolean;
    requires_approval: boolean;
    ion_radius_action: "restore";
  };
  termination_trigger: {
    enabled: boolean;
    trigger_basis: "days_after_invoice_due" | "days_after_suspension";
    days: number;
    waive_early_termination_penalty: boolean;
    notify_customer_days_before: number;
    auto_create_wo: boolean;
    requires_approval: boolean;
    notify_internal: string[];
  };
}

export const suspensionFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.string().min(1, "Customer type is required"),
  // Suspension block
  suspension_automatic: z.boolean(),
  suspension_trigger: z.enum(["after_grace_period", "manual"]),
  suspension_requires_manual_approval: z.boolean(),
  suspension_requires_executive_approval: z.boolean(),
  suspension_ion_radius_action: z.enum(["full_block", "throttle"]),
  suspension_throttle_speed_kbps: z.number().int().min(64).optional(),
  suspension_notification: z.boolean(),
  suspension_notification_channels: z.array(z.string()),
  // Restoration block
  restoration_automatic: z.boolean(),
  restoration_trigger: z.enum(["on_payment_confirmed", "manual"]),
  restoration_requires_manual_trigger: z.boolean(),
  restoration_requires_approval: z.boolean(),
  // Termination trigger block
  termination_enabled: z.boolean(),
  termination_trigger_basis: z.enum(["days_after_invoice_due", "days_after_suspension"]).optional(),
  termination_days: z.number().int().min(1).optional(),
  termination_notify_customer_days_before: z.number().int().min(0).optional(),
  termination_auto_create_wo: z.boolean().optional(),
  termination_requires_approval: z.boolean().optional(),
});

export type SuspensionFormValues = z.infer<typeof suspensionFormSchema>;
