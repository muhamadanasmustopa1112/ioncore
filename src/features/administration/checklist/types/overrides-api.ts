export type OverrideScopeType = "customer" | "contract" | "service_package" | "customer_service_combo";
export type OverrideStatus = "pending_approval" | "active" | "archived";
export type ExceptionAction =
  | "skip"
  | "make_optional"
  | "make_required"
  | "modify_label"
  | "remove_capture"
  | "change_signer_role";
export type SignerRole = "customer" | "enterprise_pic";

export interface ExceptionRuleDto {
  id: string;
  step_id: string;
  step_title: string;
  capture_id: string | null;
  capture_label: string | null;
  action: ExceptionAction;
  new_label: string | null;
  new_signer_role: SignerRole | null;
  reason: string;
}

export interface OverrideDto {
  id: string;
  scope_type: OverrideScopeType;
  scope_ref_id: string;
  scope_ref_name: string;
  base_template_id: string;
  base_template_name: string;
  exception_rules: ExceptionRuleDto[];
  valid_from: string | null;
  valid_until: string | null;
  status: OverrideStatus;
  approved_by: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface OverrideListResponse {
  overrides: OverrideDto[];
  total: number;
  page: number;
  limit: number;
}

export interface ExceptionRulePayload {
  step_id: string;
  capture_id?: string | null;
  action: ExceptionAction;
  new_label?: string | null;
  new_signer_role?: SignerRole | null;
  reason: string;
}

export interface OverridePayload {
  scope_type: OverrideScopeType;
  scope_ref_id: string;
  base_template_id: string;
  exception_rules: ExceptionRulePayload[];
  valid_from?: string | null;
  valid_until?: string | null;
  submit_for_approval?: boolean;
}
