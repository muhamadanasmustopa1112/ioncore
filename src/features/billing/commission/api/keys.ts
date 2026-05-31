export const COMMISSION_KEYS = {
  all: () => ["COMMISSION"],
  root: () => ["COMMISSION"],
  list: (args?: Record<string, unknown>) => [
    ...COMMISSION_KEYS.all(),
    "LIST",
    { ...(args || {}) },
  ],
  detail: (id: string) => [...COMMISSION_KEYS.all(), "DETAIL", id],
};
