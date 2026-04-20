import { create } from "zustand";
import type { AuthPayload, AuthUser } from "@/features/user-service/types";

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

export interface AuthTokensState {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  expiresAt?: string;
  refreshExpiresAt?: string;
}

interface AuthStore {
  user: AuthUserContext | null;
  rawUser: AuthUser | null;
  tokens: AuthTokensState | null;
  isAuthenticated: boolean;
  loginAs: (user: AuthUserContext) => void;
  loginFromPayload: (payload: AuthPayload) => AuthUserContext;
  setProfile: (user: AuthUser) => AuthUserContext;
  logout: () => void;
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "U";
}

function inferBranchLevel(
  level?: string,
): UserRoleAssignment["branchLevel"] {
  const l = (level || "").toLowerCase();
  if (l.includes("sub")) return "sub_area";
  if (l.includes("area")) return "area";
  return "regional";
}

export function mapAuthUserToContext(user: AuthUser): AuthUserContext {
  const branches = user.branches || [];
  const roles = user.roles || [];
  const primaryBranch =
    branches.find((b) => b.id === user.active_branch_id) ||
    branches.find((b) => b.id === user.home_branch_id) ||
    branches[0];

  const roleAssignments: UserRoleAssignment[] = [];
  roles.forEach((role) => {
    (branches.length ? branches : [primaryBranch]).forEach((branch) => {
      if (!branch) return;
      roleAssignments.push({
        id: `${role.id}:${branch.id}`,
        roleId: role.id,
        roleName: role.name,
        branchId: branch.id,
        branchName: branch.name || "",
        branchLevel: inferBranchLevel(branch.level),
        assignedAt: user.created_at || new Date().toISOString(),
        expiresAt: null,
        isActive: user.is_active ?? true,
      });
    });
  });

  return {
    id: user.id,
    fullName: user.name,
    email: user.email,
    avatarInitials: toInitials(user.name),
    primaryRole: roles[0]?.name || "User",
    primaryBranch: primaryBranch?.name || "—",
    roleAssignments,
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  rawUser: null,
  tokens: null,
  isAuthenticated: false,
  loginAs: (user) => set({ user, isAuthenticated: true }),
  loginFromPayload: (payload) => {
    const ctx = mapAuthUserToContext(payload.user);
    set({
      user: ctx,
      rawUser: payload.user,
      tokens: {
        accessToken: payload.tokens.access_token,
        refreshToken: payload.tokens.refresh_token,
        sessionId: payload.session?.id,
        expiresAt: payload.tokens.expires_at,
        refreshExpiresAt: payload.tokens.refresh_expires_at,
      },
      isAuthenticated: true,
    });
    return ctx;
  },
  setProfile: (user) => {
    const ctx = mapAuthUserToContext(user);
    set({ user: ctx, rawUser: user, isAuthenticated: true });
    return ctx;
  },
  logout: () =>
    set({
      user: null,
      rawUser: null,
      tokens: null,
      isAuthenticated: false,
    }),
}));
