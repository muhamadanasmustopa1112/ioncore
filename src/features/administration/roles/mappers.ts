import type { Role } from "@/features/user-service/types";
import type { RoleData } from "./types";

const SYSTEM_NAMES = ["super admin", "superadmin", "super_admin", "system"];

export function mapRoleToRoleData(r: Role): RoleData {
  const lname = (r.name || "").toLowerCase();
  return {
    id: r.id,
    name: r.name || "",
    description: r.description || "",
    keyPermissions: "",
    isSystem: SYSTEM_NAMES.some((s) => lname.includes(s)),
    active: true,
    createdAt: r.created_at || "",
    updatedAt: r.updated_at || "",
  };
}
