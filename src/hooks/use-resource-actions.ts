"use client";

import { PERMISSIONS } from "@/config/permissions";
import { useCan } from "@/lib/permissions";

export type ActionResource = "lead" | "customer" | "orders" | "technician";

export function useResourceActions(resource: ActionResource) {
  const canCreate = useCan(
    resource === "lead"
      ? PERMISSIONS.lead.create
      : resource === "customer"
        ? PERMISSIONS.customer.create
        : resource === "orders"
          ? PERMISSIONS.orders.create
          : undefined,
  );

  const canUpdate = useCan(
    resource === "lead"
      ? PERMISSIONS.lead.update
      : resource === "customer"
        ? PERMISSIONS.customer.update
        : resource === "orders"
          ? PERMISSIONS.orders.update
          : resource === "technician"
            ? PERMISSIONS.technician.manage
            : undefined,
  );

  const canApprove = useCan(
    resource === "lead"
      ? PERMISSIONS.lead.approve
      : resource === "orders"
        ? PERMISSIONS.orders.approve
        : undefined,
  );

  const canRoute = useCan(
    resource === "lead" ? PERMISSIONS.lead.route : undefined,
  );

  const canRead = useCan(
    resource === "lead"
      ? PERMISSIONS.lead.read
      : resource === "customer"
        ? PERMISSIONS.customer.read
        : resource === "orders"
          ? PERMISSIONS.orders.read
          : resource === "technician"
            ? PERMISSIONS.technician.read
            : undefined,
  );

  const canManage = useCan(
    resource === "technician" ? PERMISSIONS.technician.manage : undefined,
  );

  const canMutateOrders = useCan([
    PERMISSIONS.orders.update,
    PERMISSIONS.orders.approve,
  ]);

  return {
    canCreate,
    canUpdate,
    canApprove,
    canRoute,
    canRead,
    canManage,
    canMutateOrders,
  };
}
