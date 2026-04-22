export const BANDWIDTH_KEYS = {
  all: () => ["BANDWIDTH"],
  root: () => BANDWIDTH_KEYS.all(),
  list: (args?: any) => [...BANDWIDTH_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...BANDWIDTH_KEYS.all(), "DETAIL", id],
};
