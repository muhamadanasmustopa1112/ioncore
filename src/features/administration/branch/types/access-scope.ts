export type AccessScopeFormMode = "new" | "edit" | "details" | null;

export type AccessScopeSubjectType = "user" | "role";
export type AccessPermissionLevel = "read" | "write" | "admin" | "full";

export interface AccessScopeData {
  id: string;
  subjectType: AccessScopeSubjectType;
  subjectName: string;
  subjectCode: string;
  branchScope: string[];
  scopeLevel: "regional" | "area" | "sub_area" | "all";
  permissionLevel: AccessPermissionLevel;
  canCrossBranch: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
