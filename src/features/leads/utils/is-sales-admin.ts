import type { RoleRef } from "@/features/user-service/types";

function normalizeRoleName(name: string): string {
  return name.toUpperCase().replace(/[\s-]+/g, "_");
}

export function isSalesAdminRole(roles?: RoleRef[]): boolean {
  return (
    roles?.some((role) => normalizeRoleName(role.name ?? "") === "SALES_ADMIN") ?? false
  );
}
