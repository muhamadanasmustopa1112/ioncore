export const PPP_PROFILE_KEYS = {
  root: () => ["PPP_PROFILE"],
  list: (args?: any) => [PPP_PROFILE_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [PPP_PROFILE_KEYS.root(), "DETAIL", id],
};
