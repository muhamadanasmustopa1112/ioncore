export type CrossBranchRuleFormMode = "new" | "edit" | "details" | null;

export type CrossBranchRuleType = "dispatch" | "inventory" | "sales" | "noc";

export interface CrossBranchRuleData {
  id: string;
  name: string;
  description: string;
  ruleType: CrossBranchRuleType;
  sourceBranch: string;
  targetBranch: string;
  condition: string;
  requiresApproval: boolean;
  approvalLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
