import { z } from "zod";

export interface OnboardingStep {
  step_id: number;
  step_name: string;
  required: boolean;
  automated: boolean;
  validation_rules: string[];
  logic: string;
  work_order_type: string;
  priority: "low" | "medium" | "high";
  equipment_template: string;
  requires_approval: boolean;
  approvers: string[];
  approval_workflow: "sequential" | "parallel";
  notifications: Array<{
    recipient: string;
    type: "email" | "sms" | "in_app" | "whatsapp";
    template: string;
  }>;
}

export interface DocumentRequirement {
  document_id: string;
  document_name: string;
  required: boolean;
  description: string;
  accepted_formats: string[];
  max_size_mb: number;
  validation: "manual" | "automated";
  validation_rules: string[];
}

export interface OnboardingContent {
  schema_name: string;
  customer_type: string;
  steps: OnboardingStep[];
  timeline: {
    expected_duration_hours: number;
    sla_hours: number;
  };
  required_documents: DocumentRequirement[];
  additional_approvals: string[];
}

export const onboardingStepSchema = z.object({
  step_id: z.number().int(),
  step_name: z.string().min(1, "Step name required"),
  required: z.boolean(),
  automated: z.boolean(),
  work_order_type: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  equipment_template: z.string(),
  requires_approval: z.boolean(),
  approval_workflow: z.enum(["sequential", "parallel"]),
});

export const documentSchema = z.object({
  document_id: z.string().min(1),
  document_name: z.string().min(1, "Document name required"),
  required: z.boolean(),
  description: z.string(),
  accepted_formats: z.array(z.string()).min(1),
  max_size_mb: z.number().int().min(1).max(100),
  validation: z.enum(["manual", "automated"]),
});

export const onboardingFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.enum(["residential", "business", "enterprise", "corporate"]),
  steps: z.array(onboardingStepSchema).min(1, "At least 1 step required"),
  expected_duration_hours: z.number().int().min(1),
  sla_hours: z.number().int().min(1),
  required_documents: z.array(documentSchema),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
