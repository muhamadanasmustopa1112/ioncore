import { create } from "zustand";

export interface UserRoleAssignment {
  id: string;
  roleId: string;
  roleName: string;
  branchId: string;
  branchName: string;
  branchLevel: "regional" | "area" | "sub_area";
  assignedAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export interface AuthUserContext {
  id: string;
  fullName: string;
  email: string;
  avatarInitials: string;
  roleAssignments: UserRoleAssignment[];
  primaryRole: string;
  primaryBranch: string;
}

interface AuthStore {
  user: AuthUserContext | null;
  isAuthenticated: boolean;
  loginAs: (user: AuthUserContext) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loginAs: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
