import { SchemaApproval, SchemaApprovalDecision } from "../types";

export const DUMMY_APPROVALS: SchemaApproval[] = [
  {
    id: "appr-001",
    schema_id: "schema-onb-002", // Onboarding Enterprise (submitted)
    required_approvers: ["role-product-admin", "role-operations-admin"],
    min_approvals: 2,
    status: "pending",
  },
  {
    id: "appr-002",
    schema_id: "schema-com-002", // Commission Enterprise (approved)
    required_approvers: ["role-finance-admin"],
    min_approvals: 1,
    status: "approved",
  },
];

export const DUMMY_APPROVAL_DECISIONS: SchemaApprovalDecision[] = [
  {
    id: "dec-001",
    schema_approval_id: "appr-001",
    approver_user_id: "user-003",
    approver_name: "Budi Santoso",
    approver_role: "Product Admin",
    decision: "approved",
    comment: "Sudah sesuai SOP",
    decided_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "dec-002",
    schema_approval_id: "appr-002",
    approver_user_id: "user-004",
    approver_name: "Sari Dewi",
    approver_role: "Finance Admin",
    decision: "approved",
    comment: "",
    decided_at: "2026-04-10T11:00:00Z",
  },
];
