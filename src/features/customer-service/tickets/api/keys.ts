export const TICKET_KEYS = {
  all: () => ["TICKET"],
  root: () => ["TICKET"],
  list: (args?: Record<string, unknown>) => [...TICKET_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...TICKET_KEYS.all(), "DETAIL", id],
  create: () => [...TICKET_KEYS.all(), "CREATE"],
  update: (id: string) => [...TICKET_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...TICKET_KEYS.all(), "DELETE", id],
};
