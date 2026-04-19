import type { OverrideScopeType, OverrideStatus, ExceptionAction, SignerRole } from "./overrides-api";

export type { OverrideScopeType, OverrideStatus, ExceptionAction, SignerRole };

export interface ExceptionRule {
  id: string;
  stepId: string;
  stepTitle: string;
  captureId: string | null;
  captureLabel: string | null;
  action: ExceptionAction;
  newLabel: string | null;
  newSignerRole: SignerRole | null;
  reason: string;
}

export interface Override {
  id: string;
  scopeType: OverrideScopeType;
  scopeRefId: string;
  scopeRefName: string;
  baseTemplateId: string;
  baseTemplateName: string;
  exceptionRules: ExceptionRule[];
  validFrom: string | null;
  validUntil: string | null;
  status: OverrideStatus;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export const SCOPE_TYPE_LABELS: Record<OverrideScopeType, string> = {
  customer: "Customer",
  contract: "Contract",
  service_package: "Service Package",
  customer_service_combo: "Customer + Service",
};

export const OVERRIDE_STATUS_LABELS: Record<OverrideStatus, string> = {
  pending_approval: "Pending Approval",
  active: "Active",
  archived: "Archived",
};

export const OVERRIDE_STATUS_VARIANTS: Record<OverrideStatus, "warning" | "success" | "secondary"> = {
  pending_approval: "warning",
  active: "success",
  archived: "secondary",
};

export const EXCEPTION_ACTION_LABELS: Record<ExceptionAction, string> = {
  skip: "Skip Step",
  make_optional: "Make Optional",
  make_required: "Make Required",
  modify_label: "Modify Label",
  remove_capture: "Remove Capture",
  change_signer_role: "Change Signer Role",
};
