export const INVENTORY_CONFIG_KEYS = {
  all: () => ["INVENTORY_CONFIG"],
  root: () => ["INVENTORY_CONFIG"],
  list: (args?: Record<string, unknown>) => [...INVENTORY_CONFIG_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...INVENTORY_CONFIG_KEYS.all(), "DETAIL", id],
  create: () => [...INVENTORY_CONFIG_KEYS.all(), "CREATE"],
  update: (id: string) => [...INVENTORY_CONFIG_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...INVENTORY_CONFIG_KEYS.all(), "DELETE", id],
};
