import { UserRoleAssignment } from "@/store/auth-store";

export type UserStatus = "active" | "inactive" | "locked";
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
  avatarInitials: string;
  status: UserStatus;
  forcePasswordChange: boolean;
  lastLoginAt: string | null;
  roleAssignments: UserRoleAssignment[];
  createdAt: string;
  updatedAt: string;
}
