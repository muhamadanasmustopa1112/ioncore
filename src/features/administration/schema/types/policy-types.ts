import { CustomerType, SchemaType } from "./schema";

// ─── Assignment Rules ────────────────────────────────────────────────────────

export interface SchemaAssignmentRule {
  id: string;
  customer_type: CustomerType;
  billing_schema_id: string;
  billing_schema_name: string;
  onboarding_schema_id: string;
  onboarding_schema_name: string;
  service_schema_id: string;
  service_schema_name: string;
  commission_schema_id: string;
  commission_schema_name: string;
  suspension_schema_id: string;
  suspension_schema_name: string;
  updated_by: string;
  updated_at: string;
}

// ─── Per-Customer Schema Override ────────────────────────────────────────────

export type OverrideStatus = "active" | "pending_review" | "expired";

export interface OverriddenField {
  field_path: string;
  original_value: string;
  override_value: string;
}

export interface CustomerSchemaOverride {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_type: CustomerType;
  schema_type: SchemaType;
  base_schema_name: string;
  overridden_fields: OverriddenField[];
  reason: string;
  status: OverrideStatus;
  approved_by?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ─── Service Change Policy ────────────────────────────────────────────────────

export type ChangeType =
  | "upgrade"
  | "downgrade"
  | "add_on"
  | "cancellation"
  | "suspension_request"
  | "relocation";

export type EffectiveDateRule =
  | "immediate"
  | "next_billing_cycle"
  | "custom_date"
  | "requires_wo";

export interface ServiceChangePolicy {
  id: string;
  policy_name: string;
  change_type: ChangeType;
  customer_type: CustomerType;
  requires_approval: boolean;
  approval_roles: string[];
  effective_date_rule: EffectiveDateRule;
  allowed_during_contract: boolean;
  penalty_applies: boolean;
  note?: string;
  updated_by: string;
  updated_at: string;
}

// ─── Package Upgrade Eligibility Rule ────────────────────────────────────────

export type PaymentHistoryRequirement =
  | "no_overdue"
  | "no_overdue_3m"
  | "no_overdue_6m"
  | "no_restriction";

export interface UpgradeEligibilityRule {
  id: string;
  rule_name: string;
  from_tier: string;
  to_tier: string;
  customer_type: CustomerType;
  min_subscription_months: number;
  payment_history: PaymentHistoryRequirement;
  requires_approval: boolean;
  cooldown_days: number;
  active: boolean;
  updated_by: string;
  updated_at: string;
}

// ─── Instant vs WO-based Change Matrix ───────────────────────────────────────

export type ChangeAction = "instant" | "wo_required" | "not_allowed";

export interface ChangeMatrixEntry {
  id: string;
  change_type: ChangeType;
  change_label: string;
  residential: ChangeAction;
  business: ChangeAction;
  enterprise: ChangeAction;
  corporate: ChangeAction;
  note?: string;
}
