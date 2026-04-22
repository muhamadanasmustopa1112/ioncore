export const PPP_CUSTOMER_KEYS = {
  all: () => ["PPP_CUSTOMER"],
  root: () => ["PPP_CUSTOMER"],
  list: (args?: any) => ["PPP_CUSTOMER", "LIST", { ...(args || {}) }],
  detail: (id: string) => ["PPP_CUSTOMER", "DETAIL", id],
  create: () => ["PPP_CUSTOMER", "CREATE"],
  update: (id: string) => ["PPP_CUSTOMER", "UPDATE", id],
  delete: (id: string) => ["PPP_CUSTOMER", "DELETE", id],
};
