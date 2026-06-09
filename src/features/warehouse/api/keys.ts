export const WAREHOUSE_KEYS = {
  all: () => ["WAREHOUSE"] as const,
  dashboard: () => [...WAREHOUSE_KEYS.all(), "DASHBOARD"] as const,
  serializedAssets: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "SERIALIZED_ASSETS", params] as const,
  retrofits: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "RETROFITS", params] as const,
  handovers: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "HANDOVERS", params] as const,
  categories: () => [...WAREHOUSE_KEYS.all(), "CATEGORIES"] as const,
  stockItems: () => [...WAREHOUSE_KEYS.all(), "STOCK_ITEMS"] as const,
  stockLevels: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "STOCK_LEVELS", params] as const,
  dispatches: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "DISPATCHES", params] as const,
  transfers: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "TRANSFERS", params] as const,
  transferDetail: (id?: string) =>
    [...WAREHOUSE_KEYS.all(), "TRANSFER_DETAIL", id] as const,
  purchases: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "PURCHASES", params] as const,
  opnames: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "OPNAMES", params] as const,
  returns: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "RETURNS", params] as const,
  inventoryMovements: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "INVENTORY_MOVEMENTS", params] as const,
  dispatchReports: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "DISPATCH_REPORTS", params] as const,
  thresholdDashboard: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "THRESHOLD_DASHBOARD", params] as const,
  opnameDiscrepancies: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "OPNAME_DISCREPANCIES", params] as const,
};
