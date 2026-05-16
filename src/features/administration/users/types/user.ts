import { UserRoleAssignment } from "@/store/auth-store";

export type UserStatus = "active" | "inactive" | "locked";
export type WorkingScope = "regional" | "area" | "sub_area" | "";
export type UserFormMode = "new" | "edit" | "details" | null;

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  phone: string;
  department: string;
  position: string;
  homeBranchId: string;
  homeBranchName: string;
  activeBranchId?: string;
  functionName?: string;
  workingScope?: WorkingScope;
  salesType?: "broadband" | "enterprise" | "both" | "";
  technicianId?: string;
  reportsToUserId?: string;
  avatarInitials: string;
  status: UserStatus;
  forcePasswordChange: boolean;
  lastLoginAt: string | null;
  roleAssignments: UserRoleAssignment[];
  createdAt: string;
  updatedAt: string;
}
