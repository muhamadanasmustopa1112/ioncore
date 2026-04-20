export const ROUTER_KEYS = {
  root: () => ["ROUTER"],
  list: (args?: any) => [ROUTER_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [ROUTER_KEYS.root(), "DETAIL", id],
};
