import type { AuthUser, BranchRef } from "@/features/user-service/types";

export function getPrimaryBranchFromMeUser(meUser?: AuthUser | null): BranchRef | null {
  const branches = meUser?.branches ?? [];
  return (
    branches.find((branch) => branch.id === meUser?.active_branch_id) ||
    branches.find((branch) => branch.id === meUser?.home_branch_id) ||
    branches[0] ||
    null
  );
}

export function getPrimaryBranchIdFromMeUser(meUser?: AuthUser | null): string {
  return getPrimaryBranchFromMeUser(meUser)?.id ?? "";
}
