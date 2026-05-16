import { z } from "zod";

export type WoCaptureType =
  | "photo"
  | "text"
  | "number"
  | "checkbox"
  | "barcode_scan"
  | "file_upload"
  | "signature";

export type WoCategory = "photo" | "serial" | "test" | "inspection" | "signature" | "other";
export type SignOffMode = "onsite" | "otp";

export interface ProofOfWorkItem {
  item_id: string;
  item_label: string;
  category: WoCategory;
  field_type: WoCaptureType;
  required: boolean;
  instruction_markdown: string;
  order: number;
  completed: boolean;
  value: null;
  checked: boolean;
  notes: string;
  evidence: unknown[];
  completed_by: null;
  completed_at: null;
}

export interface CustomerSignOffConfig {
  mode: SignOffMode;
}

export interface CompletionRules {
  block_bast_until_all_required: boolean;
  allow_skip_optional_with_note: boolean;
  resolution_log_from_steps: boolean;
}

export interface WorkOrderSchemaContent {
  schema_name: string;
  customer_type: string;
  wo_type: string;
  product_type: string;
  proof_of_work: ProofOfWorkItem[];
  customer_sign_off: CustomerSignOffConfig;
  completion_rules: CompletionRules;
}

export const proofOfWorkItemSchema = z.object({
  item_id: z.string().min(1, "ID required"),
  item_label: z.string().min(1, "Label required"),
  category: z.enum(["photo", "serial", "test", "inspection", "signature", "other"]),
  field_type: z.enum([
    "photo",
    "text",
    "number",
    "checkbox",
    "barcode_scan",
    "file_upload",
    "signature",
  ]),
  required: z.boolean(),
  instruction_markdown: z.string(),
});

export const completionRulesSchema = z.object({
  block_bast_until_all_required: z.boolean(),
  allow_skip_optional_with_note: z.boolean(),
  resolution_log_from_steps: z.boolean(),
});

export const workOrderFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.string().min(1, "Customer type is required"),
  wo_type: z.enum([
    "new_installation",
    "maintenance",
    "termination",
    "infrastructure_deployment",
  ]),
  product_type: z.enum(["residential", "business", "enterprise", "corporate"]),
  proof_of_work: z.array(proofOfWorkItemSchema).min(1, "At least 1 proof-of-work item required"),
  sign_off_mode: z.enum(["onsite", "otp"]),
  completion_rules: completionRulesSchema,
});

export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;
export type ProofOfWorkItemFormValues = z.infer<typeof proofOfWorkItemSchema>;
export type CompletionRulesFormValues = z.infer<typeof completionRulesSchema>;
