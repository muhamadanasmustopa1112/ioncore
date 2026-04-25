export type SchemaType =
  | "onboarding"
  | "billing"
  | "service"
  | "commission"
  | "suspension";

export type SchemaStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "published"
  | "archived"
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

export type CustomerType = string;

export type SchemaFormMode = "new" | "edit" | "details" | null;

/** Shape returned by GET /v1/schemas/ list endpoint */
export interface SchemaRecord {
  id: string;
  schema_type: string;
  name: string;
  customer_type: CustomerType;
  schema_mode_type?: string;
  latest_version: string;
  created_by: string;
  updated_by: string;
}

export interface SchemaApproval {
  id: string;
  schema_id: string;
  required_approvers: string[];
  min_approvals: number;
  status: "pending" | "approved" | "rejected";
}

export interface SchemaApprovalDecision {
  id: string;
  schema_approval_id: string;
  approver_user_id: string;
  approver_name: string;
  approver_role: string;
  decision: "approved" | "rejected";
  comment?: string;
  decided_at: string;
}

/** Shape returned by GET /v1/schemas/:id/versions */
export interface SchemaVersion {
  id: string;
  schema_id: string;
  version: string;
  status: SchemaStatus;
  change_reason?: string;
  content: object;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  published_by: string;
}
