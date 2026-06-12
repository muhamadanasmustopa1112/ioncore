import { PERMISSIONS } from "@/config/permissions";

/** Any one of these grants access to the Approval Center menu and page. */
export const APPROVAL_CENTER_PERMISSIONS = [
  PERMISSIONS.schema.approve,
  PERMISSIONS.product.approve,
  PERMISSIONS.lead.approve,
  PERMISSIONS.orders.approve,
  PERMISSIONS.budget.approve,
] as const;
