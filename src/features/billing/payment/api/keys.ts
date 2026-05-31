export const PAYMENT_KEYS = {
  all: () => ["PAYMENT"],
  root: () => ["PAYMENT"],
  list: (args?: Record<string, unknown>) => [
    ...PAYMENT_KEYS.all(),
    "LIST",
    { ...(args || {}) },
  ],
  detail: (id: string) => [...PAYMENT_KEYS.all(), "DETAIL", id],
  create: () => [...PAYMENT_KEYS.all(), "CREATE"],
  update: (id: string) => [...PAYMENT_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...PAYMENT_KEYS.all(), "DELETE", id],
};
