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
  | "archived";

export type CustomerType =
  | "residential"
  | "business"
  | "enterprise"
  | "corporate";

export type SchemaFormMode = "new" | "edit" | "details" | null;

export interface SchemaRecord {
  id: string;
  schema_type: SchemaType;
  name: string;
  customer_type: CustomerType;
  version: string;
  status: SchemaStatus;
  content: object;
  change_reason?: string;
  created_by: string;
  published_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
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

export interface SchemaVersion {
  id: string;
  schema_type: SchemaType;
  name: string;
  customer_type: CustomerType;
  version: string;
  status: SchemaStatus;
  change_reason?: string;
  published_by?: string;
  published_at?: string;
  created_at: string;
}
