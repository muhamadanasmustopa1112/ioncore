export const PPP_CUSTOMER_KEYS = {
  root: () => ["PPP_CUSTOMER"],
  list: (args?: any) => [PPP_CUSTOMER_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [PPP_CUSTOMER_KEYS.root(), "DETAIL", id],
};
