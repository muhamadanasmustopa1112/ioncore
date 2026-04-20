export const BANDWIDTH_KEYS = {
  root: () => ["BANDWIDTH"],
  list: (args?: any) => [BANDWIDTH_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [BANDWIDTH_KEYS.root(), "DETAIL", id],
};
