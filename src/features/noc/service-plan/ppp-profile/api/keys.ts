export const PPP_PROFILE_KEYS = {
  all: () => ["PPP_PROFILE"],
  root: () => ["PPP_PROFILE"],
  list: (args?: any) => ["PPP_PROFILE", "LIST", { ...(args || {}) }],
  detail: (id: string) => ["PPP_PROFILE", "DETAIL", id],
  create: () => ["PPP_PROFILE", "CREATE"],
  update: (id: string) => ["PPP_PROFILE", "UPDATE", id],
  delete: (id: string) => ["PPP_PROFILE", "DELETE", id],
};
