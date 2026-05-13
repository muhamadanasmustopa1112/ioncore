import { z } from "zod";

export type WoFieldType = "photo" | "text" | "number" | "checkbox";
export type WoCategory = "photo" | "serial" | "test" | "inspection" | "signature" | "other";
export type SignOffMode = "onsite" | "otp";

export interface ProofOfWorkItem {
  item_id: string;
  item_label: string;
  category: WoCategory;
  field_type: WoFieldType;
  required: boolean;
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

export interface WorkOrderSchemaContent {
  schema_name: string;
  customer_type: string;
  wo_type: string;
  proof_of_work: ProofOfWorkItem[];
  customer_sign_off: CustomerSignOffConfig;
}

export const proofOfWorkItemSchema = z.object({
  item_id: z.string().min(1, "ID required"),
  item_label: z.string().min(1, "Label required"),
  category: z.enum(["photo", "serial", "test", "inspection", "signature", "other"]),
  field_type: z.enum(["photo", "text", "number", "checkbox"]),
  required: z.boolean(),
});

export const workOrderFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.enum(["residential", "business", "enterprise", "corporate"]),
  wo_type: z.enum(["installation", "maintenance", "repair", "relocation", "deactivation"]),
  proof_of_work: z.array(proofOfWorkItemSchema).min(1, "At least 1 proof-of-work item required"),
  sign_off_mode: z.enum(["onsite", "otp"]),
});

export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;
export type ProofOfWorkItemFormValues = z.infer<typeof proofOfWorkItemSchema>;
