export const ROUTER_KEYS = {
  all: () => ["ROUTER"],
  root: () => ["ROUTER"],
  list: (args?: any) => ["ROUTER", "LIST", { ...(args || {}) }],
  detail: (id: string) => ["ROUTER", "DETAIL", id],
  create: () => ["ROUTER", "CREATE"],
  update: (id: string) => ["ROUTER", "UPDATE", id],
  delete: (id: string) => ["ROUTER", "DELETE", id],
};
