import type { VersionStatus } from "./versioning-api";

export type { VersionStatus };

export type VersionSheetMode = "diff" | "approve" | null;

export interface ApprovalRecord {
  approverId: string;
  approverName: string;
  approverRole: string;
  approvedAt: string | null;
  approvalNotes: string | null;
  status: "pending" | "approved" | "rejected";
}

export interface SchemaVersion {
  id: string;
  templateId: string;
  versionNumber: string;
  status: VersionStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  publishedBy: string | null;
  publishedByName: string | null;
  publishedAt: string | null;
  changeReason: string | null;
  approvalChain: ApprovalRecord[];
}

export const VERSION_STATUS_LABELS: Record<VersionStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

export const VERSION_STATUS_VARIANTS: Record<VersionStatus, "warning" | "info" | "success" | "secondary"> = {
  draft: "warning",
  pending_approval: "info",
  approved: "success",
  published: "success",
  archived: "secondary",
};
