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
  purchases: (params?: Record<string, unknown>) =>
    [...WAREHOUSE_KEYS.all(), "PURCHASES", params] as const,
};
