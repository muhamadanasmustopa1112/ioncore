export const RADIUS_DASHBOARD_KEYS = {
  all: ["radius-dashboard"] as const,
  summary: () => [...RADIUS_DASHBOARD_KEYS.all, "summary"] as const,
  topologyStatus: () => [...RADIUS_DASHBOARD_KEYS.all, "topology-status"] as const,
};
