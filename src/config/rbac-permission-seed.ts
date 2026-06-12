import type { CreatePermissionRequest } from "@/features/user-service/types";

export type RbacPermissionSeed = CreatePermissionRequest;

function perm(
  resource: string,
  action: string,
  description: string,
): RbacPermissionSeed {
  return {
    name: `${resource}.${action}`,
    resource,
    action,
    description,
  };
}

/**
 * Canonical RBAC permission catalog.
 * POST each entry to /ion-user-service/api/v1/permissions
 * { name, resource, action, description }
 */
export const RBAC_PERMISSION_SEED: RbacPermissionSeed[] = [
  // ── Tahap_1 / user-service seed ──────────────────────
  perm("access", "read", "Read access policies and exceptions"),
  perm("access", "create", "Create access policies"),
  perm("access", "update", "Update access policies"),
  perm("access", "delete", "Delete access policies"),
  perm("access", "approve", "Approve access requests"),
  perm("access", "submit", "Submit access requests"),
  perm("access", "route", "Route access requests"),
  perm("audit", "read", "View audit logs"),
  perm("auth", "login", "Authenticate to the platform"),
  perm("auth", "logout", "End authenticated session"),
  perm("auth", "refresh_token", "Refresh authentication tokens"),
  perm("auth", "impersonate", "Impersonate another user"),
  perm("budget", "read", "View finance and budget reports"),
  perm("budget", "approve", "Approve budget requests"),
  perm("budget", "validate", "Validate budget submissions"),
  perm("master", "read", "Read master data and branch hierarchy"),
  perm("master", "manage", "Manage master data and platform configuration"),
  perm("permission", "manage", "Manage permission catalog"),
  perm("quota", "read", "View quota allocations"),
  perm("quota", "request", "Request quota changes"),
  perm("quota", "adjust.midyear", "Perform mid-year quota adjustments"),
  perm("role", "manage", "Manage roles and role assignments"),
  perm("schema", "approve", "Approve schema changes"),
  perm("user", "manage", "Manage user accounts"),

  // ── Portal modules (menu + route guards) ─────────────
  perm("dashboard", "read", "Access main dashboard"),
  perm("crm", "read", "Access CRM & Sales module"),
  perm("customer", "read", "View customers"),
  perm("customer", "read_all", "View customers across all branches"),
  perm("customer", "create", "Create customers"),
  perm("customer", "update", "Update customers"),
  perm("lead", "read", "View leads"),
  perm("lead", "read_all", "View leads across all branches"),
  perm("lead", "create", "Create leads"),
  perm("lead", "update", "Update leads"),
  perm("lead", "route", "Reroute leads to another branch"),
  perm("lead", "approve", "Approve lead status changes"),
  perm("orders", "read_all", "View all orders across branches"),
  perm("orders", "read", "View orders in assigned scope"),
  perm("orders", "create", "Create orders"),
  perm("orders", "update", "Update orders"),
  perm("orders", "approve", "Approve orders"),
  perm("network", "read", "Access network orchestration module"),
  perm("network", "manage", "Manage network configuration"),
  perm("technician", "read", "Access technician and field module"),
  perm("technician", "manage", "Manage technician work orders"),
  perm("warehouse", "read", "Access warehouse module"),
  perm("warehouse", "manage", "Manage warehouse stock and transfers"),
  perm("billing", "read", "Access finance module"),
  perm("billing", "invoice.read", "View invoices"),
  perm("billing", "payment.read", "View payments"),
  perm("billing", "suspension.read", "View suspensions"),
  perm("billing", "commission.read", "View commissions"),
  perm("billing", "report.read", "View finance reports"),
  perm("ops", "read", "Access operations module"),
  perm("ops", "maintenance.read", "View planned maintenance"),
  perm("ops", "bulk.read", "View bulk operations"),
  perm("ops", "calendar.read", "View operations calendar"),
  perm("ops", "announcements.read", "View announcements"),
  perm("ops", "sla.read", "View SLA monitoring"),
  perm("cs", "read", "Access customer service module"),
  perm("cs", "tickets.read", "View support tickets"),
  perm("cs", "csat.read", "View CSAT reports"),
  perm("enterprise", "read", "Access enterprise system module"),
  perm("warroom", "read", "Access war room module"),
  perm("product", "manage", "Manage product catalog"),
  perm("product", "approve", "Approve product and plan changes"),
  perm("work_orders", "read_all", "View all work orders across sales and branches"),
];
