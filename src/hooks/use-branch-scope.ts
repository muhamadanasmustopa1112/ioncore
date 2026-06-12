"use client";

import { useMemo } from "react";
import { PERMISSIONS } from "@/config/permissions";
import { useMyProfile } from "@/features/user-service/api/auth";
import { useCan, useIsSuperAdmin } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export type BranchScopeResource = "lead" | "customer" | "orders" | "work_orders";

const RESOURCE_READ_PERMISSION: Record<
  BranchScopeResource,
  string | undefined
> = {
  lead: PERMISSIONS.lead.read,
  customer: PERMISSIONS.customer.read,
  orders: PERMISSIONS.orders.read,
  work_orders: PERMISSIONS.technician.read,
};

const RESOURCE_READ_ALL_PERMISSION: Record<BranchScopeResource, string> = {
  lead: PERMISSIONS.lead.read_all,
  customer: PERMISSIONS.customer.read_all,
  orders: PERMISSIONS.orders.read_all,
  work_orders: PERMISSIONS.work_orders.read_all,
};

export function useBranchScope(resource: BranchScopeResource) {
  const rawUser = useAuthStore((s) => s.rawUser);
  const { data: meResp } = useMyProfile();
  const meUser = meResp?.data ?? rawUser;
  const isSuper = useIsSuperAdmin();

  const readPermission = RESOURCE_READ_PERMISSION[resource];
  const readAllPermission = RESOURCE_READ_ALL_PERMISSION[resource];

  const canRead = useCan(readPermission);
  const canReadAll = useCan(readAllPermission);

  const branchIds = useMemo(
    () => (meUser?.branches ?? []).map((branch) => branch.id).filter(Boolean),
    [meUser?.branches],
  );

  const isBranchScoped = useMemo(() => {
    if (isSuper) return false;
    if (canReadAll) return false;
    if (!readPermission) return false;
    return canRead;
  }, [isSuper, canReadAll, canRead, readPermission]);

  const showBranchFilter = useMemo(() => {
    if (isSuper) return true;
    return !isBranchScoped;
  }, [isSuper, isBranchScoped]);

  const primaryBranchId = useMemo(() => {
    return meUser?.active_branch_id ?? branchIds[0] ?? undefined;
  }, [meUser?.active_branch_id, branchIds]);

  return {
    isBranchScoped,
    branchIds,
    showBranchFilter,
    canReadAll,
    primaryBranchId,
    meUser,
  };
}
