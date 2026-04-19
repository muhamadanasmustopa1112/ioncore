export type AuditActionType =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "publish"
  | "approve"
  | "reject"
  | "override";

export type AuditModule =
  | "schema_builder"
  | "product_catalog"
  | "branch"
  | "user"
  | "wo_checklist"
  | "platform_config"
  | "integration"
  | "audit";

export type AuditStatus = "success" | "partial" | "failed";

export interface AuditLogDto {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  action_type: AuditActionType;
  module: AuditModule;
  section: string;
  record_type: string;
  record_id: string;
  record_identifier: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  change_reason: string | null;
  ip_address: string | null;
  session_id: string | null;
  status: AuditStatus;
  error_message: string | null;
}

export interface AuditLogListResponse {
  audit_logs: AuditLogDto[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface AuditLogFilters {
  page?: number;
  per_page?: number;
  from_date?: string;
  to_date?: string;
  user_id?: string[];
  action_type?: AuditActionType[];
  module?: AuditModule[];
  record_type?: string;
  search?: string;
  sort?: string;
}
