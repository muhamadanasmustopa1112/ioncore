export const MAINTENANCE_KEYS = {
  all: () => ["MAINTENANCE"],
  root: () => ["MAINTENANCE"],
  list: (args?: Record<string, unknown>) => [...MAINTENANCE_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...MAINTENANCE_KEYS.all(), "DETAIL", id],
  create: () => [...MAINTENANCE_KEYS.all(), "CREATE"],
  update: (id: string) => [...MAINTENANCE_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...MAINTENANCE_KEYS.all(), "DELETE", id],
};
