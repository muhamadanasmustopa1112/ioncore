import type { AuthUser } from "@/features/user-service/types";
import type { WorkingScope } from "./types/user";
import type { UserData, UserStatus } from "./types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function statusOf(u: AuthUser): UserStatus {
  if (u.is_locked) return "locked";
  if (u.is_active === false) return "inactive";
  return "active";
}

function normalizeLevel(level?: string): "regional" | "area" | "sub_area" {
  const l = (level || "").toLowerCase();
  if (l === "area") return "area";
  if (l === "sub_area" || l === "sub-area" || l === "subarea") return "sub_area";
  return "regional";
}

export function mapAuthUserToUserData(u: AuthUser): UserData {
  const home = u.branches?.find((b) => b.id === u.home_branch_id);
  return {
    id: u.id,
    fullName: u.name || u.email || "—",
    email: u.email || "",
    employeeId: (u as any).employee_id || "",
    phone: u.phone || "",
    department: u.unit_kerja || "",
    position: u.job_title || "",
    functionName: u.function_name || "",
    workingScope: (u.working_scope || "") as WorkingScope,
    salesType: (u as any).sales_type || "",
    technicianId: (u as any).technician_id || "",
    reportsToUserId: (u as any).reports_to_user_id || "",
    homeBranchId: u.home_branch_id || "",
    activeBranchId: u.active_branch_id || "",
    homeBranchName: home?.name || "",
    avatarInitials: initials(u.name || u.email || "U"),
    status: statusOf(u),
    forcePasswordChange: !!u.force_password_change,
    lastLoginAt: null,
    roleAssignments:
      u.roles?.map((r, idx) => ({
        id: `${u.id}-${r.id}-${idx}`,
        roleId: r.id,
        roleName: r.name,
        branchId: u.home_branch_id || "",
        branchName: home?.name || "",
        branchLevel: normalizeLevel(home?.level),
        assignedAt: u.created_at || "",
        expiresAt: null,
        isActive: true,
      })) || [],
    createdAt: u.created_at || "",
    updatedAt: u.updated_at || "",
  };
}
