export type VersionStatus = "draft" | "pending_approval" | "approved" | "published" | "archived";

export interface ApprovalRecordDto {
  approver_id: string;
  approver_name: string;
  approver_role: string;
  approved_at: string | null;
  approval_notes: string | null;
  status: "pending" | "approved" | "rejected";
}

export interface SchemaVersionDto {
  id: string;
  template_id: string;
  version_number: string;
  status: VersionStatus;
  created_by: string;
  created_by_name: string;
  created_at: string;
  published_by: string | null;
  published_by_name: string | null;
  published_at: string | null;
  change_reason: string | null;
  approval_chain: ApprovalRecordDto[];
}

export interface VersionListResponse {
  versions: SchemaVersionDto[];
}

export interface VersionDiffResponse {
  version_a: SchemaVersionDto;
  version_b: SchemaVersionDto;
  diff_summary: string;
}
