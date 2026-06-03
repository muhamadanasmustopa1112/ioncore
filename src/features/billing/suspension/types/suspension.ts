export interface AppliedSuspensionRules {
  autoSuspend?: boolean;
  requiresApproval?: boolean;
  requiresExecutiveApproval?: boolean;
  ionRadiusAction?: "full_block" | "throttle";
  throttleSpeedKbps?: number;
}

export interface ApprovalChainEntry {
  role: string;
  approver?: string;
  status: "pending" | "approved" | "rejected";
}

export interface SuspensionItem {
  id: string;
  customerId: string;
  customerName: string;
  customerType: "broadband" | "business" | "enterprise" | "corporate";
  invoiceNumber: string;
  overdueDays: number;
  status: "pending" | "approved" | "suspended" | "restored";
  suspensionSchemaVersionId: string;
  suspensionSchemaName?: string;
  suspensionSchemaVersion?: string;
  appliedSchemaRules?: AppliedSuspensionRules;
  approvalChain?: ApprovalChainEntry[];
  suspensionDate?: string;
  restoredDate?: string;
  approvedBy?: string;
  restoredBy?: string;
  reason: string;
  branch: string;
  createdAt: string;
}

export interface SuspensionMetadata {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export interface SuspensionListResponse {
  data: SuspensionItem[];
  metadata: SuspensionMetadata;
}

export interface SuspensionParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
}
