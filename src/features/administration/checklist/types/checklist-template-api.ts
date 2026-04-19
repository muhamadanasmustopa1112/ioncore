export type WoType =
  | "new_installation"
  | "maintenance"
  | "termination"
  | "infrastructure_deployment";

export type MaintenanceSubtype =
  | "hardware_swap"
  | "signal_issue"
  | "config"
  | "other";

export type CaptureType =
  | "text"
  | "photo"
  | "barcode_scan"
  | "qr_scan"
  | "signature"
  | "file_upload"
  | "number"
  | "checkbox"
  | "select";

export type TemplateStatus = "draft" | "active" | "archived";

export interface CaptureConstraintsDto {
  // photo
  min_count?: number;
  max_count?: number;
  tags?: string[];
  // file_upload
  accepted_formats?: string[];
  max_size_mb?: number;
  // signature
  signer_role?: "customer" | "enterprise_pic";
  allow_remote_otp?: boolean;
  // barcode_scan / qr_scan
  must_match_reserved_asset?: boolean;
  // text
  max_length?: number;
  regex_pattern?: string;
  // number
  min?: number;
  max?: number;
}

export interface CaptureDto {
  capture_id: string;
  type: CaptureType;
  label: string;
  required: boolean;
  constraints?: CaptureConstraintsDto;
}

export interface StepDto {
  step_id: string;
  order: number;
  title: string;
  instruction_markdown?: string;
  required: boolean;
  when?: string;
  captures: CaptureDto[];
}

export interface CompletionRulesDto {
  block_bast_until_all_required: boolean;
  allow_skip_optional_with_note: boolean;
  resolution_log_from_steps: boolean;
}

export interface ChecklistTemplateDto {
  id: string;
  schema_name: string;
  schema_version: string;
  wo_type: WoType;
  maintenance_subtype?: MaintenanceSubtype;
  product_type: string;
  applies_to_package_codes: string[];
  description?: string;
  status: TemplateStatus;
  steps: StepDto[];
  completion_rules: CompletionRulesDto;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ChecklistTemplateListResponse {
  templates: ChecklistTemplateDto[];
  pagination: { page: number; per_page: number; total: number; total_pages: number };
}

export interface ChecklistTemplatePayload {
  schema_name: string;
  wo_type: WoType;
  maintenance_subtype?: MaintenanceSubtype;
  product_type: string;
  applies_to_package_codes?: string[];
  description?: string;
  steps?: StepDto[];
  completion_rules?: CompletionRulesDto;
}
