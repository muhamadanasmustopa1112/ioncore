export const INVOICE_KEYS = {
  all: () => ["INVOICE"],
  root: () => ["INVOICE"],
  list: (args?: Record<string, unknown>) => [
    ...INVOICE_KEYS.all(),
    "LIST",
    { ...(args || {}) },
  ],
  detail: (id: string) => [...INVOICE_KEYS.all(), "DETAIL", id],
  create: () => [...INVOICE_KEYS.all(), "CREATE"],
  update: (id: string) => [...INVOICE_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...INVOICE_KEYS.all(), "DELETE", id],
};
