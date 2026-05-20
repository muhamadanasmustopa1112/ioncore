import type {
  WorkOrderListParams,
  TeamLeaderDashboardParams,
  NOCQueueParams,
  ListTechniciansParams,
  DispatchMapParams,
} from "../types/technician-api";

export const TECHNICIAN_KEYS = {
  all: ["technician"] as const,
  workOrders: (params: WorkOrderListParams) =>
    [...TECHNICIAN_KEYS.all, "work-orders", params] as const,
  workOrder: (id: string) =>
    [...TECHNICIAN_KEYS.all, "work-order", id] as const,
  workOrderTimeline: (id: string) =>
    [...TECHNICIAN_KEYS.all, "work-order", id, "timeline"] as const,
  teamLeaderDashboard: (params: TeamLeaderDashboardParams) =>
    [...TECHNICIAN_KEYS.all, "team-leader-dashboard", params] as const,
  nocQueue: (params: NOCQueueParams) =>
    [...TECHNICIAN_KEYS.all, "noc-queue", params] as const,
  nocApprovalLog: (id: string) =>
    [...TECHNICIAN_KEYS.all, "work-order", id, "noc-approval-log"] as const,
  inventoryRequirements: (id: string) =>
    [...TECHNICIAN_KEYS.all, "work-order", id, "inventory-requirements"] as const,
  repeatIssues: (params: { branch_id?: string; period_days?: number }) =>
    [...TECHNICIAN_KEYS.all, "repeat-issues", params] as const,
  dispatchMap: (params: DispatchMapParams) => [...TECHNICIAN_KEYS.all, "dispatch-map", params] as const,
  technicianPerformance: (params: {
    branch_id?: string;
    period_days?: number;
  }) => [...TECHNICIAN_KEYS.all, "technician-performance", params] as const,
  technicianHistory: (
    id: string,
    params: { branch_id?: string; period_days?: number },
  ) => [...TECHNICIAN_KEYS.all, "technician", id, "history", params] as const,
  customerHistory: (id: string) =>
    [...TECHNICIAN_KEYS.all, "customer", id, "history"] as const,
  siteHistory: (id: string) =>
    [...TECHNICIAN_KEYS.all, "site", id, "history"] as const,
  list: (params: ListTechniciansParams) =>
    [...TECHNICIAN_KEYS.all, "list", params] as const,
  latestLocations: (branch_id?: string) =>
    [...TECHNICIAN_KEYS.all, "latest-locations", { branch_id }] as const,
  radiusCredential: (workOrderId: string) =>
    [...TECHNICIAN_KEYS.all, "work-order", workOrderId, "radius-credential"] as const,
};
