export const SUSPENSION_KEYS = {
  all: () => ["SUSPENSION"],
  root: () => ["SUSPENSION"],
  list: (args?: Record<string, unknown>) => [
    ...SUSPENSION_KEYS.all(),
    "LIST",
    { ...(args || {}) },
  ],
  detail: (id: string) => [...SUSPENSION_KEYS.all(), "DETAIL", id],
  approve: (id: string) => [...SUSPENSION_KEYS.all(), "APPROVE", id],
  restore: (id: string) => [...SUSPENSION_KEYS.all(), "RESTORE", id],
};
