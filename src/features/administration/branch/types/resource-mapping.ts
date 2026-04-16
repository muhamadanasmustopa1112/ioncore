export type ResourceMappingFormMode = "new" | "edit" | "details" | null;

export type ResourceType = "sales_rep" | "team_leader" | "warehouse" | "noc";
export type BranchScopeLevel = "regional" | "area" | "sub_area";

export interface ResourceMappingData {
  id: string;
  resourceType: ResourceType;
  resourceName: string;
  resourceCode: string;
  branchId: string;
  branchName: string;
  scopeLevel: BranchScopeLevel;
  servesMultiple: boolean;
  additionalBranches: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
